import { Injectable } from '@angular/core';
import { GetLegalNoticeByIdItemDto, GetLegalNoticeByIdResponseDto } from '@presentation/pages/content-management/core/application/dtos/legal-notice/get-legal-notice-by-id-response.dto';
import { GetLegalNoticeByIdEntity } from '@presentation/pages/content-management/core/domain/entities/get-legal-notice-by-id.entity';
import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';

@Injectable({
    providedIn: 'root',
})
export class GetLegalNoticeByIdMapper extends SimpleResponseMapper<GetLegalNoticeByIdEntity, GetLegalNoticeByIdItemDto> {

    public toEntity(dto: GetLegalNoticeByIdResponseDto): GetLegalNoticeByIdEntity {
        return this.mapItemFromDto(dto.data);
    }
    public mapItemFromDto(dto: GetLegalNoticeByIdItemDto): GetLegalNoticeByIdEntity {
        return new GetLegalNoticeByIdEntity(
            dto.content,
        );
    }
}
