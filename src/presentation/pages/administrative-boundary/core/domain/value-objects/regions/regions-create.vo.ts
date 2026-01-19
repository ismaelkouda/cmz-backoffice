import { RegionsCreateDto } from "../../../application/dtos/regions/regions-create.dto";


export class RegionsCreate {
    private constructor(
        readonly code?: string,
        readonly name?: string,
        readonly description?: string,
    ) { }

    static create(data: RegionsCreateDto = {} as RegionsCreateDto): RegionsCreate {
        return new RegionsCreate(
            data.code,
            data.name,
            data.description,
        );
    }
}
