import { MunicipalitiesUpdateDto } from '@presentation/pages/administrative-boundary/application/dto/municipalities/municipalities-update.dto';

export class MunicipalitiesUpdateVo {
    public readonly uniqId: string;
    public readonly code: string;
    public readonly name: string;
    public readonly department: string;
    public readonly description: string;

    constructor(props: {
        uniqId: string;
        code: string;
        name: string;
        department: string;
        description: string;
    }) {
        this.uniqId = props.uniqId;
        this.code = props.code;
        this.name = props.name;
        this.department = props.department;
        this.description = props.description;
    }

    static fromDto(dto: MunicipalitiesUpdateDto): MunicipalitiesUpdateVo {
        return new MunicipalitiesUpdateVo({
            uniqId: dto.uniqId.trim(),
            code: dto.code,
            name: dto.name,
            department: dto.department,
            description: dto.description,
        });
    }
}
