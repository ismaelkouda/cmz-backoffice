import { MunicipalitiesCreateDto } from '@pages/administrative-boundary/application/dto/municipalities/municipalities-create.dto';

export class MunicipalitiesCreateVo {
    public readonly code: string;
    public readonly name: string;
    public readonly region: string;
    public readonly description: string;
    public readonly department?: string;

    constructor(props: {
        code: string;
        name: string;
        region: string;
        description: string;
        department?: string;
    }) {
        this.code = props.code;
        this.name = props.name;
        this.region = props.region;
        this.description = props.description;
        this.department = props.department;
    }

    static fromDto(dto: MunicipalitiesCreateDto): MunicipalitiesCreateVo {
        return new MunicipalitiesCreateVo({
            code: dto.code,
            name: dto.name,
            region: dto.region,
            description: dto.description,
            department: dto.department,
        });
    }
}
