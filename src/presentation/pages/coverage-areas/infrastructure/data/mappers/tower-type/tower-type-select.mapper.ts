import { Injectable } from '@angular/core';
import { TowerTypeSelectItemApiDto } from '@pages/coverage-areas/infrastructure/api/dto/tower-type/tower-type-select-response-api.dto';
import { ArrayResponseMapper } from '@shared/data/mappers/base/array-response.mapper';
import { SelectOption } from '@shared/domain/interfaces/select-option.interface';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({ providedIn: 'root' })
export class TowerTypeSelectMapper extends ArrayResponseMapper<
    SelectOption,
    TowerTypeSelectItemApiDto
> {
    protected mapItemFromDto(dto: TowerTypeSelectItemApiDto): SelectOption {
        MapperUtils.validateDto(dto, { required: ['id'] });

        return {
            label: dto.name,
            value: dto.id,
        };
    }
}
