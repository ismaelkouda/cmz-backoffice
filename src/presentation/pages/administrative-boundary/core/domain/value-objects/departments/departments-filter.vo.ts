import { DepartmentsFilterDto } from "../../../application/dtos/departments/departments-filter.dto";

export class DepartmentsFilter {
    private constructor(
        readonly search?: string,
        readonly regionCode?: string,
        readonly municipalityId?: string,
        readonly isActive?: boolean,
        readonly startDate?: string,
        readonly endDate?: string,
    ) { }

    static create(data: DepartmentsFilterDto | null = {} as DepartmentsFilterDto): DepartmentsFilter {
        if (data?.startDate && data.endDate) {
            if (new Date(data.startDate) > new Date(data.endDate)) {
                throw new Error('Invalid date range');
            }
        }
        return new DepartmentsFilter(
            data?.search,
            data?.regionCode,
            data?.municipalityId,
            data?.isActive,
            data?.startDate,
            data?.endDate,
        );
    }
}
