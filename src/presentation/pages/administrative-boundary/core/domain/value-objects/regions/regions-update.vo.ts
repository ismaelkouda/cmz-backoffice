import { RegionsUpdateDto } from "../../../application/dtos/regions/regions-update.dto";


export class RegionsUpdate {
    private constructor(
        readonly id: string,
        readonly code: string,
        readonly name: string,
        readonly description: string,
    ) { }

    static create(data: RegionsUpdateDto = {} as RegionsUpdateDto): RegionsUpdate {
        return new RegionsUpdate(
            data.id,
            data.code,
            data.name,
            data.description,
        );
    }
}
