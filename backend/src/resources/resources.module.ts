import { Module } from '@nestjs/common';
import { ResourcesController } from './resources.controller';
import { ResourcesDownloadController } from './resources-download.controller';
import { ResourcesService } from './resources.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [PrismaModule, CloudinaryModule],
  controllers: [ResourcesController, ResourcesDownloadController],
  providers: [ResourcesService],
  exports: [ResourcesService],
})
export class ResourcesModule {}


