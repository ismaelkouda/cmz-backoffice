import { SlideCreateVo } from '@pages/content-management/domain/value-objects/slide/slide-create.vo';
import { Platform } from '@shared/domain/enums/platform.enum';

export class SlideCreateEntity {
    constructor(
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

    static fromVo(vo: SlideCreateVo): SlideCreateEntity {
        return new SlideCreateEntity(
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
