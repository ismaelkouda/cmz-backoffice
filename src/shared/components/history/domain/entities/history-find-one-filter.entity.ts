import { HistoryFindOneFilterVo } from '@shared/components/history/domain/value-objects/history-findone-filter.vo';

export class HistoryFindOneFilterEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(vo: HistoryFindOneFilterVo): HistoryFindOneFilterEntity {
        return new HistoryFindOneFilterEntity(vo.uniqId);
    }
}
