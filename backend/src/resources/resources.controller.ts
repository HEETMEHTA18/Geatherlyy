import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  ForbiddenException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ResourcesService } from './resources.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('resources')
@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all resources' })
  @ApiResponse({ status: 200, description: 'Returns list of resources' })
  async getAllResources(
    @Query('clubId') clubId?: string,
    @Query('type') type?: string,
    @Query('search') search?: string,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.resourcesService.findAll({
      clubId: clubId ? parseInt(clubId) : undefined,
      type,
      search,
      skip: skip ? parseInt(skip.toString()) : undefined,
      take: take ? parseInt(take.toString()) : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get resource by ID' })
  @ApiResponse({ status: 200, description: 'Returns resource details' })
  @ApiResponse({ status: 404, description: 'Resource not found' })
  async getResourceById(@Param('id', ParseIntPipe) id: number) {
    return this.resourcesService.findById(id);
  }

  @Post(':id/download')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Increment download count' })
  @ApiResponse({ status: 200, description: 'Download count incremented' })
  async incrementDownloads(@Param('id', ParseIntPipe) id: number) {
    await this.resourcesService.incrementDownloads(id);
    return { message: 'Download recorded' };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COORDINATOR, UserRole.FACULTY, UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload a new resource (Coordinator/Faculty/Admin only)' })
  @ApiResponse({ status: 201, description: 'Resource uploaded successfully' })
  async createResource(
    @Body() createData: any,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    let fileUrl = createData.url;
    let fileSize = 0;

    // If file is uploaded, use Cloudinary
    if (file) {
      const cloudinaryService = this.resourcesService['cloudinary'];
      if (cloudinaryService) {
        const uploadResult = await cloudinaryService.uploadFile(file, 'gatherly/resources');
        fileUrl = uploadResult.secure_url;
        fileSize = file.size;
      }
    }

    return this.resourcesService.create({
      title: createData.title,
      description: createData.description,
      type: createData.type || 'PDF',
      url: fileUrl,
      fileSize: fileSize,
      club: {
        connect: { id: parseInt(createData.clubId) },
      },
      uploader: {
        connect: { id: req.user.id },
      },
    });
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update resource' })
  @ApiResponse({ status: 200, description: 'Resource updated successfully' })
  async updateResource(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: any,
    @Request() req,
  ) {
    const canModify = await this.resourcesService.canUserModifyResource(id, req.user.id);
    
    if (!canModify) {
      throw new ForbiddenException('You do not have permission to modify this resource');
    }

    return this.resourcesService.update(id, updateData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete resource' })
  @ApiResponse({ status: 204, description: 'Resource deleted successfully' })
  async deleteResource(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const canModify = await this.resourcesService.canUserModifyResource(id, req.user.id);
    
    if (!canModify) {
      throw new ForbiddenException('You do not have permission to delete this resource');
    }

    await this.resourcesService.delete(id);
  }
}


