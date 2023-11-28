import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Repository } from 'typeorm';

import { Tracking } from '../transacoes/entities/tracking.entity';
import { CreateTrackingDto } from './dto/create-tracking.dto';
import { UpdateTrackingDto } from './dto/update-tracking.dto';

@Injectable()
export class TrackingsService {
  constructor(
    @InjectRepository(Tracking)
    private readonly trackingRepository: Repository<Tracking>,
  ) { }

  create(createTrackingDto: CreateTrackingDto) {
    return 'This action adds a new tracking';
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 20 } = paginationDto;
    const [trackings, totalItems] = await this.trackingRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit
    });

    if (trackings.length === 0) {
      throw new NotFoundException('trackings não encontrados');
    }

    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = page;

    const hasNextPage = currentPage < totalPages;
    const hasPrevPage = currentPage > 1;

    const nextPage = hasNextPage ? currentPage + 1 : null;
    const prevPage = hasPrevPage ? currentPage - 1 : null;


    const result = {
      data: trackings,
      currentPage,
      totalItems,
      perPage: trackings.length,
      totalPages,
      nextPage: `/trackings?page=${nextPage}&limit=${limit}`,
      prevPage: `/trackings?page=${prevPage}&limit=${limit}`,
    };

    return result;
  }

  findOne(id: number) {
    return `This action returns a #${id} tracking`;
  }

  update(id: number, updateTrackingDto: UpdateTrackingDto) {
    return `This action updates a #${id} tracking`;
  }

  remove(id: number) {
    return `This action removes a #${id} tracking`;
  }
}
