import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';
import { AssinaturasService } from 'src/assinaturas/assinaturas.service';
import { Assinaturas } from 'src/assinaturas/entities/assinaturas.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { DataSourceEnum } from 'src/common/enums/data-source.enum';
import { PopulateOfertasDto } from 'src/produtos/dto/populate-ofertas.dto';
import { PopulateProdutosDto } from 'src/produtos/dto/populate-produtos.dto';
import { Ofertas } from 'src/produtos/entities/ofertas.entity';
import { Produtos } from 'src/produtos/entities/produtos.entity';
import { Tracking } from 'src/transacoes/entities/tracking.entity';
import { Emails } from 'src/usuarios/entities/emailUsuario.entity';
import { Usuarios } from 'src/usuarios/entities/usuarios.entity';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { Repository } from 'typeorm';

import { ProdutosService } from '../produtos/produtos.service';
import { CreateTransacoesDto } from './dto/create-transacoes.dto';
import { PopulateTransacoesDto } from './dto/populate-transacoes.dto';
import { UpdateTransacoesDto } from './dto/update-transacoes.dto';
import { Cupons } from './entities/cupons.entity';
import { Transacoes } from './entities/transacoes.entity';


@Injectable()
export class TransacoesService {
  private GURU_URL = process.env.GURU_URL;
  private GURU_API_KEY = process.env.GURU_API_KEY;
  constructor(
    @InjectRepository(Transacoes)
    private readonly transacoesRepository: Repository<Transacoes>,
    @InjectRepository(Usuarios)
    private readonly usuariosRepository: Repository<Usuarios>,
    @InjectRepository(Assinaturas)
    private readonly assinaturasRepository: Repository<Assinaturas>,
    @InjectRepository(Tracking)
    private readonly trackingRepository: Repository<Tracking>,
    @InjectRepository(Cupons)
    private readonly cuponRepository: Repository<Cupons>,
    @InjectRepository(Produtos)
    private readonly produtosRepository: Repository<Produtos>,
    @InjectRepository(Ofertas)
    private readonly ofertasRepository: Repository<Ofertas>,
    private readonly produtosService: ProdutosService,
    private readonly usuariosService: UsuariosService,
    private readonly assinaturasService: AssinaturasService,
    private readonly httpService: HttpService
  ) { }

