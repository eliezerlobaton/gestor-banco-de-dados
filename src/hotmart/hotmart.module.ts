import { Module } from '@nestjs/common';
import { HotmartAuthService } from './auth/hotmart-auth.service';
import { HotmartController } from './hotmart.controller';
import { HttpModule } from '@nestjs/axios';
import { HotmartTransactionService } from './hotmart-transaction/hotmart-transaction.service';
import { HotmartTransactionMapper } from './mappers/hotmart-transanction.mapper';
import { HotmartUserMapper } from './mappers/hotmart-user.mapper';
import { HotmartTrackingMapper } from './mappers/hotmart-tracking.mapper';
import { HotmartVoucherMapper } from './mappers/hotmart-voucher.mapper';
import { HotmartSubscriptionMapper } from './mappers/hotmart-subscription.mapper';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assinaturas } from 'src/assinaturas/entities/assinaturas.entity';
import { Ofertas } from 'src/produtos/entities/ofertas.entity';
import { Plano } from 'src/produtos/entities/plano.entetity';
import { Produtos } from 'src/produtos/entities/produtos.entity';
import { Cupons } from 'src/transacoes/entities/cupons.entity';
import { Tracking } from 'src/transacoes/entities/tracking.entity';
import { Transacoes } from 'src/transacoes/entities/transacoes.entity';
import { Emails } from 'src/usuarios/entities/emailUsuario.entity';
import { Usuarios } from 'src/usuarios/entities/usuarios.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      Transacoes,
      Usuarios,
      Assinaturas,
      Tracking,
      Cupons,
      Emails,
      Plano,
      Produtos,
      Ofertas,
    ]),
  ],
  providers: [
    HotmartAuthService,
    HotmartTransactionService,
    HotmartTransactionMapper,
    HotmartUserMapper,
    HotmartTrackingMapper,
    HotmartVoucherMapper,
    HotmartSubscriptionMapper,
  ],
  controllers: [HotmartController],
})
export class HotmartModule {}
