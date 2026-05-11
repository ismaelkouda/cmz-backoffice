export class DetailsRejectCommand {
    constructor(
        public readonly uniqId: string,
        public readonly comment: string,
        public readonly reason: string,
        public readonly callbackType: string
    ) {}
}
