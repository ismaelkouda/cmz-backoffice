import { Platform } from '@shared/domain/enums/platform.enum';

export class SlideUpdateCommand {
    constructor(
        public readonly uniqId: string,
        public readonly timeDuration: number,
        public readonly type: string,
        public readonly image: File | null,
        public readonly video: string | null,
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
