import { Injectable } from '@angular/core';
import { InfrastructureTypeSelectEntity } from '@pages/administrative-infrastructure/domain/entities/infrastructure-type/infrastructure-type-select.entity';
import { InfrastructureTypeSelectItemApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure-type/infrastructure-type-select-response-api.dto';
import { InfrastructureTypeSelectProps } from '@presentation/pages/administrative-infrastructure/domain/interfaces/infrastructure-type/infrastructure-type-select-props.interface';
import { ArrayResponseMapper } from '@shared/data/mappers/base/array-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({ providedIn: 'root' })
export class InfrastructureTypeSelectMapper extends ArrayResponseMapper<
    InfrastructureTypeSelectEntity,
    InfrastructureTypeSelectItemApiDto
> {
    protected mapItemFromDto(
        dto: InfrastructureTypeSelectItemApiDto
    ): InfrastructureTypeSelectEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });

        const props: InfrastructureTypeSelectProps = {
            label: dto.name,
            value: dto.id,
        };

        return new InfrastructureTypeSelectEntity(props);
    }
}
