import { MunicipalitiesFilterDto } from "../../../application/dtos/municipalities/municipalities-filter.dto";

export class MunicipalitiesFilter {
    private constructor(
        readonly search?: string,
        readonly regionCode?: string,
        readonly departmentCode?: string,
        readonly isActive?: boolean,
        readonly startDate?: string,
        readonly endDate?: string,
    ) { }

    static create(data: MunicipalitiesFilterDto | null = {} as MunicipalitiesFilterDto): MunicipalitiesFilter {
        if (data?.startDate && data.endDate) {
            if (new Date(data.startDate) > new Date(data.endDate)) {
                throw new Error('Invalid date range');
            }
        }
        return new MunicipalitiesFilter(
            data?.search,
            data?.regionCode,
            data?.departmentCode,
            data?.isActive,
            data?.startDate,
            data?.endDate,
        );
    }
}
