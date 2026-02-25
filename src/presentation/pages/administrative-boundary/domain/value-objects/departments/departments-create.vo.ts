import { DepartmentsCreateDto } from '@presentation/pages/administrative-boundary/application/dto/departments/departments-create.dto';

export class DepartmentsCreateVo {
    public readonly code: string;
    public readonly name: string;
    public readonly region: string;
    public readonly description: string;

    constructor(props: {
        code: string;
        name: string;
        region: string;
        description: string;
    }) {
        this.code = props.code;
        this.name = props.name;
        this.region = props.region;
        this.description = props.description;
    }

    static fromDto(dto: DepartmentsCreateDto): DepartmentsCreateVo {
        return new DepartmentsCreateVo({
            code: dto.code,
            name: dto.name,
            region: dto.region,
            description: dto.description,
        });
    }
}
