export class HistoryFindOneFilterCommand {
    constructor(
        public readonly uniqId: string,
        public readonly typeModel: string
    ) {}
}
