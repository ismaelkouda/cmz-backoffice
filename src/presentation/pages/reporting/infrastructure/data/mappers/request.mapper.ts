import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';

import { RequestEntity } from '../../../domain/entities/requests/request.entity';
import { RequestItemDto } from '../../api/dto/requests/request-response.dto';

export class RequestMapper extends SimpleResponseMapper<
    RequestEntity,
    RequestItemDto
> {
    protected override mapItemFromDto(dto: RequestItemDto): RequestEntity {
        console.log('dto', dto);
        return new RequestEntity(dto.requestReportReportingLink);
    }
}
