import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produtos } from 'src/produtos/entities/produtos.entity';
import { Transacoes } from 'src/transacoes/entities/transacoes.entity';
import { Emails } from 'src/usuarios/entities/emailUsuario.entity';
import { Usuarios } from 'src/usuarios/entities/usuarios.entity';

import { AssinaturasController } from './assinaturas.controller';
import { AssinaturasService } from './assinaturas.service';
import { Assinaturas } from './entities/assinaturas.entity';
import { AssinaturaProdutoMapper } from './mappers/assinatura-produto.mapper';
import { AssinaturaUserMapper } from './mappers/assinaturas-user.mapper';
import { AssinaturaMapper } from './mappers/assinaturas.mappers';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Assinaturas,
      Usuarios,
      Transacoes,
      Emails,
      Produtos
    ]),
    HttpModule
  ],
  controllers: [AssinaturasController],
  providers: [
    AssinaturasService,
    AssinaturaProdutoMapper,
    AssinaturaMapper,
    AssinaturaUserMapper
  ],
  exports: [AssinaturasService]
})
export class AssinaturasModule { }
