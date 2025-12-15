import { TypeMediaDto } from '@shared/data/dtos/type-media.dto';
import { ActionDropdown } from '@shared/domain/enums/action-dropdown.enum';

export class NewsEntity {
    constructor(
        public readonly uniqId: string,
        public readonly title: string,
        public readonly resume: string,
        public readonly content: string,
        public readonly type: TypeMediaDto,
        public readonly categoryId: number,
        public readonly subCategoryId: number | null,
        public readonly hashtags: string[],
        public readonly imageFile: string,
        public readonly videoUrl: string,
        public readonly status: ActionDropdown,
        public readonly createdAt: string,
        public readonly updatedAt: string
    ) { }

    public clone(updates: Partial<NewsEntity>): NewsEntity {
        return new NewsEntity(
            updates.uniqId ?? this.uniqId,
            updates.title ?? this.title,
            updates.resume ?? this.resume,
            updates.content ?? this.content,
            updates.type ?? this.type,
            updates.categoryId ?? this.categoryId,
            updates.subCategoryId ?? this.subCategoryId,
            updates.hashtags ?? this.hashtags,
            updates.imageFile ?? this.imageFile,
            updates.videoUrl ?? this.videoUrl,
            updates.status ?? this.status,
            updates.createdAt ?? this.createdAt,
            updates.updatedAt ?? this.updatedAt
        );
    }
}
