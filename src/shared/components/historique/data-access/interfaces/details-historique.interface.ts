export interface DetailsHistoryData {
    module: string;
    initiePar: DetailsHistoryInitiator;
    adresseIP: string;
    agentUtilise: string;
    typeAction: string;
    action: string;
    data: DetailsHistoryDataChange[];
    createdAt: string;
}

export interface DetailsHistoryInitiator {
    matricule: string;
    nom: string;
    prenoms: string;
}

export interface DetailsHistoryDataChange {
    key: string;
    previousValue?: string | null;
    currentValue?: string | null;
    value?: string | null;
}
