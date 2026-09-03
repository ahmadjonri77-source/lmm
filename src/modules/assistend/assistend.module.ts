import { Module } from '@nestjs/common';
import { AssistendService } from './assistend.service';
import { AssistendController } from './assistend.controller';

@Module({
  controllers: [AssistendController],
  providers: [AssistendService],
})
export class AssistendModule {}
