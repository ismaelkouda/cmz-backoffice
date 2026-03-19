import { HomeUpdateVo } from '@pages/content-management/domain/value-objects/home/home-update.vo';
import { Platform } from '@shared/domain/enums/platform.enum';

export class HomeUpdateEntity {
    constructor(
        public readonly uniqId: string,
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
    static fromVo(vo: HomeUpdateVo): HomeUpdateEntity {
        return new HomeUpdateEntity(
            vo.uniqId,
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
