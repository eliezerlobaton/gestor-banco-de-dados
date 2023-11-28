import { Transacoes } from 'src/transacoes/entities/transacoes.entity';
import { AssinaturaUsuarioDto } from './assinatura-usuario.dto';
import { CursoUsuarioDto } from './curso-usuario.dto';

export class UsuarioDto {
  nome: string;

  emails: string[];

  telefone: string;

  documento: string;

  cep: string;

  estado: string;

  cidade: string;

  endereco: string;

  numero: string;

  complemento: string;

  produtos: {
    cursos: CursoUsuarioDto[];
    assinaturas: AssinaturaUsuarioDto[];
  };

  transacoes: Transacoes[];
  dto: any;
}
