import { RegionsUpdateVo } from '@pages/administrative-boundary/domain/value-objects/regions/regions-update.vo';

export class RegionsUpdateEntity {
    constructor(
        public readonly uniqId: string,
        public readonly code: string,
        public readonly population: number,
        public readonly infrastructure: number,
        public readonly name: string,
        public readonly description: string
    ) {}

    static fromVo(vo: RegionsUpdateVo): RegionsUpdateEntity {
        return new RegionsUpdateEntity(
            vo.uniqId,
            vo.code,
            vo.population,
            vo.infrastructure,
            vo.name,
            vo.description
        );
    }
}
