import { HistoryFindOneFilterDto } from '@shared/components/history/application/dto/history-find-one-filter.dto';

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
