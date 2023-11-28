export class CursoUsuarioDto {
  nome: string;
  categoria: string;
  status: 'Ativa' | 'Expirada';
  dataExpiracao: string;
  tempoAcesso: string;
}
