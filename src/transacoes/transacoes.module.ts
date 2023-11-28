import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assinaturas } from 'src/assinaturas/entities/assinaturas.entity';
import { Ofertas } from 'src/produtos/entities/ofertas.entity';
import { Plano } from 'src/produtos/entities/plano.entetity';
import { ProdutosModule } from 'src/produtos/produtos.module';
import { Tracking } from 'src/transacoes/entities/tracking.entity';
import { Emails } from 'src/usuarios/entities/emailUsuario.entity';
import { Usuarios } from 'src/usuarios/entities/usuarios.entity';
import { UsuariosModule } from 'src/usuarios/usuarios.module';

import { Produtos } from '../produtos/entities/produtos.entity';
import { Cupons } from './entities/cupons.entity';
import { Transacoes } from './entities/transacoes.entity';
import { TransacoesController } from './transacoes.controller';
import { TransacoesService } from './transacoes.service';
import { AssinaturasModule } from 'src/assinaturas/assinaturas.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Transacoes,
      Usuarios,
      Assinaturas,
      Tracking,
      Cupons,
      Emails,
      Plano,
      Produtos,
      Ofertas
    ]),
    HttpModule,
    ProdutosModule,
    UsuariosModule,
    AssinaturasModule,
  ],
  controllers: [TransacoesController],
  providers: [
    TransacoesService,
  ]
})
export class TransacoesModule { }
