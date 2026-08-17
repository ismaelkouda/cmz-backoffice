export class NewsCreateCommand {
    constructor(
        public readonly type: string,
        public readonly image: File | null | string,
        public readonly video: string | null,
        public readonly category: string,
        public readonly subCategory: string,
        public readonly hashtags: string[],
        public readonly title: string,
        public readonly resume: string,
        public readonly content: string
    ) {}
}
