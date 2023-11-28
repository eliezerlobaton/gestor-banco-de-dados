import { Module } from '@nestjs/common';
import { N8nController } from './n8n.controller';
import { N8nService } from './n8n.service';
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
import { N8nUserMapper } from './mappers/n8n-user.mapper';
import { N8nOfferMapper } from './mappers/n8n-offer.mapper';
import { N8nSubscriptionMapper } from './mappers/n8n-subscription.mapper';
import { N8nProductMapper } from './mappers/n8n-product.mapper';
import { N8nVoucherMapper } from './mappers/n8n-voucher.mapper';
import { N8nTransactionMapper } from './mappers/n8n-transaction.mapper';
import { N8nPlanMapper } from './mappers/n8n-plan.mapper';

@Module({
  imports: [
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
  controllers: [N8nController],
  providers: [
    N8nService,
    N8nUserMapper,
    N8nOfferMapper,
    N8nSubscriptionMapper,
    N8nProductMapper,
    N8nVoucherMapper,
    N8nTransactionMapper,
    N8nPlanMapper,
  ],
})
export class N8nModule {}
