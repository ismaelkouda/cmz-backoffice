import { RegionsCreateVo } from '@pages/administrative-boundary/domain/value-objects/regions/regions-create.vo';

export class RegionsCreateEntity {
    constructor(
        public readonly code: string,
        public readonly population: number,
        public readonly infrastructure: number,
        public readonly name: string,
        public readonly description: string
    ) {}

    static fromVo(vo: RegionsCreateVo): RegionsCreateEntity {
        return new RegionsCreateEntity(
            vo.code,
            vo.population,
            vo.infrastructure,
            vo.name,
            vo.description
        );
    }
}
