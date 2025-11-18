import { Injectable } from '@angular/core';
import { AuthVariables } from '@pages/authentication/domain/entities/auth-variables.entity';
import { VariablesResponseDto } from '@pages/authentication/data/dtos/variables-response.dto';
@Injectable({ providedIn: 'root' })
export class AuthVariablesMapper {
    mapFromDto(dto: VariablesResponseDto): AuthVariables {
        if (dto.error || !dto.data) {
            throw new Error(
                dto.message ||
                    'AUTHENTICATION.MESSAGES.ERROR.UNABLE_TO_LOAD_CONFIG'
            );
        }

        const {
            suffixeEmail,
            dashboardDossiers,
            dashboardDemandes,
            dashboardGrafana,
            dashboardGrafanaSms,
            dashboardAppro,
            dashboardApproSms,
            analyseAlarmeGenerees,
            analyseAlarmeGenereesSms,
            analyseAlarmeMajeures,
            analyseAlarmeMajeuresSms,
            analyseAlarmeCritiques,
            analyseAlarmeCritiquesSms,
            analyseAlarmeMineures,
            analyseAlarmeMineuresSms,
            analyseAlarmeNormales,
            analyseAlarmeNormalesSms,
            detectionMouvement,
            urlOcr,
            minio,
            webhookUrl,
            modules,
        } = dto.data;

        return {
            suffixEmail: suffixeEmail,
            dashboardDossiers,
            dashboardDemandes,
            dashboardGrafana,
            dashboardGrafanaSms,
            dashboardAppro,
            dashboardApproSms,
            analyseAlarmeGenerees,
            analyseAlarmeGenereesSms,
            analyseAlarmeMajeures,
            analyseAlarmeMajeuresSms,
            analyseAlarmeCritiques,
            analyseAlarmeCritiquesSms,
            analyseAlarmeMineures,
            analyseAlarmeMineuresSms,
            analyseAlarmeNormales,
            analyseAlarmeNormalesSms,
            detectionMouvement,
            urlOcr,
            minio,
            webhookUrl,
            modules,
        };
    }
}
