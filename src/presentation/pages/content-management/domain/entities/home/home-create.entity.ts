import { HomeCreateVo } from '@pages/content-management/domain/value-objects/home/home-create.vo';
import { Platform } from '@shared/domain/enums/platform.enum';

export class HomeCreateEntity {
    constructor(
        public readonly image: File | null | string,
        public readonly platforms: Platform[],
        public readonly startDate: Date | null,
        public readonly endDate: Date | null,
        public readonly title: string,
        public readonly resume: string,
        public readonly content: string,
        public readonly buttonLabel?: string,
        public readonly buttonUrl?: string
    ) {}

    static fromVo(vo: HomeCreateVo): HomeCreateEntity {
        return new HomeCreateEntity(
            vo.image,
            vo.platforms,
            vo.startDate,
            vo.endDate,
            vo.title,
            vo.resume,
            vo.content,
            vo.buttonLabel,
            vo.buttonUrl
        );
    }
}
