import { inject, Injectable } from '@angular/core';
import { PrivacyPolicyItemDto } from '@presentation/pages/content-management/core/application/dtos/privacy-policy/privacy-policy-response.dto';
import { PrivacyPolicyEntity } from '@presentation/pages/content-management/core/domain/entities/privacy-policy.entity';
import { ActionDropdownDto } from '@shared/data/dtos/action-dropdown.dto';
import { ActionDropdownMapper } from '@shared/data/mappers/action-dropdown.mapper';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';

@Injectable({
    providedIn: 'root',
})
export class PrivacyPolicyMapper extends PaginatedMapper<PrivacyPolicyEntity, PrivacyPolicyItemDto> {

    private readonly actionDropdownMapper: ActionDropdownMapper = inject(ActionDropdownMapper)

    public toEntity(dto: PrivacyPolicyItemDto): PrivacyPolicyEntity {
        return this.mapItemFromDto(dto);
    }

    public override mapItemFromDto(dto: PrivacyPolicyItemDto): PrivacyPolicyEntity {
        const mappedActionDropdown = this.actionDropdownMapper.mapFromDto(this.mapActionDropdown(dto.is_published));
        return new PrivacyPolicyEntity(
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
