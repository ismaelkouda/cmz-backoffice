import { inject, Injectable } from '@angular/core';
import { GetNewsByIdItemDto, GetNewsByIdResponseDto } from '@presentation/pages/content-management/core/application/dtos/news/get-news-by-id-response.dto';
import { GetNewsByIdEntity } from '@presentation/pages/content-management/core/domain/entities/get-news-by-id.entity';
import { ActionDropdownDto } from '@shared/data/dtos/action-dropdown.dto';
import { ActionDropdownMapper } from '@shared/data/mappers/action-dropdown.mapper';
import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';

@Injectable({
    providedIn: 'root',
})
export class GetNewsByIdMapper extends SimpleResponseMapper<GetNewsByIdEntity, GetNewsByIdItemDto> {

    private readonly actionDropdownMapper: ActionDropdownMapper = inject(ActionDropdownMapper)
    public toEntity(dto: GetNewsByIdResponseDto): GetNewsByIdEntity {
        return this.mapItemFromDto(dto.data);
    }
    public mapItemFromDto(dto: GetNewsByIdItemDto): GetNewsByIdEntity {
        console.log(dto);
        const mappedActionDropdown = this.actionDropdownMapper.mapFromDto(this.mapActionDropdown(dto.is_published));
        return new GetNewsByIdEntity(
            dto.title,
            dto.resume,
            dto.content,
            dto.type,
            dto.category.id,
            dto.sub_category?.id,
            dto.hashtags,
            dto.image_url,
            dto.video_url,
            mappedActionDropdown,
        );
    }

    private mapActionDropdown(dto: boolean): ActionDropdownDto {
        if (dto) {
            return ActionDropdownDto.ACTIVE;
        }
        return ActionDropdownDto.INACTIVE;
    }
}
