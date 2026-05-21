import { MunicipalitiesUpdateDto } from '@pages/administrative-boundary/application/dto/municipalities/municipalities-update.dto';

export class MunicipalitiesUpdateVo {
    public readonly uniqId: string;
    public readonly code: string;
    public readonly name: string;
    public readonly region: string;
    public readonly description: string;
    public readonly department: string | null;

    constructor(props: {
        uniqId: string;
        code: string;
        name: string;
        region: string;
        description: string;
        department: string | null;
    }) {
        this.uniqId = props.uniqId;
        this.code = props.code;
        this.name = props.name;
        this.region = props.region;
        this.description = props.description;
        this.department = props.department;
    }

    static fromDto(dto: MunicipalitiesUpdateDto): MunicipalitiesUpdateVo {
        return new MunicipalitiesUpdateVo({
            uniqId: dto.uniqId,
            code: dto.code,
            name: dto.name,
            region: dto.region,
            description: dto.description,
            department: dto.department,
        });
    }
}
