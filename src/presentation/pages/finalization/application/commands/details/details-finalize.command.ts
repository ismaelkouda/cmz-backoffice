export class DetailsFinalizeCommand {
    constructor(
        public readonly uniqId: string,
        public readonly comment: string
    ) {}
}
