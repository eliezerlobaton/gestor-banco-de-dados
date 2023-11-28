import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AlunosModule } from './alunos/alunos.module';
import { AppController } from './app.controller';
import { AssinaturasModule } from './assinaturas/assinaturas.module';
import { CommonModule } from './common/common.module';
import { CursosMentoriasModule } from './cursos-mentorias/cursos-mentorias.module';
import { HotmartModule } from './hotmart/hotmart.module';
import { ProdutosModule } from './produtos/produtos.module';
import { TrackingsModule } from './trackings/trackings.module';
import { TransacoesModule } from './transacoes/transacoes.module';
import { TurmasModule } from './turmas/turmas.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { N8nModule } from './n8n/n8n.module';
import { Alunos } from './alunos/entities/aluno.entity';
import { Assinaturas } from './assinaturas/entities/assinaturas.entity';
import { Transacoes } from './transacoes/entities/transacoes.entity';
import { Emails } from './usuarios/entities/emailUsuario.entity';
import { Usuarios } from './usuarios/entities/usuarios.entity';
import { Produtos } from './produtos/entities/produtos.entity';
import { PagarmeModule } from './pagarme/pagarme.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + './**/*.entity{.ts,.js}'],
      migrations: [__dirname + './database/migrations/{*.ts,*.js}'],
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([
      Usuarios,
      Transacoes,
      Assinaturas,
      Emails,
      Alunos,
      Produtos,
    ]),
    UsuariosModule,
    AssinaturasModule,
    TransacoesModule,
    TrackingsModule,
    HttpModule,
    ProdutosModule,
    HotmartModule,
    N8nModule,
    CommonModule,
    CursosMentoriasModule,
    AlunosModule,
    TurmasModule,
    PagarmeModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
