import { inject, Provider } from '@angular/core';
import { provideDetails } from '@pages/report-states/di//details/details.providers';
import { provideClose } from '@pages/report-states/di/close/close.providers';
import { provideApprove } from '@pages/report-states/di/approve/approve.providers';
import { provideEvaluate } from '@pages/report-states/di/evaluate/evaluate.providers';
import { provideReject } from '@pages/report-states/di/reject/reject.providers';
import { REPORT_STATES_BASE_URL } from '@presentation/pages/report-states/infrastructure/api/report-states.base-url';

import { EnvService } from '../../../../core/config/env.service';
import { provideDownload } from './download/download.providers';

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
    ...provideApprove,
    ...provideEvaluate,
    ...provideReject,
    ...provideClose,
    ...provideDownload,
    ...provideDetails,
];
