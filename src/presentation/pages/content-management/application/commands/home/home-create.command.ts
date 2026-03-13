import { Platform } from '@shared/domain/enums/platform.enum';

export class HomeCreateCommand {
    constructor(
        public readonly image: File | null,
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
