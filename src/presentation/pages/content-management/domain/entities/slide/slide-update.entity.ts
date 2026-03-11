import { SlideUpdateVo } from '@pages/content-management/domain/value-objects/slide/slide-update.vo';
import { Platform } from '@shared/domain/enums/platform.enum';

export class SlideUpdateEntity {
    constructor(
        public readonly uniqId: string,
        public readonly timeDuration: string,
        public readonly type: string,
        public readonly image: string,
        public readonly video: string,
        public readonly platforms: Platform[],
        public readonly startDate: string,
        public readonly endDate: string,
        public readonly title: string,
        public readonly subtitle: string,
        public readonly content: string,
        public readonly buttonLabel?: string,
        public readonly buttonUrl?: string
    ) {}
    static fromVo(vo: SlideUpdateVo): SlideUpdateEntity {
        return new SlideUpdateEntity(
            vo.uniqId,
            vo.timeDuration,
            vo.type,
            vo.image,
            vo.video,
            vo.platforms,
            vo.startDate,
            vo.endDate,
            vo.title,
            vo.subtitle,
            vo.content,
            vo.buttonLabel,
            vo.buttonUrl
        );
    }
}
