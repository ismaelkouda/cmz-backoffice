import { Injectable } from '@angular/core';
import { InfrastructureSelectEntity } from '@pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure-select.entity';
import { InfrastructureSelectProps } from '@presentation/pages/administrative-infrastructure/domain/interfaces/infrastructure/infrastructure-select-props.interface';
import { InfrastructureSelectItemApiDto } from '@presentation/pages/administrative-infrastructure/infrastructure/api/dto/infrastructure/infrastructure-select-response-api.dto';
import { ArrayResponseMapper } from '@shared/data/mappers/base/array-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({ providedIn: 'root' })
export class InfrastructureSelectMapper extends ArrayResponseMapper<
    InfrastructureSelectEntity,
    InfrastructureSelectItemApiDto
> {
    protected mapItemFromDto(
        dto: InfrastructureSelectItemApiDto
    ): InfrastructureSelectEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });

        const props: InfrastructureSelectProps = {
            label: dto.name,
            value: dto.id,
        };

        return new InfrastructureSelectEntity(props);
    }
}
