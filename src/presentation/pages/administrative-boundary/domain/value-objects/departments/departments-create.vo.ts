import { DepartmentsCreateDto } from '@pages/administrative-boundary/application/dto/departments/departments-create.dto';

export class DepartmentsCreateVo {
    public readonly code: string;
    public readonly population: number;
    public readonly infrastructure: number;
    public readonly name: string;
    public readonly region: string;
    public readonly description: string;

    constructor(props: {
        code: string;
        population: number;
        infrastructure: number;
        name: string;
        region: string;
        description: string;
    }) {
        this.code = props.code;
        this.population = props.population;
        this.infrastructure = props.infrastructure;
        this.name = props.name;
        this.region = props.region;
        this.description = props.description;
    }

    static fromDto(dto: DepartmentsCreateDto): DepartmentsCreateVo {
        return new DepartmentsCreateVo({
            code: dto.code,
            population: dto.population,
            infrastructure: dto.infrastructure,
            name: dto.name,
            region: dto.region,
            description: dto.description,
        });
    }
}
