import { RegionsCreateDto } from '@pages/administrative-boundary/application/dto/regions/regions-create.dto';

export class RegionsCreateVo {
    public readonly code: string;
    public readonly population: number;
    public readonly infrastructure: number;
    public readonly name: string;
    public readonly description: string;

    constructor(props: {
        code: string;
        population: number;
        infrastructure: number;
        name: string;
        description: string;
    }) {
        this.code = props.code;
        this.population = props.population;
        this.infrastructure = props.infrastructure;
        this.name = props.name;
        this.description = props.description;
    }

    static fromDto(dto: RegionsCreateDto): RegionsCreateVo {
        return new RegionsCreateVo({
            code: dto.code,
            population: dto.population,
            infrastructure: dto.infrastructure,
            name: dto.name,
            description: dto.description,
        });
    }
}
