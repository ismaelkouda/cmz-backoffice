import { RegionsCreateDto } from '@presentation/pages/administrative-boundary/application/dto/regions/regions-create.dto';

export class RegionsCreateVo {
    public readonly code: string;
    public readonly name: string;
    public readonly description: string;

    constructor(props: { code: string; name: string; description: string }) {
        this.code = props.code;
        this.name = props.name;
        this.description = props.description;
    }

    static fromDto(dto: RegionsCreateDto): RegionsCreateVo {
        return new RegionsCreateVo({
            code: dto.code,
            name: dto.name,
            description: dto.description,
        });
    }
}
