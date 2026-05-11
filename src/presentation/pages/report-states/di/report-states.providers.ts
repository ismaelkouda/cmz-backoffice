import { inject, Provider } from '@angular/core';
import { provideDetails } from '@pages/report-states/di//details/details.providers';
import { provideClose } from '@pages/report-states/di/close/close.providers';
import { provideEvaluate } from '@pages/report-states/di/evaluate/evaluate.providers';
import { provideReject } from '@pages/report-states/di/reject/reject.providers';
import { REPORT_STATES_BASE_URL } from '@presentation/pages/report-states/infrastructure/api/report-states.base-url';

import { EnvService } from '../../../../core/config/env.service';

const getApiBaseUrl = () => {
    const baseUrl = inject(EnvService).reportUrl;

    if (!baseUrl) {
        console.warn(
            'report-states Module: API Base URL is missing in environment configuration.'
        );
    }

    return baseUrl;
};

export const provideReportStates = (): Provider[] => [
    {
        provide: REPORT_STATES_BASE_URL,
        useFactory: getApiBaseUrl,
    },
    ...provideEvaluate,
    ...provideReject,
    ...provideClose,
    ...provideDetails,
];
