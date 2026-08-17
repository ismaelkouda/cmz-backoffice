import { HistoryFindOneFilterDto } from '@shared/components/history/application/dto/history-find-one-filter.dto';

export class HistoryFindOneFilterVo {
    public readonly uniqId: string;
    public readonly typeModel: string;

    constructor(props: { uniqId: string; typeModel: string }) {
        this.uniqId = props.uniqId;
        this.typeModel = props.typeModel;
    }

    static fromDto(dto: HistoryFindOneFilterDto): HistoryFindOneFilterVo {
        return new HistoryFindOneFilterVo({
            uniqId: dto.uniqId,
            typeModel: dto.typeModel,
        });
    }
}
