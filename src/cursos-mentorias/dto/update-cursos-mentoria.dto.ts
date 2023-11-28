import { PartialType } from '@nestjs/swagger';
import { CreateCursosMentoriaDto } from './create-cursos-mentoria.dto';

export class UpdateCursosMentoriaDto extends PartialType(CreateCursosMentoriaDto) {}
