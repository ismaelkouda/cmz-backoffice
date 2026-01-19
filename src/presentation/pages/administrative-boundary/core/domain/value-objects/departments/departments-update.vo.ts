import { DepartmentsUpdateDto } from "../../../application/dtos/departments/departments-update.dto";


export class DepartmentsUpdate {
    private constructor(
        readonly id: string,
        readonly code: string,
        readonly name: string,
        readonly regionCode: string,
        readonly description: string,
    ) { }

    static create(data: DepartmentsUpdateDto = {} as DepartmentsUpdateDto): DepartmentsUpdate {

        return new DepartmentsUpdate(
            data.id,
            data.code,
            data.name,
            data.regionCode,
            data.description,
        );
    }
}
