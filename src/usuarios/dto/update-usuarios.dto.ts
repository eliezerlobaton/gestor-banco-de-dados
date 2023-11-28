import { PartialType } from '@nestjs/swagger';

import { PopulateUsuariosDto } from './populate-usuarios.dto';

export class UpdateUsuariosDto extends PartialType(PopulateUsuariosDto) { }
