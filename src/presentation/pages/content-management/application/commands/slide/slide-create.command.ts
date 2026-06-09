export class SlideCreateCommand {
    constructor(
        public readonly timeDuration: number,
        public readonly order: number,
        public readonly type: string,
        public readonly image: File | null | string,
        public readonly video: string | null,
        public readonly platforms: string[],
        public readonly startDate: Date | null,
        public readonly endDate: Date | null,
        public readonly title: string,
        public readonly subtitle: string,
        public readonly content: string,
        public readonly buttonLabel?: string,
        public readonly buttonUrl?: string
    ) {}
}
