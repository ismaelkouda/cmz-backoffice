export class MessagingUpdateCommand {
    constructor(
        public readonly uniqId: string,
        public readonly type: string,
        public readonly targetType: string,
        public readonly region: string,
        public readonly department: string,
        public readonly municipality: string,
        public readonly channels: string[],
        public readonly subject: string,
        public readonly content: string,
        public readonly message: string
    ) {}
}
