export class AccessLogsEntity {
    constructor(
        public readonly id: string,
        public readonly createdAt: string,
        public readonly event: string,
        public readonly action: string,
        public readonly ip: string,
        public readonly username: string,
        public readonly data: any
    ) {}
}
