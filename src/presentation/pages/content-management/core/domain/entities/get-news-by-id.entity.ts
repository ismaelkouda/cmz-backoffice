import { TypeMediaDto } from '@shared/data/dtos/type-media.dto';
import { ActionDropdown } from '@shared/domain/enums/action-dropdown.enum';

export class GetNewsByIdEntity {
    constructor(
        public readonly title: string,
        public readonly resume: string,
        public readonly content: string,
        public readonly type: TypeMediaDto,
        public readonly categoryId: number,
        public readonly subCategoryId: number | undefined,
        public readonly hashtags: string[],
        public readonly imageFile: string | null,
        public readonly videoUrl: string | null,
        public readonly status: ActionDropdown
    ) {}

    public clone(updates: Partial<GetNewsByIdEntity>): GetNewsByIdEntity {
        return new GetNewsByIdEntity(
            updates.title ?? this.title,
            updates.resume ?? this.resume,
            updates.content ?? this.content,
            updates.type ?? this.type,
            updates.categoryId ?? this.categoryId,
            updates.subCategoryId ?? this.subCategoryId,
            updates.hashtags ?? this.hashtags,
            updates.imageFile ?? this.imageFile,
            updates.videoUrl ?? this.videoUrl,
            updates.status ?? this.status
        );
    }
}
