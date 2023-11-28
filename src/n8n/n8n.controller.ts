import { Body, Controller, Post } from '@nestjs/common';
import { N8nService } from './n8n.service';
import { N8nCreateTransactionDto } from './dto/n8n-create-transaction.dto';

@Controller('n8n')
export class N8nController {
  constructor(private readonly service: N8nService) {}

  @Post('transaction')
  createTransaction(@Body() dto: N8nCreateTransactionDto) {
    return this.service.createTransaction(dto);
  }
}
