import { Controller, Get, Post } from '@nestjs/common';
import { HotmartAuthService } from './auth/hotmart-auth.service';
import { HotmartTransactionService } from './hotmart-transaction/hotmart-transaction.service';

@Controller('hotmart')
export class HotmartController {
  constructor(
    private readonly authService: HotmartAuthService,
    private readonly transactionService: HotmartTransactionService,
  ) {}

  @Post('auth')
  auth() {
    return this.authService.authenticate({
      url: process.env.HOTMART_AUTH_URL,
      api_key: process.env.HOTMART_API_KEY,
    });
  }

  @Get('empreenderdinheiro/transaction/integrate')
  integrateTransactionED() {
    return this.transactionService.integrate(
      process.env.HOTMART_AUTH_URL,
      process.env.HOTMART_API_KEY,
    );
  }

  @Get('franquias/transaction/integrate')
  integrateTransactionFranquias() {
    return this.transactionService.integrate(
      process.env.HOTMART_FRANQUIAS_AUTH_URL,
      process.env.HOTMART_FRANQUIAS_API_KEY,
    );
  }
}
