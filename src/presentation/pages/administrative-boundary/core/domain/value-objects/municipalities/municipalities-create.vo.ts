import { MunicipalitiesCreateDto } from "../../../application/dtos/municipalities/municipalities-create.dto";


export class MunicipalitiesCreate {
    private constructor(
        readonly code: string,
        readonly name: string,
        readonly departmentCode: string,
        readonly description: string,
    ) { }

    static create(data: MunicipalitiesCreateDto = {} as MunicipalitiesCreateDto): MunicipalitiesCreate {
        return new MunicipalitiesCreate(
            data.code,
            data.name,
            data.departmentCode,
            data.description,
        );
    }
}
