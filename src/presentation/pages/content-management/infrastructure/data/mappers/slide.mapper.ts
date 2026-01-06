import { inject, Injectable } from '@angular/core';
import { SlideItemDto } from '@presentation/pages/content-management/core/application/dtos/slide/slide-response.dto';
import { SlideEntity } from '@presentation/pages/content-management/core/domain/entities/slide.entity';
import { ActionDropdownDto } from '@shared/data/dtos/action-dropdown.dto';
import { ActionDropdownMapper } from '@shared/data/mappers/action-dropdown.mapper';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';

@Injectable({ providedIn: 'root' })
export class SlideMapper extends PaginatedMapper<SlideEntity, SlideItemDto> {
    private readonly actionDropdownMapper: ActionDropdownMapper =
        inject(ActionDropdownMapper);

    public toEntity(dto: SlideItemDto): SlideEntity {
        return this.mapItemFromDto(dto);
    }

    protected override mapItemFromDto(dto: SlideItemDto): SlideEntity {
        const mappedActionDropdown = this.actionDropdownMapper.mapFromDto(
            this.mapActionDropdown(dto.is_active)
        );
        return new SlideEntity(
            dto.id,
            dto.title,
            dto.subtitle,
            dto.content,
            dto.type,
            dto.platforms,
            dto.image_file,
            dto.image_url,
            dto.video_url,
            dto.button_label,
            dto.button_url,
            dto.order,
            dto.time_duration_in_seconds,
            mappedActionDropdown,
            dto.start_date,
            dto.end_date,
            dto.created_at,
            dto.updated_at
        );
    }

    private mapActionDropdown(dto: boolean): ActionDropdownDto {
        if (dto) {
            return ActionDropdownDto.ACTIVE;
        }
        return ActionDropdownDto.INACTIVE;
    }
}
