export interface ParticipantFilterInterface {
    matricule?: string;
    nom_prenoms?: string;
    role?: string;
    statut?: string;
    team_id?: string;
}

export class ParticipantFilter {
    private constructor(
        private readonly matricule: string,
        private readonly nom_prenoms: string,
        private readonly role: string,
        private readonly statut: string,
        private readonly team_id: string
    ) {}

    static create(data: ParticipantFilterInterface = {}): ParticipantFilter {
        return new ParticipantFilter(
            data.matricule ?? '',
            data.nom_prenoms ?? '',
            data.role ?? '',
            data.statut ?? '',
            data.team_id ?? ''
        );
    }

    toDto(): Record<string, string> {
        const dto: Record<string, string> = {};

        if (this.matricule) {
            dto['matricule'] = this.matricule;
        }
        if (this.nom_prenoms) {
            dto['nom_prenoms'] = this.nom_prenoms;
        }
        if (this.role) {
            dto['role'] = this.role;
        }
        if (this.statut) {
            dto['statut'] = this.statut;
        }
        if (this.team_id) {
            dto['equipe_id'] = this.team_id;
        }

        return dto;
    }
}

