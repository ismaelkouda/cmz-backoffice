import { NewsCategoriesSelectItemApiDto } from '@pages/content-management/infrastructure/api/dto/news/news-categories-select-response-api.dto';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

export class NewsCategoriesSelectEntity {
    constructor(
        public readonly name: string,
        public readonly code: string,
        public readonly departments: readonly NewsCategoriesSelectEntity[]
    ) {}

    static fromDto(
        dto: NewsCategoriesSelectItemApiDto
    ): NewsCategoriesSelectEntity {
        return new NewsCategoriesSelectEntity(
            dto.name,
            dto.code,
            dto.departments.map(NewsCategoriesSelectEntity.fromDto)
        );
    }

    public with(
        dto: NewsCategoriesSelectItemApiDto
    ): NewsCategoriesSelectEntity {
        const departments = MapperUtils.mergeImmutable(
            this.departments,
            dto.departments,
            (d) => d.code,
            (entity, dto) => entity.with(dto),
            NewsCategoriesSelectEntity.fromDto
        );

        if (
            this.name === dto.name &&
            this.code === dto.code &&
            departments === this.departments
        ) {
            return this;
        }

        return new NewsCategoriesSelectEntity(dto.name, dto.code, departments);
    }
}
