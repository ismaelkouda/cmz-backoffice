interface AuthenticationVariablesDto {
    readonly suffixeEmail: string;
    readonly dashboardDossiers: string;
    readonly dashboardDemandes: string;
    readonly dashboardGrafana: string;
    readonly dashboardGrafanaSms: string;
    readonly dashboardAppro: string;
    readonly dashboardApproSms: string;
    readonly analyseAlarmeGenerees: string;
    readonly analyseAlarmeGenereesSms: string;
    readonly analyseAlarmeMajeures: string;
    readonly analyseAlarmeMajeuresSms: string;
    readonly analyseAlarmeCritiques: string;
    readonly analyseAlarmeCritiquesSms: string;
    readonly analyseAlarmeMineures: string;
    readonly analyseAlarmeMineuresSms: string;
    readonly analyseAlarmeNormales: string;
    readonly analyseAlarmeNormalesSms: string;
    readonly detectionMouvement: string;
    readonly urlOcr: string | null;
    readonly minio: string;
    readonly webhookUrl: string;
    readonly modules: string[];
}

export interface VariablesResponseDto {
    readonly data: AuthenticationVariablesDto | null;
    readonly error: boolean;
    readonly message: string;
}
