import { BaseAbstractMapper } from 'src/common/mappers/base-abstract.mapper';
import { Usuarios } from 'src/usuarios/entities/usuarios.entity';

import { AssinaturaUserDto } from '../dto/assinatura-user.dto';

export class AssinaturaUserMapper extends BaseAbstractMapper<AssinaturaUserDto, Usuarios> {
  mapTo(src: AssinaturaUserDto): Usuarios {
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
  mapFrom(dest: Usuarios): AssinaturaUserDto {
    throw new Error("Method not implemented.");
  }

}