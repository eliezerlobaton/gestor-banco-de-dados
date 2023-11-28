import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { HotmartAuthService } from '../auth/hotmart-auth.service';
import { Observable, delay, lastValueFrom, map, mergeMap, take } from 'rxjs';
import { HotmartTransactionMapper } from '../mappers/hotmart-transanction.mapper';
import { HotmartTransactionDto } from '../dto/hotmart-transanction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tracking } from 'src/transacoes/entities/tracking.entity';
import { Repository } from 'typeorm';
import { HotmartTrackingDto } from '../dto/hotmart-tracking.dto';
import { HotmartTrackingMapper } from '../mappers/hotmart-tracking.mapper';
import { HotmartTransactionDetailsDto } from '../dto/hotmart-transaction-details.dto';
import { HotmartVoucherMapper } from '../mappers/hotmart-voucher.mapper';
import { Cupons } from 'src/transacoes/entities/cupons.entity';
import { Transacoes } from 'src/transacoes/entities/transacoes.entity';
import { Usuarios } from 'src/usuarios/entities/usuarios.entity';
import { HotmartUserDto } from '../dto/hotmart-user.dto';
import { HotmartUserRoleEnum } from '../enums/hotmart-user-role.enum';
import { HotmartUserMapper } from '../mappers/hotmart-user.mapper';
import { Emails } from 'src/usuarios/entities/emailUsuario.entity';
import { Assinaturas } from 'src/assinaturas/entities/assinaturas.entity';
import { HotmartSubscriptionMapper } from '../mappers/hotmart-subscription.mapper';
import { HotmartSubscriptionDto } from '../dto/hotmart-subscriptions.dto';
import { HotmartPaginatedResponseDto } from '../dto/hotmart-paginated-response.dto';
import { HotmartTransactionStatusEnum } from '../enums/hotmart-transaction-status.enum';
import { Produtos } from 'src/produtos/entities/produtos.entity';
import { DataSourceEnum } from 'src/common/enums/data-source.enum';
import { Ofertas } from 'src/produtos/entities/ofertas.entity';
import { Plano } from 'src/produtos/entities/plano.entetity';
import { HotmartCommissionDto } from '../dto/hotmart-commission.dto';
import { HotmartComissionTypeEnum } from '../enums/hotmart-comission-type.enum';
import { setTimeout } from 'timers/promises';
@Injectable()
export class HotmartTransactionService {
  private logger = new Logger(HotmartTransactionService.name);
  private accessToken: string;
  constructor(
    private readonly auth: HotmartAuthService,
    private readonly http: HttpService,
    private readonly mapper: HotmartTransactionMapper,
    @InjectRepository(Transacoes)
    private readonly repository: Repository<Transacoes>,
    @InjectRepository(Tracking)
    private readonly trackingRepository: Repository<Tracking>,
    private readonly trackingMapper: HotmartTrackingMapper,
    private readonly voucherMapper: HotmartVoucherMapper,
    @InjectRepository(Cupons)
    private readonly voucherRepository: Repository<Cupons>,
    @InjectRepository(Usuarios)
    private readonly userRepository: Repository<Usuarios>,
    private readonly userMapper: HotmartUserMapper,
    @InjectRepository(Emails)
    private readonly emailRepository: Repository<Emails>,
    @InjectRepository(Assinaturas)
    private readonly subscriptionRepository: Repository<Assinaturas>,
    private readonly subscriptionMapper: HotmartSubscriptionMapper,
    @InjectRepository(Produtos)
    private readonly productRepository: Repository<Produtos>,
    @InjectRepository(Ofertas)
    private readonly offerRepository: Repository<Ofertas>,
    @InjectRepository(Plano)
    private readonly planRepository: Repository<Plano>,
  ) {}

  private async createTracking(
    trackingDto: HotmartTrackingDto,
  ): Promise<number> {
    if (!trackingDto) return null;
    const tracking = this.trackingMapper.mapTo(trackingDto);
    const [found] = await this.trackingRepository.find({
      where: {
        external_id: tracking.external_id,
        data_source: DataSourceEnum.Hotmart,
      },
      take: 1,
    });
    if (found) return found.id;
    const { id } = await this.trackingRepository.save(tracking);
    return id;
  }

