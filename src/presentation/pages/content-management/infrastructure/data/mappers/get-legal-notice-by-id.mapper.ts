import { Injectable } from '@angular/core';

import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';

import {
    GetLegalNoticeByIdItemDto,
    GetLegalNoticeByIdResponseDto,
} from '@presentation/pages/content-management/application/dto/legal-notice/get-legal-notice-by-id-response.dto';
import { GetLegalNoticeByIdEntity } from '@presentation/pages/content-management/domain/entities/get-legal-notice-by-id.entity';

@Injectable({
    providedIn: 'root',
})
export class GetLegalNoticeByIdMapper extends SimpleResponseMapper<
    GetLegalNoticeByIdEntity,
    GetLegalNoticeByIdItemDto
> {
    public toEntity(
        dto: GetLegalNoticeByIdResponseDto
    ): GetLegalNoticeByIdEntity {
        return this.mapItemFromDto(dto.data);
    }
    public mapItemFromDto(
        dto: GetLegalNoticeByIdItemDto
    ): GetLegalNoticeByIdEntity {
        return new GetLegalNoticeByIdEntity(dto.content, dto.version);
    }
}
