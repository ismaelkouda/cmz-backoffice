import { Injectable } from '@angular/core';
import { FiberConstructorSelectItemApiDto } from '@pages/coverage-areas/infrastructure/api/dto/fiber-constructor/fiber-constructor-select-response-api.dto';
import { ArrayResponseMapper } from '@shared/data/mappers/base/array-response.mapper';
import { SelectOption } from '@shared/domain/interfaces/select-option.interface';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({ providedIn: 'root' })
export class FiberConstructorSelectMapper extends ArrayResponseMapper<
    SelectOption,
    FiberConstructorSelectItemApiDto
> {
    protected mapItemFromDto(
        dto: FiberConstructorSelectItemApiDto
    ): SelectOption {
        MapperUtils.validateDto(dto, { required: ['id'] });

        return {
            label: dto.name,
            value: dto.id,
        };
    }
}
