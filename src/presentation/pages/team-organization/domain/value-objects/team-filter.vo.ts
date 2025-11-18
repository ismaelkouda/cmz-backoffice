export interface TeamFilterInterface {
    code_nom?: string;
    participant_id?: string;
    nom_tenant?: string;
    statut?: string;
}

export class TeamFilter {
    private constructor(
        private readonly code_nom: string,
        private readonly participant_id: string,
        private readonly nom_tenant: string,
        private readonly statut: string
    ) {}

    static create(data: TeamFilterInterface = {}): TeamFilter {
        return new TeamFilter(
            data.code_nom ?? '',
            data.participant_id ?? '',
            data.nom_tenant ?? '',
            data.statut ?? ''
        );
    }

    toDto(): Record<string, string> {
        const dto: Record<string, string> = {};

        if (this.code_nom) {
            dto['code_nom'] = this.code_nom;
        }
        if (this.participant_id) {
            dto['participant_id'] = this.participant_id;
        }
        if (this.nom_tenant) {
            dto['nom_tenant'] = this.nom_tenant;
        }
        if (this.statut) {
            dto['statut'] = this.statut;
        }

        return dto;
    }
}

