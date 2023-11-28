import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alunos } from 'src/alunos/entities/aluno.entity';
import { Assinaturas } from 'src/assinaturas/entities/assinaturas.entity';
import { Transacoes } from 'src/transacoes/entities/transacoes.entity';

import { Emails } from './entities/emailUsuario.entity';
import { Usuarios } from './entities/usuarios.entity';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { Produtos } from 'src/produtos/entities/produtos.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Usuarios,
      Transacoes,
      Assinaturas,
      Emails,
      Alunos,
      Produtos,
    ]),
    HttpModule,
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService],
})
export class UsuariosModule {}
