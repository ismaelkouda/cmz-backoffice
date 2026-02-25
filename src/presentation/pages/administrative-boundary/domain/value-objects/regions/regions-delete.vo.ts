import { RegionsDeleteDto } from '@presentation/pages/administrative-boundary/application/dto/regions/regions-delete.dto';

export class RegionsDeleteVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(dto: RegionsDeleteDto): RegionsDeleteVo {
        return new RegionsDeleteVo({
            uniqId: dto.uniqId.trim(),
        });
    }
}
