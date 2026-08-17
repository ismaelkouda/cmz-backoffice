export class SlideCreateCommand {
    constructor(
        public readonly timeDuration: number,
        public readonly type: string,
        public readonly image: File | null | string,
        public readonly video: string | null,
        public readonly platforms: string[],
        public readonly startDate: string,
        public readonly endDate: string,
        public readonly title: string,
        public readonly subtitle: string,
        public readonly content: string,
        public readonly buttonLabel?: string,
        public readonly buttonUrl?: string
    ) {}
}
