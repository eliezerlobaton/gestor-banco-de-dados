import { PartialType } from '@nestjs/swagger';

import { CreateTransacoesDto } from './create-transacoes.dto';

export class UpdateTransacoesDto extends PartialType(CreateTransacoesDto) { }
