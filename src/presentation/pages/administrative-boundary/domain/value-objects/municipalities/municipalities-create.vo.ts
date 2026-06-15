import { MunicipalitiesCreateDto } from '@pages/administrative-boundary/application/dto/municipalities/municipalities-create.dto';

export class MunicipalitiesCreateVo {
    public readonly code: string;
    public readonly population: number;
    public readonly infrastructure: number;
    public readonly name: string;
    public readonly region: string;
    public readonly description: string;
    public readonly department: string | null;

    constructor(props: {
        code: string;
        population: number;
        infrastructure: number;
        name: string;
        region: string;
        description: string;
        department: string | null;
    }) {
        this.code = props.code;
        this.population = props.population;
        this.infrastructure = props.infrastructure;
        this.name = props.name;
        this.region = props.region;
        this.description = props.description;
        this.department = props.department;
    }

    static fromDto(dto: MunicipalitiesCreateDto): MunicipalitiesCreateVo {
        return new MunicipalitiesCreateVo({
            code: dto.code,
            population: dto.population,
            infrastructure: dto.infrastructure,
            name: dto.name,
            region: dto.region,
            description: dto.description,
            department: dto.department,
        });
    }
}
