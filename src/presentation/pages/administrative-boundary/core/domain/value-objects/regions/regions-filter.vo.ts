import { RegionsFilterDto } from "../../../application/dtos/regions/regions-filter.dto";

export class RegionsFilter {
    private constructor(
        readonly search?: string,
        readonly departmentCode?: string,
        readonly municipalityCode?: string,
        readonly isActive?: boolean,
        readonly startDate?: string,
        readonly endDate?: string,
    ) { }

    static create(data: RegionsFilterDto | null = {} as RegionsFilterDto): RegionsFilter {
        if (data?.startDate && data?.endDate) {
            if (new Date(data.startDate) > new Date(data.endDate)) {
                throw new Error('Invalid date range');
            }
        }
        return new RegionsFilter(
            data?.search,
            data?.departmentCode,
            data?.municipalityCode,
            data?.isActive,
            data?.startDate,
            data?.endDate,
        );
    }
}
