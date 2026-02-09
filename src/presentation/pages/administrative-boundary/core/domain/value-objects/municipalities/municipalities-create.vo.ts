import { MunicipalitiesCreateDto } from '../../../application/dtos/municipalities/municipalities-create.dto';

export class MunicipalitiesCreate {
    private constructor(
        readonly code: string,
        readonly name: string,
        readonly departmentId: string,
        readonly description: string
    ) {}

    static create(
        data: MunicipalitiesCreateDto = {} as MunicipalitiesCreateDto
    ): MunicipalitiesCreate {
        return new MunicipalitiesCreate(
            data.code,
            data.name,
            data.departmentId,
            data.description
        );
    }
}
