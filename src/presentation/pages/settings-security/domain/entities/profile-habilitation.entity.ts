export interface ProfileHabilitation {
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly status: string;
    readonly totalUsers: number;
    readonly createdAt: string;
    readonly updated_at?: string;
}
