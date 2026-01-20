import { RegionsFindoneFilterDto } from "@presentation/pages/administrative-boundary/core/application/dtos/regions/regions-findone-filter.dto";
import { RegionsFindoneFilterApiDto } from "@presentation/pages/administrative-boundary/infrastructure/api/dtos/regions/regions-findone-filter-api.dto";

export class RegionsFindoneFilter {
    private constructor(
        private readonly code: string,
    ) { }

    static create(data: RegionsFindoneFilterDto = {} as RegionsFindoneFilterDto): RegionsFindoneFilter {
        return new RegionsFindoneFilter(
            data.code,
        );
    }

    toDto(): RegionsFindoneFilterApiDto {
        const params: RegionsFindoneFilterApiDto = {} as RegionsFindoneFilterApiDto;

        params['code'] = this.code;

        return params;
    }
}
