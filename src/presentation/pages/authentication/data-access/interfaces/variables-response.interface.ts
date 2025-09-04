interface AppConfig {
    suffixeEmail: string;
    dashboardDossiers: string;
    dashboardDemandes: string;
    dashboardGrafana: string;
    dashboardGrafanaSms: string;
    dashboardAppro: string;
    dashboardApproSms: string;
    analyseAlarmeGenerees: string;
    analyseAlarmeGenereesSms: string;
    analyseAlarmeMajeures: string;
    analyseAlarmeMajeuresSms: string;
    analyseAlarmeCritiques: string;
    analyseAlarmeCritiquesSms: string;
    analyseAlarmeMineures: string;
    analyseAlarmeMineuresSms: string;
    analyseAlarmeNormales: string;
    analyseAlarmeNormalesSms: string;
    detectionMouvement: string;
    urlOcr: string | null;
    minio: string;
    webhookUrl: string;
    modules: string[];
}

export interface VariablesResponseInterface {
    data: AppConfig;
    error: boolean;
    message: string;
}
