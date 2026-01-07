import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
import { RequestEntity } from '../../../core/domain/entities/requests/request.entity';
import { RequestItemDto } from '../../api/dtos/requests/request-response.dto';

export class RequestMapper extends SimpleResponseMapper<
    RequestEntity,
    RequestItemDto
> {
    protected override mapItemFromDto(dto: RequestItemDto): RequestEntity {
        console.log("dto", dto);
        return new RequestEntity(dto.requestReportReportingLink);
    }
}
