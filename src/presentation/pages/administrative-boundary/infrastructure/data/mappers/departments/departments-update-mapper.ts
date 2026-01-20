import { DepartmentsUpdate } from "@presentation/pages/administrative-boundary/core/domain/value-objects/departments/departments-update.vo";
import { DepartmentsUpdateApiDto } from "@presentation/pages/administrative-boundary/infrastructure/api/dtos/departments/departments-update-api.dto";


export class DepartmentsUpdateMapper {
    static toApi(update: DepartmentsUpdate): DepartmentsUpdateApiDto {
        const params: DepartmentsUpdateApiDto = {} as DepartmentsUpdateApiDto;

        params.id = update.id;
        if (update.code) params['code'] = update.code;
        if (update.name) params['name'] = update.name;
        if (update.regionCode) params['region_code'] = update.regionCode;
        if (update.description) params['description'] = update.description;

        return params;
    }
}
