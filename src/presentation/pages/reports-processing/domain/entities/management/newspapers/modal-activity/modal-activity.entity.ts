export interface ModalActivity {
    readonly id: string;
    readonly uniqId: string;
    readonly initiatedBy: string;
    readonly type: string;
    readonly description: string;
    readonly date: string;
    readonly createdAt: string;
    readonly updatedAt: string;
}

export class ModalActivityEntity implements ModalActivity {
    constructor(
        public readonly id: string,
        public readonly uniqId: string,
        public readonly initiatedBy: string,
        public readonly type: string,
        public readonly description: string,
        public readonly date: string,
        public readonly createdAt: string,
        public readonly updatedAt: string
    ) {}
}
