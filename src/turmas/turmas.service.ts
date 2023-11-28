import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';
import { Repository } from 'typeorm';

import { CreateTurmaDto } from './dto/create-turma.dto';
import { PopulateTurmasDto } from './dto/populate-tumas.dto';
import { UpdateTurmaDto } from './dto/update-turma.dto';
import { Turmas } from './entities/turmas.entity';

@Injectable()
export class TurmasService {
  private MEMBERKIT_URL = process.env.MEMBERKIT_URL;
  private MEMBERKIT_API_KEY = process.env.MEMBERKIT_API_KEY;

  constructor(
    @InjectRepository(Turmas)
    private readonly turmasRepository: Repository<Turmas>,
    private readonly httpService: HttpService,
  ) { }

  async memberkitIntegration() {
    let pages = {
      path: `${this.MEMBERKIT_URL}classrooms?api_key=${this.MEMBERKIT_API_KEY}`,
      current_page: 1,
      total_pages: 1,
      next_page: ''
    }

    do {
      pages.next_page = `${this.MEMBERKIT_URL}classrooms?api_key=${this.MEMBERKIT_API_KEY}&page=${pages.current_page + 1}`
      const url = pages.path
      const headers = {
        'Content-Type': 'application/json'
      }
      const response = await lastValueFrom(this.httpService.get(url, { headers }));
      pages.total_pages = response.headers['total-pages']
      const listaTurmas = []
      for (const turmas of response.data) {
        const [turmaExistente] = await this.turmasRepository.find({
          where: { integration_id: turmas.id }
        })
        if (turmaExistente) {
          continue
        }
        const turmasData: PopulateTurmasDto = {
          integration_id: turmas.id,
          usuarios_quantidade: turmas.users_count,
          data_criacao: turmas.created_at,
          data_atualizacao: turmas.updated_at,
          nome_curso: turmas.course_name,
          nome: turmas.name,
          matricula: []
        }
        listaTurmas.push(this.turmasRepository.save(turmasData))
      }

      pages.current_page++;
      pages.path = pages.next_page;
    } while (pages.current_page <= pages.total_pages)
    return await this.turmasRepository.find()
  }
  create(createTurmaDto: CreateTurmaDto) {
    return 'This action adds a new turma';
  }

  findAll() {
    return `This action returns all turmas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} turma`;
  }

  update(id: number, updateTurmaDto: UpdateTurmaDto) {
    return `This action updates a #${id} turma`;
  }

  remove(id: number) {
    return `This action removes a #${id} turma`;
  }
}
