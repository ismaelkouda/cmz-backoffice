export class HomeCreateCommand {
    constructor(
        public readonly image: File | null | string,
        public readonly platforms: string[],
        public readonly startDate: Date | null,
        public readonly endDate: Date | null,
        public readonly title: string,
        public readonly resume: string,
        public readonly content: string,
        public readonly buttonLabel?: string,
        public readonly buttonUrl?: string
    ) {}
}
