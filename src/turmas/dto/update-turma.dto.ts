import { PartialType } from '@nestjs/swagger';
import { CreateTurmaDto } from './create-turma.dto';

export class UpdateTurmaDto extends PartialType(CreateTurmaDto) {}
