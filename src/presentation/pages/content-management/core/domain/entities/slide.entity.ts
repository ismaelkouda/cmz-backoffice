import { ReportSourceDto } from '@shared/data/dtos/report-source.dto';
import { TypeMediaDto } from '@shared/data/dtos/type-media.dto';
import { ActionDropdown } from '@shared/domain/enums/action-dropdown.enum';

export class SlideEntity {
    constructor(
        public readonly uniqId: string,
        public readonly title: string,
        public readonly subtitle: string,
        public readonly content: string,
        public readonly type: TypeMediaDto,
        public readonly platforms: ReportSourceDto[],
        public readonly imageFile: string,
        public readonly imageUrl: string,
        public readonly videoUrl: string,
        public readonly buttonLabel: string,
        public readonly buttonUrl: string,
        public readonly order: number,
        public readonly timeDurationInSeconds: number,
        public readonly status: ActionDropdown,
        public readonly startDate: string,
        public readonly endDate: string,
        public readonly createdAt: string,
        public readonly updatedAt: string
    ) { }

    public clone(updates: Partial<SlideEntity>): SlideEntity {
        return new SlideEntity(
            updates.uniqId ?? this.uniqId,
            updates.title ?? this.title,
            updates.subtitle ?? this.subtitle,
            updates.content ?? this.content,
            updates.type ?? this.type,
            updates.platforms ?? this.platforms,
            updates.imageFile ?? this.imageFile,
            updates.imageUrl ?? this.imageUrl,
            updates.videoUrl ?? this.videoUrl,
            updates.buttonLabel ?? this.buttonLabel,
            updates.buttonUrl ?? this.buttonUrl,
            updates.order ?? this.order,
            updates.timeDurationInSeconds ?? this.timeDurationInSeconds,
            updates.status ?? this.status,
            updates.startDate ?? this.startDate,
            updates.endDate ?? this.endDate,
            updates.createdAt ?? this.createdAt,
            updates.updatedAt ?? this.updatedAt
        );
    }
}
