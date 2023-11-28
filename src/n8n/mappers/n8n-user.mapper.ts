import { BaseAbstractMapper } from 'src/common/mappers/base-abstract.mapper';
import { N8nUserDto } from '../dto/n8n-user.dto';
import { Usuarios } from 'src/usuarios/entities/usuarios.entity';

export class N8nUserMapper extends BaseAbstractMapper<N8nUserDto, Usuarios> {
  mapTo(src: N8nUserDto): Usuarios {
    const mapped = new Usuarios();

    mapped.integration_id = src.id;
    mapped.data_criacao = src.dataCriacao
      ? new Date(src.dataCriacao)
      : new Date();
    mapped.nome = src.nome;
    mapped.telefone = src.telefone;
    mapped.documento = src.documento;
    mapped.cep = src.cep;
    mapped.endereco = src.endereco;
    mapped.numero = src.numero;
    mapped.complemento = src.complemento;

    return mapped;
  }

  mapFrom(dest: Usuarios): N8nUserDto {
    throw new Error('Method not implemented.');
  }
}
