import { RegionsUpdateDto } from '@pages/administrative-boundary/application/dto/regions/regions-update.dto';

export class RegionsUpdateVo {
    public readonly uniqId: string;
    public readonly code: string;
    public readonly name: string;
    public readonly description: string;

    constructor(props: {
        uniqId: string;
        code: string;
        name: string;
        description: string;
    }) {
        this.uniqId = props.uniqId;
        this.code = props.code;
        this.name = props.name;
        this.description = props.description;
    }

    static fromDto(dto: RegionsUpdateDto): RegionsUpdateVo {
        return new RegionsUpdateVo({
            uniqId: dto.uniqId.trim(),
            code: dto.code,
            name: dto.name,
            description: dto.description,
        });
    }
}
