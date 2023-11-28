import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';
import { Repository } from 'typeorm';

import { PaginationDto } from '../common/dto/pagination.dto';
import { PopulateOfertasDto } from './dto/populate-ofertas.dto';
import { PopulatePlanoDto } from './dto/populate-plano.dto';
import { PopulateProdutosDto } from './dto/populate-produtos.dto';
import { Ofertas } from './entities/ofertas.entity';
import { Plano } from './entities/plano.entetity';
import { Produtos } from './entities/produtos.entity';


@Injectable()
export class ProdutosService {
  private GURU_URL = process.env.GURU_URL;
  private GURU_API_KEY = process.env.GURU_API_KEY;
  constructor(
    @InjectRepository(Produtos)
    private readonly produtosRepository: Repository<Produtos>,
    @InjectRepository(Ofertas)
    private readonly ofertaRepository: Repository<Ofertas>,
    @InjectRepository(Plano)
    private readonly planoRepository: Repository<Plano>,
    private readonly httpService: HttpService
  ) { }

  async integrationGuru() {
    const pages = {
      path: `${this.GURU_URL}products/`,
      current_page: 1,
      first_page_url: `${this.GURU_URL}products/?page=1`,
      next_page_url: `${this.GURU_URL}products/?page=2`,
    };

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

      for (const produtos of response.data.data) {
        const created_at = new Date(produtos.created_at * 1000);
        const updated_at = new Date(produtos.updated_at * 1000);
        const [produtoExistente] = await this.produtosRepository.find({
          where: { integration_id: produtos.id }
        })

        if (produtoExistente) {
          continue
        }

        if (produtos.is_hidden === 0) {
          const ofertas = await lastValueFrom(
            this.httpService.get(`${this.GURU_URL}products/${produtos.id}/offers`, { headers }),
          );

          const produto: PopulateProdutosDto = {
            integration_id: produtos.id,
            nome: produtos.name,
            data_criacao: created_at,
            data_modificacao: updated_at,
            tipo: produtos.type,
            oferta: []
          };

          for (const oferta of ofertas.data.data) {
            const [ofertaExistente] = await this.ofertaRepository.find({
              where: { integration_id: oferta.id },
            });

            if (oferta.plan) {
              const plano: PopulatePlanoDto = {
                ciclos: oferta.plan.cycles,
                desconto_valor: oferta.plan.discount.value,
                desconto_ciclos: oferta.plan.discount.cycles,
                incremento_valor: oferta.plan.increment.value,
                incremento_ciclo: oferta.plan.increment.cycles,
                intervalo: oferta.plan.interval,
                tipo_intervalo: oferta.plan.interval_type,
                dias_teste: oferta.plan.trial_days,
                oferta: []
              };
              const planoExist = await this.planoRepository.find({
                where: plano
              })
              oferta.plano = (planoExist.length) ? planoExist[0] : await this.planoRepository.save(plano)
            }

            if (!ofertaExistente) {
              const ofertaData: PopulateOfertasDto = {
                integration_id: oferta.id,
                nome: oferta.name,
                valor: oferta.value,
                moeda_compra: oferta.currency,
                data_criacao: new Date(oferta.created_at * 1000),
                data_modificacao: new Date(oferta.updated_at * 1000),
                plano: oferta?.plano,
                produto: null
              };
              produto.oferta.push(await this.ofertaRepository.save(ofertaData))
            } else {
              produto.oferta.push(ofertaExistente)
            }

          }

          await this.produtosRepository.save(produto)
        }
      }
      pages.current_page++;
      pages.path = response.data.next_page_url;
      pages.next_page_url = response.data.next_page_url;
      console.log('current page :::: ', response.data.current_page);
      console.log('next page :::: ', response.data.next_page_url);
    }
    return await this.produtosRepository.find({
      relations: ['oferta']
    })
  }
  create() {
    return 'This action adds a new produto';
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 20 } = paginationDto;
    const skip = (page - 1) * limit;
    const [produtos, totalItems] = await this.produtosRepository.findAndCount({
      take: limit,
      skip
    });

    if (produtos.length === 0) {
      throw new NotFoundException('produtos não encontrados');
    }

    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = page;

    const hasNextPage = currentPage < totalPages;
    const hasPrevPage = currentPage > 1;

    const nextPage = hasNextPage ? currentPage + 1 : null;
    const prevPage = hasPrevPage ? currentPage - 1 : null;


    const result = {
      data: produtos,
      currentPage,
      totalItems,
      perPage: produtos.length,
      totalPages,
      nextPage: `/produtos?page=${nextPage}&limit=${limit}`,
      prevPage: `/produtos?page=${prevPage}&limit=${limit}`,
    };

    return result;
  }

  findOne(id: number) {
    return `This action returns a #${id} produto`;
  }

  update(id: number) {
    return `This action updates a #${id} produto`;
  }

  remove(id: number) {
    return `This action removes a #${id} produto`;
  }
}
