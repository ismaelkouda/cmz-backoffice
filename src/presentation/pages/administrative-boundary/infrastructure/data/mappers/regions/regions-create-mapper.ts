import { RegionsCreate } from "@presentation/pages/administrative-boundary/core/domain/value-objects/regions/regions-create.vo";
import { RegionsCreateApiDto } from "@presentation/pages/administrative-boundary/infrastructure/api/dtos/regions/regions-create-api.dto";


export class RegionsCreateMapper {
    static toApi(create: RegionsCreate): RegionsCreateApiDto {
        const params: RegionsCreateApiDto = {} as RegionsCreateApiDto;

        if (create.code) params['code'] = create.code;
        if (create.name) params['name'] = create.name;
        if (create.description) params['description'] = create.description;

        return params;
    }
}
