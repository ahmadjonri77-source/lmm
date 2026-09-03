import { PartialType } from '@nestjs/swagger';
import { CreateAssistendDto } from './create-assistend.dto';

export class UpdateAssistendDto extends PartialType(CreateAssistendDto) {}
