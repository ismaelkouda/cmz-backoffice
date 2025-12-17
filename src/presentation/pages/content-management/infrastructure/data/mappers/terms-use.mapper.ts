import { inject, Injectable } from '@angular/core';
import { TermsUseItemDto } from '@presentation/pages/content-management/core/application/dtos/terms-use/terms-use-response.dto';
import { TermsUseEntity } from '@presentation/pages/content-management/core/domain/entities/terms-use.entity';
import { ActionDropdownDto } from '@shared/data/dtos/action-dropdown.dto';
import { ActionDropdownMapper } from '@shared/data/mappers/action-dropdown.mapper';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';

@Injectable({
    providedIn: 'root',
})
export class TermsUseMapper extends PaginatedMapper<TermsUseEntity, TermsUseItemDto> {

    private readonly actionDropdownMapper: ActionDropdownMapper = inject(ActionDropdownMapper)

    public toEntity(dto: TermsUseItemDto): TermsUseEntity {
        return this.mapItemFromDto(dto);
    }
    public override mapItemFromDto(dto: TermsUseItemDto): TermsUseEntity {
        const mappedActionDropdown = this.actionDropdownMapper.mapFromDto(this.mapActionDropdown(dto.is_published));
        return new TermsUseEntity(
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
