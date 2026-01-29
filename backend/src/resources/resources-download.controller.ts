import {
  Controller,
  Get,
  Param,
  Res,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { ResourcesService } from './resources.service';
import * as https from 'https';
import * as http from 'http';

@Controller('resources')
export class ResourcesDownloadController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Get(':id/download')
  async downloadResource(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    // Get resource from database
    const resource = await this.resourcesService.findById(id);
    
    if (!resource) {
      throw new NotFoundException('Resource not found');
    }

    try {
      // Determine content type and extension
      const contentType = resource.type === 'PDF' 
        ? 'application/pdf' 
        : 'image/jpeg';
      const extension = resource.type === 'PDF' ? 'pdf' : 'jpg';
      const filename = `${resource.title}.${extension}`;

      // Use https or http based on URL
      const client = resource.url.startsWith('https') ? https : http;

      // Fetch the file from Cloudinary
      client.get(resource.url, (response) => {
        // Set headers for download with proper filename
        res.setHeader('Content-Type', contentType);
        res.setHeader(
          'Content-Disposition',
          `attachment; filename="${filename}"`,
        );
        if (response.headers['content-length']) {
          res.setHeader('Content-Length', response.headers['content-length']);
        }

        // Pipe the response directly to the client
        response.pipe(res);

        // Increment download count when done
        response.on('end', async () => {
          await this.resourcesService.incrementDownloads(id);
        });
      }).on('error', (error) => {
        console.error('Download error:', error);
        throw new NotFoundException('Failed to download resource');
      });
    } catch (error) {
      throw new NotFoundException('Failed to download resource');
    }
  }
}
