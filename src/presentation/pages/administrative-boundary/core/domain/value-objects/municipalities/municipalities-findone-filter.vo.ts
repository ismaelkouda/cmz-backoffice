import { MunicipalitiesFindoneFilterDto } from "@presentation/pages/administrative-boundary/core/application/dtos/municipalities/municipalities-findone-filter.dto";
import { MunicipalitiesFindoneFilterApiDto } from "@presentation/pages/administrative-boundary/infrastructure/api/dtos/municipalities/municipalities-findone-filter-api.dto";

export class MunicipalitiesFindoneFilter {
    private constructor(
        private readonly code: string,
    ) { }

    static create(data: MunicipalitiesFindoneFilterDto = {} as MunicipalitiesFindoneFilterDto): MunicipalitiesFindoneFilter {
        return new MunicipalitiesFindoneFilter(
            data.code
        );
    }

    toDto(): MunicipalitiesFindoneFilterApiDto {
        const params: MunicipalitiesFindoneFilterApiDto = {} as MunicipalitiesFindoneFilterApiDto;

        params['code'] = this.code;

        return params;
    }
}
