import { Injectable } from '@angular/core';
import { InfrastructureTypeSelectItemApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure-type/infrastructure-type-select-response-api.dto';
import { ArrayResponseMapper } from '@shared/data/mappers/base/array-response.mapper';
import { SelectOption } from '@shared/domain/interfaces/select-option.interface';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({ providedIn: 'root' })
export class InfrastructureTypeSelectMapper extends ArrayResponseMapper<
    SelectOption,
    InfrastructureTypeSelectItemApiDto
> {
    protected mapItemFromDto(
        dto: InfrastructureTypeSelectItemApiDto
    ): SelectOption {
        MapperUtils.validateDto(dto, { required: ['id'] });

        return {
            label: dto.name,
            value: dto.id,
        };
    }
}
