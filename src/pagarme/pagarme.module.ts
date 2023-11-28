import { Module } from '@nestjs/common';
import { PagarmeService } from './pagarme.service';
import { PagarmeController } from './pagarme.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produtos } from 'src/produtos/entities/produtos.entity';
import { Transacoes } from 'src/transacoes/entities/transacoes.entity';
import { Usuarios } from 'src/usuarios/entities/usuarios.entity';
import { HttpModule } from '@nestjs/axios';
import { Assinaturas } from 'src/assinaturas/entities/assinaturas.entity';
import { Ofertas } from 'src/produtos/entities/ofertas.entity';
import { Plano } from 'src/produtos/entities/plano.entetity';
import { ProdutosModule } from 'src/produtos/produtos.module';
import { Cupons } from 'src/transacoes/entities/cupons.entity';
import { Tracking } from 'src/transacoes/entities/tracking.entity';
import { Emails } from 'src/usuarios/entities/emailUsuario.entity';
import { UsuariosModule } from 'src/usuarios/usuarios.module';

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
    UsuariosModule
  ],
  controllers: [PagarmeController],
  providers: [PagarmeService]
})
export class PagarmeModule { }
