import { inject, Injectable } from '@angular/core';
import { LegalNoticeItemDto } from '@presentation/pages/content-management/core/application/dtos/legal-notice/legal-notice-response.dto';
import { LegalNoticeEntity } from '@presentation/pages/content-management/core/domain/entities/legal-notice.entity';
import { ActionDropdownDto } from '@shared/data/dtos/action-dropdown.dto';
import { ActionDropdownMapper } from '@shared/data/mappers/action-dropdown.mapper';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';

@Injectable({
    providedIn: 'root',
})
export class LegalNoticeMapper extends PaginatedMapper<LegalNoticeEntity, LegalNoticeItemDto> {

    private readonly actionDropdownMapper: ActionDropdownMapper = inject(ActionDropdownMapper)

    public toEntity(dto: LegalNoticeItemDto): LegalNoticeEntity {
        return this.mapItemFromDto(dto);
    }
    public override mapItemFromDto(dto: LegalNoticeItemDto): LegalNoticeEntity {
        const mappedActionDropdown = this.actionDropdownMapper.mapFromDto(this.mapActionDropdown(dto.is_published));
        return new LegalNoticeEntity(
            dto.id,
            dto.name,
            dto.content,
            dto.version,
            mappedActionDropdown,
            dto.created_at,
            dto.published_at
        );
    }
    private mapActionDropdown(dto: boolean): ActionDropdownDto {
        if (dto) {
            return ActionDropdownDto.PUBLISHED;
        }
        return ActionDropdownDto.UNPUBLISHED;
    }
}
