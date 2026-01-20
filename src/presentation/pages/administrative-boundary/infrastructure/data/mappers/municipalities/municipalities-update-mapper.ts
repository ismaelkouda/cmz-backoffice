import { MunicipalitiesUpdate } from "@presentation/pages/administrative-boundary/core/domain/value-objects/municipalities/municipalities-update.vo";
import { MunicipalitiesUpdateApiDto } from "@presentation/pages/administrative-boundary/infrastructure/api/dtos/municipalities/municipalities-update-api.dto";


export class MunicipalitiesUpdateMapper {
    static toApi(update: MunicipalitiesUpdate): MunicipalitiesUpdateApiDto {
        const params: MunicipalitiesUpdateApiDto = {} as MunicipalitiesUpdateApiDto;

        params.id = update.id;
        if (update.code) params['code'] = update.code;
        if (update.name) params['name'] = update.name;
        if (update.departmentCode) params['department_code'] = update.departmentCode;
        if (update.description) params['description'] = update.description;

        return params;
    }
}
