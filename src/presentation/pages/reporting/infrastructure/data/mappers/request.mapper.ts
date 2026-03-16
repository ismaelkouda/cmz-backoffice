import { Injectable } from '@angular/core';
import { RequestsEntity } from '@pages/reporting/domain/entities/requests/requests.entity';
import { RequestItemDto } from '@pages/reporting/infrastructure/api/dto/requests/request-response.dto';
import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';

@Injectable({ providedIn: 'root' })
export class RequestMapper extends SimpleResponseMapper<
    RequestsEntity,
    RequestItemDto
> {
    protected override mapItemFromDto(dto: RequestItemDto): RequestsEntity {
        console.log('dto', dto);
        return new RequestsEntity(dto.requestReportReportingLink);
    }
}
