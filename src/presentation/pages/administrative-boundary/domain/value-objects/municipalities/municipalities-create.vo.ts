import { MunicipalitiesCreateDto } from '@presentation/pages/administrative-boundary/application/dto/municipalities/municipalities-create.dto';

export class MunicipalitiesCreateVo {
    public readonly code: string;
    public readonly name: string;
    public readonly department: string;
    public readonly description: string;

    constructor(props: {
        code: string;
        name: string;
        department: string;
        description: string;
    }) {
        this.code = props.code;
        this.name = props.name;
        this.department = props.department;
        this.description = props.description;
    }

    static fromDto(dto: MunicipalitiesCreateDto): MunicipalitiesCreateVo {
        return new MunicipalitiesCreateVo({
            code: dto.code,
            name: dto.name,
            department: dto.department,
            description: dto.description,
        });
    }
}
