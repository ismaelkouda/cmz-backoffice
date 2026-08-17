import { Provider } from '@angular/core';
import { provideDetails } from '@pages/report-states/di//details/details.providers';
import { provideClose } from '@pages/report-states/di/close/close.providers';
import { provideApprove } from '@pages/report-states/di/approve/approve.providers';
import { provideEvaluate } from '@pages/report-states/di/evaluate/evaluate.providers';
import { provideReject } from '@pages/report-states/di/reject/reject.providers';
import { provideDownload } from '@pages/report-states/di/download/download.providers';

export const provideReportStates = (): Provider[] => [
    ...provideApprove,
    ...provideEvaluate,
    ...provideReject,
    ...provideClose,
    ...provideDownload,
    ...provideDetails,
];
