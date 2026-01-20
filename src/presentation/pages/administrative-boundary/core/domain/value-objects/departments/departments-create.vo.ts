import { DepartmentsCreateDto } from "../../../application/dtos/departments/departments-create.dto";


export class DepartmentsCreate {
    private constructor(
        readonly code: string,
        readonly name: string,
        readonly regionCode: string,
        readonly description: string,
    ) { }

    static create(data: DepartmentsCreateDto = {} as DepartmentsCreateDto): DepartmentsCreate {
        return new DepartmentsCreate(
            data.code,
            data.name,
            data.regionCode,
            data.description,
        );
    }
}
