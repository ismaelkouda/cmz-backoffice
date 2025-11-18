export class UserFilter {
    private constructor(
        private readonly profilUser?: string,
        private readonly state?: string,
        private readonly matricule?: string,
        private readonly search?: string
    ) {}

    static create(data: {
        user_profile?: string;
        state?: string;
        matricule?: string;
        search?: string;
    }): UserFilter {
        return new UserFilter(
            data.user_profile,
            data.state,
            data.matricule,
            data.search
        );
    }

    toDto(): Record<string, string> {
        const params: Record<string, string> = {};

        if (this.profilUser) {
            params['user_profile'] = this.profilUser;
        }

        if (this.state) {
            params['state'] = this.state;
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
