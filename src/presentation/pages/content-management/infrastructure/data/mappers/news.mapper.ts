import { inject, Injectable } from '@angular/core';
import { NewsItemDto } from '@presentation/pages/content-management/core/application/dtos/news/news-response.dto';
import { NewsEntity } from '@presentation/pages/content-management/core/domain/entities/news.entity';
import { ActionDropdownDto } from '@shared/data/dtos/action-dropdown.dto';
import { ActionDropdownMapper } from '@shared/data/mappers/action-dropdown.mapper';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';

@Injectable({ providedIn: 'root' })
export class NewsMapper extends PaginatedMapper<NewsEntity, NewsItemDto> {
    private readonly actionDropdownMapper: ActionDropdownMapper =
        inject(ActionDropdownMapper);

    public toEntity(dto: NewsItemDto): NewsEntity {
        return this.mapItemFromDto(dto);
    }

    protected override mapItemFromDto(dto: NewsItemDto): NewsEntity {
        const mappedActionDropdown = this.actionDropdownMapper.mapFromDto(
            this.mapActionDropdown(dto.is_published)
        );
        return new NewsEntity(
            dto.id,
            dto.slug,
            dto.title,
            dto.resume,
            dto.content,
            dto.type,
            dto.category_id,
            dto.sub_category_id,
            dto.hashtags,
            dto.image_file,
            dto.video_url,
            mappedActionDropdown,
            dto.created_at,
            dto.updated_at
        );
    }

    private mapActionDropdown(dto: boolean): ActionDropdownDto {
        if (dto) {
            return ActionDropdownDto.PUBLISHED;
        }
        return ActionDropdownDto.UNPUBLISHED;
    }
}
