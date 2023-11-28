import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Ofertas } from './entities/ofertas.entity';
import { Plano } from './entities/plano.entetity';
import { Produtos } from './entities/produtos.entity';
import { ProdutosController } from './produtos.controller';
import { ProdutosService } from './produtos.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Produtos,
      Ofertas,
      Plano
    ]),
    HttpModule
  ],
  controllers: [ProdutosController],
  providers: [ProdutosService],
  exports: [ProdutosService]
})
export class ProdutosModule { }