  private async createVoucher(transactionExternalId: string): Promise<number> {
    const transactionDetails: HotmartTransactionDetailsDto =
      await lastValueFrom(
        this.http
          .get(
            `${process.env.HOTMART_SALES_URL}/price/details?transaction=${transactionExternalId}`,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.accessToken}`,
              },
            },
          )
          .pipe(
            map((response) => response.data.items[0]),
            delay(1000),
          ),
      );
    if (!transactionDetails?.coupon) return null;

    const voucher = this.voucherMapper.mapTo(transactionDetails.coupon);

    const [found] = await this.voucherRepository.find({
      where: {
        integrationId: voucher.integrationId,
        data_source: DataSourceEnum.Hotmart,
      },
    });

    if (found) return found.id;

    const { id } = await this.voucherRepository.save(voucher);
    return id;
  }

  private async createTransaction(
    transactionDto: HotmartTransactionDto,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _index?: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _transactionsDtos?: HotmartTransactionDto[],
  ): Promise<Transacoes> {
    const transaction = this.mapper.mapTo(transactionDto);

    const [found] = await this.repository.find({
      where: {
        integration_id: transaction.integration_id,
        data_source: DataSourceEnum.Hotmart,
      },
      relations: {
        assinatura: true,
        cupom: true,
        produto: true,
        tracking: true,
        usuario: true,
      },
    });

    if (found) return found;

    transaction.tracking = <any>(
      await this.createTracking(transactionDto.purchase?.tracking)
    );
    transaction.cupom = <any>(
      await this.createVoucher(transaction.integration_id)
    );

    transaction.usuario = <any>(
      await this.createUser(
        transaction.integration_id,
        transactionDto.buyer.email,
      )
    );

    transaction.assinatura = <any>(
      await this.createUserSubscription(
        transaction.integration_id,
        <any>transaction.usuario,
      )
    );

    transaction.produto = <any>(
      await this.createProduct(transaction.integration_id)
    );

    transaction.oferta = <any>(
      await this.createOffer(transactionDto, <any>transaction.produto)
    );

    const commissions: HotmartCommissionDto[] = await this.fetchCommissions(
      transaction.integration_id,
    );

    transaction.comissao_produtor = commissions
      .filter(
        (commission) => commission.source === HotmartComissionTypeEnum.PRODUCER,
      )
      .map((commission) => commission.commission.value)
      .pop();

    transaction.comissao_afiliado = commissions
      .filter(
        (commission) =>
          commission.source === HotmartComissionTypeEnum.AFFILIATE,
      )
      .map((commission) => commission.commission.value)
      .pop();
    await setTimeout(1000);
    return this.repository.save(transaction);
  }

  private async createUser(
    transactionExternalId: string,
    buyerEmail: string,
  ): Promise<number> {
    const hotmartUser: HotmartUserDto = await lastValueFrom(
      this.http
        .get(
          `${process.env.HOTMART_SALES_URL}/users?transaction=${transactionExternalId}&buyer_email=${buyerEmail}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.accessToken}`,
            },
          },
        )
        .pipe(
          map((response) => {
            return response.data.items[0].users
              .filter(
                (user) =>
                  user.role === HotmartUserRoleEnum.BUYER ||
                  user.role === HotmartUserRoleEnum.AFFILIATE,
              )
              .pop().user;
          }),
          delay(1000),
        ),
    );

    if (!hotmartUser) return null;
    const user = this.userMapper.mapTo(hotmartUser);

    const [found] = await this.userRepository.find({
      where: [
        {
          integration_id: user.integration_id,
          data_source: DataSourceEnum.Hotmart,
        },
        { documento: user.documento },
      ],
      take: 1,
    });

    if (found) return found.id;

    const { id } = await this.userRepository.save(user);

    await this.createUserEmail(id, user.integration_id, hotmartUser.email);
    await this.createUserSubscription(transactionExternalId, id);

    return id;
  }

  private async createUserEmail(
    userId: number,
    userExternalId: string,
    email: string,
  ): Promise<number> {
    const [found] = await this.emailRepository.find({
      where: {
        email: email,
        integration_id: userExternalId,
      },
      take: 1,
    });
    if (found) return found.id;

    const { id } = await this.emailRepository.save({
      email: email,
      integration_id: userExternalId,
      usuario: <any>userId,
      data_source: DataSourceEnum.Hotmart,
    });

    return id;
  }

  private async fetchUserSubscription(
    transactionExternalId: string,
  ): Promise<HotmartSubscriptionDto> {
    const hotmartSubscription: HotmartSubscriptionDto = await lastValueFrom(
      this.http
        .get(
          `https://developers.hotmart.com/payments/api/v1/subscriptions?transaction=${transactionExternalId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.accessToken}`,
            },
          },
        )
        .pipe(
          map((response) => {
            return response.data.items[0];
          }),
          delay(1000),
        ),
    );
    return hotmartSubscription;
  }

  private async createUserSubscription(
    transactionExternalId: string,
    userId: number,
  ): Promise<number> {
    const hotmartSubscription: HotmartSubscriptionDto =
      await this.fetchUserSubscription(transactionExternalId);

    if (!hotmartSubscription) return null;

    const [found] = await this.subscriptionRepository.find({
      where: {
        integration_id: hotmartSubscription.subscription_id.toString(),
      },
      take: 1,
    });
    if (found) return found.id;

    const subscription = {
      usuario: <any>userId,
      ...this.subscriptionMapper.mapTo(hotmartSubscription),
    };
    const { id } = await this.subscriptionRepository.save(subscription);
    return id;
  }

  private async createProduct(transactionExternalId: string): Promise<number> {
    const hotmartSubscription: HotmartSubscriptionDto =
      await this.fetchUserSubscription(transactionExternalId);

    if (!hotmartSubscription) return null;
    const { product } = hotmartSubscription;
    const [found] = await this.productRepository.find({
      where: {
        integration_id: product.ucode,
        data_source: DataSourceEnum.Hotmart,
      },
      take: 1,
    });
    if (found) return found.id;
    const { id } = await this.productRepository.save({
      integration_id: product.ucode,
      nome: product.name,
      data_source: DataSourceEnum.Hotmart,
    });
    return id;
  }

  private async createOffer(
    transactionDto: HotmartTransactionDto,
    productId?: number,
  ): Promise<number> {
    const { offer } = transactionDto.purchase;
    const [found] = await this.offerRepository.find({
      where: {
        integration_id: offer.code,
      },
    });
    if (found) return found.id;
    const { id } = await this.offerRepository.save({
      integration_id: offer.code,
      produto:
        <any>productId ||
        <any>await this.createProduct(transactionDto.purchase.transaction),
      plano: <any>await this.createPlan(transactionDto.purchase.transaction),
      nome: offer.payment_mode,
      moeda_compra: transactionDto.purchase.price.currency_code,
      valor: transactionDto.purchase.price.value,
      data_source: DataSourceEnum.Hotmart,
    });
    return id;
  }

  private async createPlan(transactionExternalId: string): Promise<number> {
    const subscription: HotmartSubscriptionDto =
      await this.fetchUserSubscription(transactionExternalId);

    if (!subscription || subscription.plan.id === 0) return null;

    const { plan } = subscription;

    const [found] = await this.planRepository.find({
      where: {
        integration_id: plan.id.toString(),
        data_source: DataSourceEnum.Hotmart,
      },
    });

    if (found) return found.id;

    const { id } = await this.planRepository.save({
      integration_id: plan.id.toString(),
      nome: plan.name,
      ciclos: plan.max_charge_cycles,
      intervalo: plan.recurrency_period,
      teste: subscription.trial,
      data_source: DataSourceEnum.Hotmart,
    });

    return id;
  }

  private async fetchCommissions(
    transactionExternalId: string,
  ): Promise<HotmartCommissionDto[]> {
    return await lastValueFrom(
      this.http
        .get<
          HotmartPaginatedResponseDto<{ commissions: HotmartCommissionDto[] }>
        >(
          `${process.env.HOTMART_SALES_URL}/commissions?transaction=${transactionExternalId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.accessToken}`,
            },
          },
        )
        .pipe(map((response) => response.data.items[0].commissions)),
    );
  }

  private fetchData(
    token: string,
    status: HotmartTransactionStatusEnum,
    pageToken?: string,
  ): Observable<HotmartPaginatedResponseDto<HotmartTransactionDto>> {
    return this.http
      .get<HotmartPaginatedResponseDto<HotmartTransactionDto>>(
        `${process.env.HOTMART_SALES_URL}/history`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          params: {
            page_token: pageToken,
            transaction_status: status,
          },
        },
      )
      .pipe(
        map((response) => {
          return response.data;
        }),
        delay(1000),
      );
  }

  async integrate(authUrl: string, apiKey: string) {
    const transactionsDtos: HotmartTransactionDto[][] = [];
    let nextPageToken: string;
    let currentTransaction = {};
    try {
      for (const status of Object.keys(HotmartTransactionStatusEnum)) {
        const authentication = await this.auth.authenticate({
          url: authUrl,
          api_key: apiKey,
        });
        this.accessToken = authentication.access_token;
        do {
          const response = await lastValueFrom(
            this.fetchData(
              authentication.access_token,
              HotmartTransactionStatusEnum[status],
              nextPageToken,
            ),
          );
          nextPageToken = response.page_info.next_page_token;
          transactionsDtos.push(response.items);
          console.log(response.page_info);
          console.log(`${status} ==== `, nextPageToken);
        } while (nextPageToken);
      }
      const transactions = [];
      for (const hotmartTransaction of transactionsDtos.flat()) {
        currentTransaction = hotmartTransaction;
        transactions.push(await this.createTransaction(hotmartTransaction));
      }
      return transactions;
    } catch (error) {
      this.logger.error(error);
      console.log(error);
      console.log(currentTransaction);
      return error;
    }
  }
}
