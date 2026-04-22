import { HistoryFindOneFilterVo } from '@shared/components/history/domain/value-objects/history-find-one-filter.vo';

export class HistoryFindOneFilterEntity {
    constructor(
        public readonly uniqId: string,
        public readonly typeModel: string
    ) {}

    static fromVo(vo: HistoryFindOneFilterVo): HistoryFindOneFilterEntity {
        console.log('vo: ', vo);
        return new HistoryFindOneFilterEntity(vo.uniqId, vo.typeModel);
    }
}
