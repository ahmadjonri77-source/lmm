import { Module } from '@nestjs/common';
import { HomeworkService } from './homework.service';
import { HomeworkController } from './homework.controller';
import { VideoService } from 'src/common/utils/video.service';

@Module({
  controllers: [HomeworkController],
  providers: [HomeworkService,VideoService],
})
export class HomeworkModule {}
