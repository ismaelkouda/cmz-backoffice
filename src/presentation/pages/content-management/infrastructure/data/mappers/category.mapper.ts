import { Injectable } from '@angular/core';
import {
    CategoryItemDto,
    SubCategoryItemDto,
} from '@presentation/pages/content-management/core/application/dtos/news/category-response.dto';
import { CategoryEntity } from '@presentation/pages/content-management/core/domain/entities/category.entity';
import { SubCategoryEntity } from '@presentation/pages/content-management/core/domain/entities/sub-category.entity';
import { ArrayResponseMapper } from '@shared/data/mappers/base/array-response.mapper';

@Injectable({ providedIn: 'root' })
export class CategoryMapper extends ArrayResponseMapper<
    CategoryEntity,
    CategoryItemDto
> {
    public mapCategoriesFromApiResponse(apiResponse: {
        error: boolean;
        message: string;
        data: CategoryItemDto[];
    }): CategoryEntity[] {
        return super.mapFromDto(apiResponse);
    }

    protected override mapItemFromDto(dto: CategoryItemDto): CategoryEntity {
        const subCategories = this.mapSubCategoriesFromDto(dto.sub_categories);

        return new CategoryEntity(
            dto.id,
            dto.name,
            dto.icon,
            dto.color,
            dto.background_color,
            dto.description,
            subCategories
        );
    }

    private mapSubCategoriesFromDto(
        subCategoriesDto: SubCategoryItemDto[]
    ): SubCategoryEntity[] {
        return subCategoriesDto.map(
            (subDto) =>
                new SubCategoryEntity(
                    subDto.id,
                    subDto.name,
                    subDto.icon,
                    subDto.color,
                    subDto.background_color,
                    subDto.description
                )
        );
    }

    public formatCategoriesForSelect(
        categories: CategoryEntity[]
    ): Array<{ label: string; value: number }> {
        return categories.map((category) => ({
            label: category.name,
            value: category.id,
        }));
    }
}
