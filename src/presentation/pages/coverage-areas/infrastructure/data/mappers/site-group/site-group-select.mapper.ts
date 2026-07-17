import { Injectable } from '@angular/core';
import { SiteGroupSelectItemApiDto } from '@pages/coverage-areas/infrastructure/api/dto/site-group/site-group-select-response-api.dto';
import { ArrayResponseMapper } from '@shared/data/mappers/base/array-response.mapper';
import { SelectOption } from '@shared/domain/interfaces/select-option.interface';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({ providedIn: 'root' })
export class SiteGroupSelectMapper extends ArrayResponseMapper<
    SelectOption,
    SiteGroupSelectItemApiDto
> {
    protected mapItemFromDto(dto: SiteGroupSelectItemApiDto): SelectOption {
        MapperUtils.validateDto(dto, { required: ['id'] });

        return {
            label: dto.name,
            value: dto.id,
        };
    }
}
