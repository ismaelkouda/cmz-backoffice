import { Platform } from '@shared/domain/enums/platform.enum';

export class HomeUpdateCommand {
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
}
