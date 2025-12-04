export enum ProfileStatus {
    ACTIVE = 'actif',
    INACTIVE = 'inactif',
}

interface ProfileHabilitation {
    readonly id: string;
    readonly matricule: string;
    readonly lastName: string;
    readonly firstName: string;
    readonly email: string;
    readonly uniqId: string;
    readonly profile: string;
    readonly status: ProfileStatus;
    readonly created_at: string;
    readonly updated_at?: string;
}


export class ProfileHabilitationEntity implements ProfileHabilitation {
    constructor(
        public readonly id: string,
        public readonly matricule: string,
        public readonly lastName: string,
        public readonly firstName: string,
        public readonly email: string,
        public readonly uniqId: string,
        public readonly profile: string,
        public readonly status: ProfileStatus,
        public readonly created_at: string,
        public readonly updated_at?: string
    ) { }

    public get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }
}
