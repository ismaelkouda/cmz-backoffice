export interface ProfileHabilitationFilterInterface {
    profile?: string;
    state?: string;
    matricule?: string;
    search?: string;
}

export class ProfileHabilitationFilter {
    private constructor(
        private readonly profile?: string,
        private readonly state?: string,
        private readonly matricule?: string,
        private readonly search?: string // pour recherche par nom et prénoms
    ) { }

    static create(
        data: ProfileHabilitationFilterInterface = {}
    ): ProfileHabilitationFilter {
        return new ProfileHabilitationFilter(
            data?.profile,
            data?.state,
            data?.matricule,
            data?.search
        );
    }

    toDto(): Record<string, string> {
        const params: Record<string, string> = {};

        if (this.profile) {
            params['profile'] = this.profile;
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