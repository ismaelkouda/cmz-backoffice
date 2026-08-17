import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';

import { ResourcesEntity } from '../../../domain/entities/resources/resources.entity';
import { ResourcesItemDto } from '../../api/dto/resources/resources-response.dto';

export class ResourcesMapper extends SimpleResponseMapper<
    ResourcesEntity,
    ResourcesItemDto
> {
    protected override mapItemFromDto(dto: ResourcesItemDto): ResourcesEntity {
        return new ResourcesEntity(dto.useOfResourcesLink);
    }
}
