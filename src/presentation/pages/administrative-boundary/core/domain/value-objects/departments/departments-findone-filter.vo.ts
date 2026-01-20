import { DepartmentsFindoneFilterDto } from "@presentation/pages/administrative-boundary/core/application/dtos/departments/departments-findone-filter.dto";
import { DepartmentsFindoneFilterApiDto } from "@presentation/pages/administrative-boundary/infrastructure/api/dtos/departments/departments-findone-filter-api.dto";

export class DepartmentsFindoneFilter {
    private constructor(
        private readonly code: string,
    ) { }

    static create(data: DepartmentsFindoneFilterDto = {} as DepartmentsFindoneFilterDto): DepartmentsFindoneFilter {
        return new DepartmentsFindoneFilter(
            data.code
        );
    }

    toDto(): DepartmentsFindoneFilterApiDto {
        const params: DepartmentsFindoneFilterApiDto = {} as DepartmentsFindoneFilterApiDto;

        params['code'] = this.code;

        return params;
    }
}
