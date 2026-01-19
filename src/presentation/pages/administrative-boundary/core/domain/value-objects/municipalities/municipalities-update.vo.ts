import { MunicipalitiesUpdateDto } from "../../../application/dtos/municipalities/municipalities-update.dto";


export class MunicipalitiesUpdate {
    private constructor(
        readonly id: string,
        readonly code?: string,
        readonly name?: string,
        readonly departmentCode?: string,
        readonly description?: string,
    ) { }

    static create(data: MunicipalitiesUpdateDto = {} as MunicipalitiesUpdateDto): MunicipalitiesUpdate {
        return new MunicipalitiesUpdate(
            data.id,
            data.code,
            data.name,
            data.departmentCode,
            data.description,
        );
    }
}
