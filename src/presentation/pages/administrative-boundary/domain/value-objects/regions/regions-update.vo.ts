import { RegionsUpdateDto } from '@pages/administrative-boundary/application/dto/regions/regions-update.dto';

export class RegionsUpdateVo {
    public readonly uniqId: string;
    public readonly code: string;
    public readonly population: number;
    public readonly infrastructure: number;
    public readonly name: string;
    public readonly description: string;

    constructor(props: {
        uniqId: string;
        code: string;
        population: number;
        infrastructure: number;
        name: string;
        description: string;
    }) {
        this.uniqId = props.uniqId;
        this.code = props.code;
        this.population = props.population;
        this.infrastructure = props.infrastructure;
        this.name = props.name;
        this.description = props.description;
    }

    static fromDto(dto: RegionsUpdateDto): RegionsUpdateVo {
        return new RegionsUpdateVo({
            uniqId: dto.uniqId,
            code: dto.code,
            population: dto.population,
            infrastructure: dto.infrastructure,
            name: dto.name,
            description: dto.description,
        });
    }
}
