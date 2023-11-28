import { BaseAbstractMapper } from 'src/common/mappers/base-abstract.mapper';
import { Plano } from 'src/produtos/entities/plano.entetity';
import { N8nPlanDto } from '../dto/n8n-plan.dto';

export class N8nPlanMapper extends BaseAbstractMapper<N8nPlanDto, Plano> {
  mapTo(src: N8nPlanDto): Plano {
    const mapped = new Plano();

    mapped.integration_id = src.id;
    mapped.nome = src.nome;
    mapped.ciclos = src.ciclos;
    mapped.desconto_valor = src.descontoValor;
    mapped.desconto_ciclos = src.descontoCiclos;
    mapped.incremento_valor = src.incrementoValor;
    mapped.incremento_ciclo = src.incrementoCiclo;
    mapped.intervalo = src.intervalo;
    mapped.tipo_intervalo = src.tipoIntervalo;
    mapped.dias_teste = src.diasTeste;
    mapped.teste = src.teste;

    return mapped;
  }

  mapFrom(dest: Plano): N8nPlanDto {
    throw new Error('Method not implemented.');
  }
}
