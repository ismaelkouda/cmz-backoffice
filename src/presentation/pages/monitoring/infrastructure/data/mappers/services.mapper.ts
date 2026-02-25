import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';

import { ServicesEntity } from '../../../domain/entities/services/services.entity';
import { ServicesItemDto } from '../../api/dto/services/services-response.dto';

export class ServicesMapper extends SimpleResponseMapper<
    ServicesEntity,
    ServicesItemDto
> {
    protected override mapItemFromDto(dto: ServicesItemDto): ServicesEntity {
        console.log('dto', dto);
        return new ServicesEntity(dto.servicesMonitoringLink);
    }
}
