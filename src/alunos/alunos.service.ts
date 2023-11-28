import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { delay, lastValueFrom } from 'rxjs';
import { CursosMentorias } from 'src/cursos-mentorias/entities/cursos-mentoria.entity';
import { Turmas } from 'src/turmas/entities/turmas.entity';
import { Emails } from 'src/usuarios/entities/emailUsuario.entity';
import { DataSource, Repository } from 'typeorm';

import { PaginationDto } from '../common/dto/pagination.dto';
import { AlunoCursoDto } from './dto/aluno-curso.dto';
import { AlunoMatriculaDto } from './dto/aluno-matricula.dto';
import { AlunoTurmasDto } from './dto/aluno-turma.dto';
import { CreateAlunoDto } from './dto/create-aluno.dto';
import { PopulateAlunosDto } from './dto/populate-alunos.dto';
import { PopulateMatriculasDto } from './dto/porpulate-matriculas.dto';
import { UpdateAlunoDto } from './dto/update-aluno.dto';
import { Alunos } from './entities/aluno.entity';
import { Matricula } from './entities/matricula.entity';
import { AlunoCursoMapper } from './mappers/aluno-curso.mapper';
import { AlunoMatriculaMapper } from './mappers/aluno-matricula.mapper';
import { AlunoMapper } from './mappers/aluno.mapper';
import { AlunoTurmaMapper } from './mappers/aluno.turma.mapper';

@Injectable()
export class AlunosService {
  private MEMBERKIT_URL = process.env.MEMBERKIT_URL;
  private MEMBERKIT_API_KEY = process.env.MEMBERKIT_API_KEY;

  constructor(
    @InjectRepository(Alunos)
    private readonly alunosRepository: Repository<Alunos>,
    private readonly alunosMpper: AlunoMapper,
    @InjectRepository(Matricula)
    private readonly matriculasRepository: Repository<Matricula>,
    private readonly matriculaMapper: AlunoMatriculaMapper,
    @InjectRepository(CursosMentorias)
    private readonly cursosMentoriasRepository: Repository<CursosMentorias>,
    private readonly cursoMapper: AlunoCursoMapper,
    @InjectRepository(Turmas)
    private readonly turmasRepository: Repository<Turmas>,
    private readonly turmaMapper: AlunoTurmaMapper,
    @InjectRepository(Emails)
    private readonly emailUsuarioRepository: Repository<Emails>,
    private readonly httpService: HttpService,
    private dataSource: DataSource
  ) { }

  async memberkitIntegration() {
    const pages = {
      path: `${this.MEMBERKIT_URL}users?api_key=${this.MEMBERKIT_API_KEY}`,
      current_page: 1,
      total_pages: 1,
      next_page: ''
    };

    do {
      pages.next_page = `${this.MEMBERKIT_URL}users?api_key=${this.MEMBERKIT_API_KEY}&page=${pages.current_page + 1}`;
      const url = pages.path;
      const headers = {
        'Content-Type': 'application/json'
      };

      const response = await lastValueFrom(this.httpService.get(url, { headers }).pipe(delay(500)));
      pages.total_pages = response.headers['total-pages'];

      const listaAlunos = [];
      for (const aluno of response.data) {
        const [alunoExistente] = await this.alunosRepository.find({
          where: { integration_id: aluno.id }
        })

        if (!alunoExistente) {
          const alunoMapeado: PopulateAlunosDto = {
            integration_id: aluno.id,
            nome: aluno.full_name,
            email: aluno.email,
            matricula: []
          }

          const alunoSalvo = await this.alunosRepository.save(<any>alunoMapeado)
          listaAlunos.push(alunoSalvo)

          const emailUsuario = await this.emailUsuarioRepository.findOne({
            where: { email: aluno.email },
            relations: ['aluno']
          })

          alunoSalvo.emailUsuario = emailUsuario

          const responseMatricula = await lastValueFrom(this.httpService.get(`${this.MEMBERKIT_URL}users/${aluno.id}?api_key=${this.MEMBERKIT_API_KEY}`, { headers }).pipe(delay(1000)));
          const listaMatriculas = []
          for (const matricula of responseMatricula.data.enrollments) {
            const [matriculaExiste] = await this.matriculasRepository.find({
              where: { integration_id: matricula.id }
            })
            const cursos = await this.cursosMentoriasRepository.find({
              where: { integration_id: matricula.course_id }
            })
            const turmas = await this.turmasRepository.find({
              where: { integration_id: matricula.classroom_id }
            })

            let curso = cursos[0]
            let turma = turmas[0]

            if (!curso) {
              const cursoResponse = await lastValueFrom(this.httpService.get(`${this.MEMBERKIT_URL}courses/${matricula.course_id}?api_key=${this.MEMBERKIT_API_KEY}`, { headers }).pipe(delay(500)));
              curso = await this.cursosMentoriasRepository.save({
                integration_id: cursoResponse.data.id,
                nome: cursoResponse.data.name,
                categoria: cursoResponse.data.category?.name,
                data_criacao: cursoResponse.data.created_at,
                data_modificacao: cursoResponse.data.updated_at,
                matricula: []
              })
            }

            if (!turma) {
              const turmaResponse = await lastValueFrom(this.httpService.get(`${this.MEMBERKIT_URL}classrooms/${matricula.classroom_id}?api_key=${this.MEMBERKIT_API_KEY}`, { headers }).pipe(delay(500)));
              turma = await this.turmasRepository.save({
                integration_id: turmaResponse.data.id,
                usuarios_quantidade: turmaResponse.data.users_count,
                data_criacao: turmaResponse.data.created_at,
                data_atualizacao: turmaResponse.data.updated_at,
                nome_curso: turmaResponse.data.course_name,
                nome: turmaResponse.data.name,
                matricula: []
              })
            }

            if (!matriculaExiste) {
              const matriculaData: PopulateMatriculasDto = {
                integration_id: matricula.id,
                data_expiracao: matricula.expire_date,
                aluno: alunoSalvo.id,
                cursoMentoria: <any>curso.id,
                turma: <any>turma.id
              }
              listaMatriculas.push(await this.matriculasRepository.save(matriculaData))
              console.log(listaMatriculas)
            }
          }
        }
      }

      pages.current_page++;
      pages.path = pages.next_page;
      console.log('current page :::: ', pages.current_page);
    } while (pages.current_page <= pages.total_pages);

    return await this.alunosRepository.find();
  }

