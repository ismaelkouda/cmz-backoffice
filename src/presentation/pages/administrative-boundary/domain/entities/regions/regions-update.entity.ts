import { RegionsUpdateVo } from '@presentation/pages/administrative-boundary/domain/value-objects/regions/regions-update.vo';

export class RegionsUpdateEntity {
    constructor(
        public readonly uniqId: string,
        public readonly code: string,
        public readonly name: string,
        public readonly description: string
    ) {}

    static fromVo(vo: RegionsUpdateVo): RegionsUpdateEntity {
        return new RegionsUpdateEntity(
            vo.uniqId,
            vo.code,
            vo.name,
            vo.description
        );
    }
}
