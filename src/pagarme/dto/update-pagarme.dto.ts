import { PartialType } from '@nestjs/swagger';
import { CreatePagarmeDto } from './create-pagarme.dto';

export class UpdatePagarmeDto extends PartialType(CreatePagarmeDto) {}