  private async createAluno(dto: CreateAlunoDto) {
    const [found] = await this.alunosRepository.find({
      where: {
        integration_id: dto.id
      },
      take: 1
    })

    if (found) return found;

    const aluno = this.alunosMpper.mapTo(dto);
    return this.alunosRepository.save(aluno);
  }

  private async createCurso(dto: AlunoCursoDto): Promise<CursosMentorias> {
    const [found] = await this.cursosMentoriasRepository.find({
      where: {
        integration_id: dto.id
      },
      take: 1
    })

    if (found) return found;

    const curso = this.cursoMapper.mapTo(dto);
    return this.cursosMentoriasRepository.save(curso)
  }

  private async createTurma(
    dto: AlunoTurmasDto
  ): Promise<Turmas> {
    const [found] = await this.turmasRepository.find({
      where: {
        integration_id: dto.id
      },
      take: 1
    })

    if (found) return found;

    const turma = this.turmaMapper.mapTo(dto);
    return this.turmasRepository.save(turma)
  }

  async create(dto: AlunoMatriculaDto): Promise<Matricula> {
    const { curso, turma, aluno } = dto;
    const matricula = this.matriculaMapper.mapTo(dto);
    matricula.aluno = await this.createAluno(aluno);

    const [found] = await this.emailUsuarioRepository.find({
      where: {
        email: aluno.email
      },
      take: 1
    });

    if (!found)
      await this.emailUsuarioRepository.save({
        email: aluno.email,
        integration_id: matricula.aluno.integration_id,
        aluno: matricula.aluno
      });

    matricula.cursoMentoria = await this.createCurso(curso);
    matricula.turma = await this.createTurma(turma);
    return this.matriculasRepository.save(matricula);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 20 } = paginationDto;
    const skip = (page - 1) * limit;
    const queryBuilder = this.dataSource
      .getRepository(Alunos)
      .createQueryBuilder('alunos')
      .leftJoinAndSelect('alunos.matricula', 'matricula')
    const [alunos, totalItems] = await queryBuilder
      .take(limit)
      .skip(skip)
      .getManyAndCount()
    if (alunos.length === 0) {
      throw new NotFoundException('alunos não encontrados');
    }
    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = page;

    const hasNextPage = currentPage < totalPages;
    const hasPrevPage = currentPage > 1;

    const nextPage = hasNextPage ? currentPage + 1 : null;
    const prevPage = hasPrevPage ? currentPage - 1 : null;

    const result = {
      data: alunos,
      currentPage,
      totalItems,
      perPage: alunos.length,
      totalPages,
      nextPageUrl: `/alunos?page=${nextPage}&limit=${limit}`,
      prevPageUrl: `/alunos?page=${prevPage}&limit=${limit}`,
    };

    return result
  }

  async findOne(id: number): Promise<Alunos> {
    const aluno = await this.alunosRepository.findOne({
      where: { id },
      relations: ['matricula']
    });

    if (!aluno) {
      throw new NotFoundException(`Aluno with ID ${id} not found`);
    }

    return aluno;
  }


  async update(id: number, dto: UpdateAlunoDto) {
    const matricula = await this.dataSource
      .getRepository(Matricula)
      .createQueryBuilder('matricula')
      .leftJoinAndSelect('matricula.aluno', 'aluno')
      .where('aluno.id = :id and matricula.id = :matriculaId', { id, matriculaId: dto.id })
      .getOne();
    console.log(matricula);

    if (!matricula) {
      throw new NotFoundException('Matricula não encontrada');
    }


    matricula.data_expiracao = dto.dataExpiracao

    return await this.matriculasRepository.save(matricula);
  }

  remove(id: number) {
    return `This action removes a #${id} aluno`;
  }
}
