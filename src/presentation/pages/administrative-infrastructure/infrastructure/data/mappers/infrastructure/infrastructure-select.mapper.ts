import { Injectable } from '@angular/core';
import { InfrastructureSelectItemApiDto } from '@presentation/pages/administrative-infrastructure/infrastructure/api/dto/infrastructure/infrastructure-select-response-api.dto';
import { ArrayResponseMapper } from '@shared/data/mappers/base/array-response.mapper';
import { SelectOption } from '@shared/domain/interfaces/select-option.interface';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({ providedIn: 'root' })
export class InfrastructureSelectMapper extends ArrayResponseMapper<
    SelectOption,
    InfrastructureSelectItemApiDto
> {
    protected mapItemFromDto(
        dto: InfrastructureSelectItemApiDto
    ): SelectOption {
        MapperUtils.validateDto(dto, { required: ['id'] });

        return {
            label: dto.name,
            value: dto.id,
        };
    }
}
