export class DetailsApproveCommand {
    constructor(
        public readonly uniqId: string,
        public readonly comment: string
    ) {}
}