  async integrationGuru() {
    const pages = {
      path: `${this.GURU_URL}transactions/`,
      current_page: 1,
      first_page_url: `${this.GURU_URL}transactions/?page=1`,
      next_page_url: `${this.GURU_URL}transactions/?page=2`,
    };

    await this.produtosService.integrationGuru()
    await this.usuariosService.getContacts()
    // await this.assinaturasService.getAssinaturas()

    while (pages.next_page_url) {
      const url = pages.path;

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.GURU_API_KEY}`,
        Accept: 'application/json',
      };

      const response = await lastValueFrom(
        this.httpService.get(url, { headers }),
      );

      const listaTransacoes = [];
      for (const transacoes of response.data.data) {

        const created_at = new Date(transacoes.dates.created_at * 1000);
        const canceled_at = transacoes.dates.canceled_at
          ? new Date(transacoes.dates.canceled_at * 1000)
          : null;
        const confirmed_at = transacoes.dates.confirmed_at
          ? new Date(transacoes.dates.confirmed_at * 1000)
          : null;
        const updated_at = new Date(transacoes.dates.updated_at * 1000);

        const usuarios = await this.usuariosRepository.find({
          where: [
            {
              documento: transacoes.contact.doc,
            },
            {
              integration_id: transacoes.contact.id
            }
          ]
        })
        let usuario = usuarios[0]

        if (!usuario) {
          const response = await lastValueFrom(
            this.httpService.get(
              `${this.GURU_URL}contacts/${transacoes.contact.id}`,
              { headers },
            ),
          );

          usuario = await this.usuariosRepository.save({
            nome: response.data.name,
            telefone: response.data.phone_full_number,
            documento: response.data.doc,
            cep: response.data.address_zip_code,
            endereco: response.data.address,
            estado: response.data.address_state,
            cidade: response.data.address_city,
            numero: response.data.address_number,
            complemento: response.data.address_comp,
            data_criacao: new Date(response.data.created_at * 1000),
            transacao: [],
            assinatura: [],
            email: [{
              email: response.data.email,
              integration_id: response.data.id
            } as Emails],
            integration_id: response.data.id,
            id: 0,
            data_modificacao: new Date(response.data.updated_at * 1000),
            data_source: DataSourceEnum.Guru,
          })
        }

        const assinaturas = !Array.isArray(transacoes.subscription)
          ? await this.assinaturasRepository.find({
            where: {
              integration_id: transacoes.subscription.internal_id,
            },
          })
          : [];

        let assinatura = assinaturas[0];

        if (!assinatura && !Array.isArray(transacoes.subscription)) {
          const response = await lastValueFrom(
            this.httpService.get(
              `${this.GURU_URL}subscriptions/${transacoes.subscription.internal_id}`,
              { headers },
            ),
          );

          assinatura = await this.assinaturasRepository.save({
            status: response.data.last_status,
            nome: response.data.product.name,
            data_criacao: new Date(response.data.created_at * 1000),
            data_inicio: response.data.started_at
              ? new Date(response.data.started_at * 1000)
              : null,
            data_cancelamento: response.data.cancelled_at
              ? new Date(response.data.cancelled_at * 1000)
              : null,
            data_modificacao: new Date(response.data.updated_at * 1000),
            data_renovacao: response.data.next_cycle_at,
            trial_inicio: response.data.trial_started_at,
            trial_fim: response.data.trial_finished_at,
            ciclo_quantidade: response.data.charged_times,
            ciclo_periodo: response.data.charged_every_days,
            transacao: [],
            integration_id: response.data.id,
            usuario: <any>usuario.id,
          });
        }

        const produtos = await this.produtosRepository.find({
          where: { integration_id: transacoes.product.internal_id }
        })

        const ofertas = await this.ofertasRepository.find({
          where: { integration_id: transacoes.product.offer.id }
        })

        let produto = produtos[0]

        let oferta = ofertas[0]

        if (!produto) {
          const response = await lastValueFrom(
            this.httpService.get(
              `${this.GURU_URL}products/`,
              { headers },
            ),
          );

          produto = response.data.data.filter(item => item.internal_id == transacoes.product.internal_id).map(
            produto => {
              const produtoData: PopulateProdutosDto = {
                integration_id: produto.id,
                nome: produto.name,
                data_criacao: new Date(produto.created_at * 1000),
                data_modificacao: new Date(produto.updated_at * 1000),
                tipo: produto.type,
                oferta: []
              }
              return produtoData
            }
          )
          await this.produtosRepository.save(<any>produto)
        }
        if (!oferta) {
          const response = await lastValueFrom(
            this.httpService.get(
              `${this.GURU_URL}products/${transacoes.product.internal_id}/offers`,
              { headers },
            ),
          );
          oferta = response.data.data.map(
            oferta => {
              const ofertaData: PopulateOfertasDto = {
                integration_id: oferta.id,
                nome: oferta.name,
                valor: oferta.value,
                moeda_compra: oferta.currency,
                data_criacao: new Date(oferta.created_at * 1000),
                data_modificacao: new Date(oferta.updated_at * 1000),
                produto: <any>produto.id,
                plano: null
              }
              return ofertaData
            }
          )
          await this.ofertasRepository.save(<any>oferta)
        }

        const transacao: PopulateTransacoesDto = {
          integration_id: transacoes.id,
          data_criacao: created_at,
          data_cancelamento: canceled_at,
          data_confirmacao: confirmed_at,
          valor: transacoes.payment.total,
          moeda_compra: transacoes.payment.currency,
          quantidade: transacoes.product.qty,
          metodo_pagamento: transacoes.payment.method,
          parcelas: transacoes.payment.installments.qty,
          juros: transacoes.payment.installments.interest,
          status: transacoes.status,
          comissao_produtor: transacoes.payment.net,
          comissao_plataforma: transacoes.payment.marketplace_value,
          comissao_afiliado: transacoes.payment.affiliate_value,
          cupom: null,
          assinatura: <any>assinatura?.id,
          tracking: null,
          data_modificacao: updated_at,
          usuario: <any>usuario.id,
          produto: <any>produto.id,
          oferta: <any>oferta.id,
          data_source: DataSourceEnum.Guru,
        };
        if (transacoes.trackings.utm_source) {
          const tracking = {
            source: transacoes.trackings.source,
            checkout_source: transacoes.trackings.checkout_source,
            utm_source: transacoes.trackings.utm_source,
            utm_campaign: transacoes.trackings.utm_campaign,
            utm_content: transacoes.trackings.utm_content,
            utm_medium: transacoes.trackings.utm_medium,
            utm_term: transacoes.trackings.utm_term,
          };
          const existingTracking = await this.trackingRepository.find({
            where: tracking,
          });
          transacao.tracking = existingTracking.length
            ? existingTracking[0]
            : await this.trackingRepository.save(tracking);
        }

        if (transacoes.payment.coupon) {
          const cupom = {
            integrationId: transacoes.payment.coupon.id,
            nome: transacoes.payment.coupon.coupon_code,
            tipo: transacoes.payment.coupon.incidence_type,
            valor: transacoes.payment.coupon.incidence_value,
          };

          const cupomExist = await this.cuponRepository.find({
            where: cupom
          })
          transacao.cupom = (cupomExist.length) ? cupomExist[0] : await this.cuponRepository.save(cupom)
        }


        listaTransacoes.push(transacao)
      };

      if (listaTransacoes.length > 0) {
        const existingTransacoes = await this.transacoesRepository.find();
        const existingTransacoesIds = existingTransacoes.map(
          (transacoes) => transacoes.integration_id,
        );

        const transacoes = listaTransacoes.filter(
          (transacoes: any) =>
            !existingTransacoesIds.includes(transacoes.integration_id),
        );

        if (transacoes.length > 0) {
          for (const transacao of transacoes) {
            await this.transacoesRepository.save(transacao);
          }
        }

        pages.current_page++;
        pages.path = response.data.next_page_url;
        pages.next_page_url = response.data.next_page_url;
        console.log('current page :::: ', response.data.current_page);
        console.log('next page :::: ', response.data.next_page_url);
      } else {
        break;
      }
    }
    return await this.transacoesRepository.find();
  }

  create(createTransacoeDto: CreateTransacoesDto) {
    return 'This action adds a new transacoe';
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 20 } = paginationDto;
    const skip = (page - 1) * limit;
    const [transacoes, totalItems] = await this.transacoesRepository.findAndCount({
      take: limit,
      skip
    });

    if (transacoes.length === 0) {
      throw new NotFoundException('transacoes não encontrados');
    }

    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = page;

    const hasNextPage = currentPage < totalPages;
    const hasPrevPage = currentPage > 1;

    const nextPage = hasNextPage ? currentPage + 1 : null;
    const prevPage = hasPrevPage ? currentPage - 1 : null;

    const result = {
      data: transacoes,
      currentPage,
      totalItems,
      perPage: transacoes.length,
      totalPages,
      nextPage: `/transacoes?page=${nextPage}&limit=${limit}`,
      prevPage: `/transacoes?page=${prevPage}&limit=${limit}`,
    };

    return result;
  }

  findOne(id: number) {
    return `This action returns a #${id} transacoe`;
  }

  update(id: number, updateTransacoeDto: UpdateTransacoesDto) {
    return `This action updates a #${id} transacoe`;
  }

  remove(id: number) {
    return `This action removes a #${id} transacoe`;
  }
}
