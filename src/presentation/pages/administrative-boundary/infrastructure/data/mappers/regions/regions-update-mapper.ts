import { RegionsUpdate } from "@presentation/pages/administrative-boundary/core/domain/value-objects/regions/regions-update.vo";
import { RegionsUpdateApiDto } from "@presentation/pages/administrative-boundary/infrastructure/api/dtos/regions/regions-update-api.dto";


export class RegionsUpdateMapper {
    static toApi(update: RegionsUpdate): RegionsUpdateApiDto {
        const params: RegionsUpdateApiDto = {} as RegionsUpdateApiDto;

        params.id = update.id;
        if (update.code) params['code'] = update.code;
        if (update.name) params['name'] = update.name;
        if (update.description) params['description'] = update.description;

        return params;
    }
}
