import { Platform } from '@shared/domain/enums/platform.enum';

export class SlideCreateCommand {
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
}
