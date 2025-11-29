export interface AgentFilterInterface {
    code_nom?: string;
    statut?: string;
}

export class AgentFilter {
    private constructor(
        private readonly code_nom: string,
        private readonly statut: string
    ) {}

    static create(data: AgentFilterInterface = {}): AgentFilter {
        return new AgentFilter(data.code_nom ?? '', data.statut ?? '');
    }

    toDto(): Record<string, string> {
        const dto: Record<string, string> = {};

        if (this.code_nom) {
            dto['code_nom'] = this.code_nom;
        }
        if (this.statut) {
            dto['statut'] = this.statut;
        }

        return dto;
    }
}
