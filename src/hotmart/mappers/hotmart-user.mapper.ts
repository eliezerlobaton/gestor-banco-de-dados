import { BaseAbstractMapper } from 'src/common/mappers/base-abstract.mapper';
import { HotmartUserDto } from '../dto/hotmart-user.dto';
import { Usuarios } from 'src/usuarios/entities/usuarios.entity';
import { Injectable } from '@nestjs/common';
import { DataSourceEnum } from 'src/common/enums/data-source.enum';

@Injectable()
export class HotmartUserMapper extends BaseAbstractMapper<
  HotmartUserDto,
  Usuarios
> {
  mapTo(src: HotmartUserDto): Usuarios {
    console.log(src);
    const mapped = new Usuarios();
    mapped.integration_id = src.ucode;
    mapped.nome = src.name;
    mapped.telefone = src.phone || src.cellphone;
    mapped.documento = src.documents[0].value;
    mapped.cep = src.address?.zip_code;
    mapped.endereco = src.address?.address;
    mapped.numero = src.address?.number;
    mapped.complemento = src.address?.complement;
    mapped.data_source = DataSourceEnum.Hotmart;

    return mapped;
  }

  mapFrom(dest: Usuarios): HotmartUserDto {
    throw new Error('Method not implemented.');
  }
}
