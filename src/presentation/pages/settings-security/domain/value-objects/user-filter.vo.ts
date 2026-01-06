import { UsersFilterPayloadEntity } from '../entities/users/users-filter-payload.entity';

export class UserFilter {
    private constructor(
        private readonly profilUser?: string,
        private readonly status?: string,
        private readonly matricule?: string,
        private readonly search?: string
    ) {}

    static create(
        data: UsersFilterPayloadEntity = {} as UsersFilterPayloadEntity
    ): UserFilter {
        return new UserFilter(
            data.userProfile,
            data.status,
            data.matricule,
            data.fullName
        );
    }

    toDto(): Record<string, string> {
        const params: Record<string, string> = {};

        if (this.profilUser) {
            params['user_profile'] = this.profilUser;
        }

        if (this.status) {
            params['status'] = this.status;
        }

        if (this.matricule) {
            params['matricule'] = this.matricule;
        }

        if (this.search) {
            params['search'] = this.search;
        }

        return params;
    }
}
