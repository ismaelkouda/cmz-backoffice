interface Users {
    readonly id: string;
    readonly matricule: string;
    readonly lastName: string;
    readonly firstName: string;
    readonly email: string;
    readonly uniqId: string;
    readonly profile: string;
    readonly status: string;
    readonly created_at: string;
    readonly updated_at?: string;
}


export class UsersEntity implements Users {
    constructor(
        public readonly id: string,
        public readonly matricule: string,
        public readonly lastName: string,
        public readonly firstName: string,
        public readonly email: string,
        public readonly uniqId: string,
        public readonly profile: string,
        public readonly status: string,
        public readonly created_at: string,
        public readonly updated_at?: string
    ) { }

    public get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }
}
