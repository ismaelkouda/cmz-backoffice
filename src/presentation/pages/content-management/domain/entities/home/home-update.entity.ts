import { Platform } from '@shared/domain/enums/platform.enum';

import { HomeUpdateVo } from '@presentation/pages/content-management/domain/value-objects/home/home-update.vo';

export class HomeUpdateEntity {
    constructor(
        public readonly uniqId: string,
        public readonly image: string,
        public readonly platforms: Platform[],
        public readonly startDate: string,
        public readonly endDate: string,
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
