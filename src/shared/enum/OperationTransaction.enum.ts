export enum OperationTransaction {
    RESILIATION = 'resiliation',
    SUSPENSION = 'suspension',
    SWAP = 'swap',
    ACTIVATION = 'activation',
    INTEGRATION = 'integration',
    SIM_BLANCHE = "sim-blanche",
    ACTIVATION_EN_MASSE = 'activation-en-masse',
    INTEGRATION_EN_MASSE = 'integration-en-masse',
    SIM_BLANCHE_EN_MASSE = 'sim-blanche-en-masse',
    VOLUME_DATA = 'volume-data',
    PROVISIONNING = 'provisionning',
    ACHAT_SERVICE = 'achat-service',
    CHANGEMENT_FORMULE = 'chg-formule-sim',
    IDENTIFICATION = 'identification',
    SOLDE_DATA = 'solde-data',
    SOLDE_SMS = 'solde-sms',
}   

export type T_OPERATION = typeof OperationTransaction[keyof typeof OperationTransaction];

export class TitleOperation {
    private operation: OperationTransaction | undefined;
    
    setTitleForm(operation: OperationTransaction): void {
        this.operation = operation;
    }
    
    get getTitleForm(): string {
        const operationTitles: Record<OperationTransaction, string> = {
            [OperationTransaction.ACTIVATION]: "Abonnement Mobile",
            [OperationTransaction.INTEGRATION]: "Integration Mobile",
            [OperationTransaction.RESILIATION]: "Résiliation",
            [OperationTransaction.SUSPENSION]: "Suspension",
            [OperationTransaction.SWAP]: "Échange de SIM",
            [OperationTransaction.ACTIVATION_EN_MASSE]: "Activation en Masse",
            [OperationTransaction.INTEGRATION_EN_MASSE]: "Intégration en Masse",
            [OperationTransaction.SIM_BLANCHE_EN_MASSE]: "SIM blanche en Masse",
            [OperationTransaction.VOLUME_DATA]: "Volume Data",
            [OperationTransaction.PROVISIONNING]: "Provisionning",
            [OperationTransaction.ACHAT_SERVICE]: "Achat de Service",
            [OperationTransaction.CHANGEMENT_FORMULE]: "Changement de Formule SIM",
            [OperationTransaction.IDENTIFICATION]: "Identification",
            [OperationTransaction.SIM_BLANCHE]: "SIM blanche",
            [OperationTransaction.SOLDE_DATA]: "solde-data",
            [OperationTransaction.SOLDE_SMS]: "solde-sms",
        };

        return this.operation ? operationTitles[this.operation] || "Opération non spécifiée" : "Aucune opération définie";
    }
}
