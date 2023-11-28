import { Injectable, Logger } from '@nestjs/common';
import { Transacoes } from 'src/transacoes/entities/transacoes.entity';
import { Repository } from 'typeorm';
import { N8nCreateTransactionDto } from './dto/n8n-create-transaction.dto';
import { N8nTransactionMapper } from './mappers/n8n-transaction.mapper';
import { N8nUserDto } from './dto/n8n-user.dto';
import { Usuarios } from 'src/usuarios/entities/usuarios.entity';
import { N8nUserMapper } from './mappers/n8n-user.mapper';
import { N8nSubscriptionDto } from './dto/n8n-subscription.dto';
import { Assinaturas } from 'src/assinaturas/entities/assinaturas.entity';
import { N8nSubscriptionMapper } from './mappers/n8n-subscription.mapper';
import { N8nVoucherDto } from './dto/n8n-voucher.dto';
import { Cupons } from 'src/transacoes/entities/cupons.entity';
import { N8nVoucherMapper } from './mappers/n8n-voucher.mapper';
import { N8nProductDto } from './dto/n8n-product.dto';
import { Produtos } from 'src/produtos/entities/produtos.entity';
import { N8nProductMapper } from './mappers/n8n-product.mapper';
import { N8nOfferDto } from './dto/n8n-offer.dto';
import { Ofertas } from 'src/produtos/entities/ofertas.entity';
import { N8nOfferMapper } from './mappers/n8n-offer.mapper';
import { InjectRepository } from '@nestjs/typeorm';
import { Emails } from 'src/usuarios/entities/emailUsuario.entity';
import { Plano } from 'src/produtos/entities/plano.entetity';
import { N8nPlanMapper } from './mappers/n8n-plan.mapper';
import { N8nPlanDto } from './dto/n8n-plan.dto';

@Injectable()
export class N8nService {
  private readonly logger = new Logger(N8nService.name);
  constructor(
    @InjectRepository(Transacoes)
    private readonly transactionRepository: Repository<Transacoes>,
    private readonly transactionMapper: N8nTransactionMapper,
    @InjectRepository(Usuarios)
    private readonly userRepository: Repository<Usuarios>,
    private readonly userMapper: N8nUserMapper,
    @InjectRepository(Assinaturas)
    private readonly subscriptionRepository: Repository<Assinaturas>,
    private readonly subscriptionMapper: N8nSubscriptionMapper,
    @InjectRepository(Cupons)
    private readonly voucherRepository: Repository<Cupons>,
    private readonly voucherMapper: N8nVoucherMapper,
    @InjectRepository(Produtos)
    private readonly productRepository: Repository<Produtos>,
    private readonly productMapper: N8nProductMapper,
    @InjectRepository(Ofertas)
    private readonly offerRepository: Repository<Ofertas>,
    private readonly offerMapper: N8nOfferMapper,
    @InjectRepository(Emails)
    private readonly emailRepository: Repository<Emails>,
    @InjectRepository(Plano)
    private readonly planRepository: Repository<Plano>,
    private readonly planMapper: N8nPlanMapper,
  ) {}

  private async createUser(dto: N8nUserDto): Promise<Usuarios> {
    const [found] = await this.userRepository.find({
      where: [
        {
          integration_id: dto.id,
        },
        { documento: dto.documento },
      ],
      take: 1,
    });

    if (found) return found;

    const user = this.userMapper.mapTo(dto);
    return this.userRepository.save(user);
  }

  private async createSubscription(
    dto: N8nSubscriptionDto,
    user: Usuarios,
  ): Promise<Assinaturas> {
    const [found] = await this.subscriptionRepository.find({
      where: {
        integration_id: dto.id,
      },
      take: 1,
    });
    if (found) return found;

    const subscription = this.subscriptionMapper.mapTo(dto);
    subscription.usuario = user;
    return this.subscriptionRepository.save(subscription);
  }

  private async createVoucher(dto: N8nVoucherDto): Promise<Cupons> {
    if (!dto) return null;
    const [found] = await this.voucherRepository.find({
      where: {
        integrationId: dto.id,
      },
      take: 1,
    });
    if (found) return found;
    const voucher = this.voucherMapper.mapTo(dto);
    return this.voucherRepository.save(voucher);
  }

  private async createProduct(dto: N8nProductDto): Promise<Produtos> {
    const [found] = await this.productRepository.find({
      where: {
        integration_id: dto.id,
      },
      take: 1,
    });
    if (found) return found;
    const product = this.productMapper.mapTo(dto);
    return this.productRepository.save(product);
  }

  private async createOffer(
    dto: N8nOfferDto,
    product: Produtos,
    plan: Plano,
  ): Promise<Ofertas> {
    if (!dto) return null;
    const [found] = await this.offerRepository.find({
      where: {
        integration_id: dto.id,
      },
      take: 1,
    });
    if (found) return found;
    const offer = this.offerMapper.mapTo(dto);
    offer.produto = product;
    offer.plano = plan;
    return this.offerRepository.save(offer);
  }

  private async createPlan(dto: N8nPlanDto): Promise<Plano> {
    if (dto) return null;
    const [found] = await this.planRepository.find({
      where: {
        integration_id: dto.id,
      },
      take: 1,
    });
    if (found) return found;
    const plan = this.planMapper.mapTo(dto);
    return this.planRepository.save(plan);
  }

  async createTransaction(dto: N8nCreateTransactionDto) {
    const { assinatura, usuario, oferta, cupom, produto, plano } = dto;
    const transaction = this.transactionMapper.mapTo(dto);
    transaction.usuario = await this.createUser(usuario);

    const [found] = await this.emailRepository.find({
      where: {
        email: usuario.email,
      },
      take: 1,
    });

    if (!found)
      await this.emailRepository.save({
        email: usuario.email,
        integration_id: transaction.usuario.integration_id,
        usuario: transaction.usuario,
      });

    transaction.assinatura = await this.createSubscription(
      assinatura,
      transaction.usuario,
    );
    transaction.cupom = await this.createVoucher(cupom);
    transaction.produto = await this.createProduct(produto);
    transaction.oferta = await this.createOffer(
      oferta,
      transaction.produto,
      await this.createPlan(plano),
    );
    return this.transactionRepository.save(transaction);
  }
}
