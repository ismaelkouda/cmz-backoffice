import { HistoryFindOneFilterDto } from '@shared/components/history/core/application/dtos/history-findone-filter.dto';

export class HistoryFindOneFilterVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(dto: HistoryFindOneFilterDto): HistoryFindOneFilterVo {
        return new HistoryFindOneFilterVo({
            uniqId: dto.uniqId,
        });
    }
}
