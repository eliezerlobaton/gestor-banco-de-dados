import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';
import { DataSource, Repository } from 'typeorm';

import { CreateCursosMentoriaDto } from './dto/create-cursos-mentoria.dto';
import { PopulateCursosMentoriasDto } from './dto/populate-cursos-mentorias.dto';
import { UpdateCursosMentoriaDto } from './dto/update-cursos-mentoria.dto';
import { CursosMentorias } from './entities/cursos-mentoria.entity';

@Injectable()
export class CursosMentoriasService {
  private MEMBERKIT_URL = process.env.MEMBERKIT_URL;
  private MEMBERKIT_API_KEY = process.env.MEMBERKIT_API_KEY;

  constructor(
    @InjectRepository(CursosMentorias)
    private readonly cursosMentoriasRepository: Repository<CursosMentorias>,
    private readonly httpService: HttpService,
    private dataSource: DataSource
  ) { }

  async memberkitIntegration() {
    let pages = {
      path: `${this.MEMBERKIT_URL}courses?api_key=${this.MEMBERKIT_API_KEY}`,
      current_page: 1,
      total_pages: 1,
      next_page: ''
    }

    do {
      pages.next_page = `${this.MEMBERKIT_URL}courses?api_key=${this.MEMBERKIT_API_KEY}&page=${pages.current_page + 1}`
      const url = pages.path
      const headers = {
        'Content-Type': 'application/json'
      }
      const response = await lastValueFrom(this.httpService.get(url, { headers }));
      pages.total_pages = response.headers['total-pages']
      const listaCursosMentorias = []
      for (const cursosMentorias of response.data) {
        const [cursosMentoriasExistente] = await this.cursosMentoriasRepository.find({
          where: { integration_id: cursosMentorias.id }
        })
        if (cursosMentoriasExistente) {
          continue
        }
        const cursosMentoriasData: PopulateCursosMentoriasDto = {
          integration_id: cursosMentorias.id,
          nome: cursosMentorias.name,
          categoria: cursosMentorias.category.name,
          data_criacao: cursosMentorias.created_at,
          data_modificacao: cursosMentorias.updated_at,
          matricula: []
        }
        listaCursosMentorias.push(await this.cursosMentoriasRepository.save(cursosMentoriasData))
      }

      pages.current_page++;
      pages.path = pages.next_page;
    } while (pages.current_page <= pages.total_pages)
    return await this.cursosMentoriasRepository.find()
  }

  create(createCursosMentoriaDto: CreateCursosMentoriaDto) {
    return 'This action adds a new cursosMentoria';
  }

  findAll() {
    return `This action returns all cursosMentorias`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cursosMentoria`;
  }

  update(id: number, updateCursosMentoriaDto: UpdateCursosMentoriaDto) {
    return `This action updates a #${id} cursosMentoria`;
  }

  remove(id: number) {
    return `This action removes a #${id} cursosMentoria`;
  }
}
