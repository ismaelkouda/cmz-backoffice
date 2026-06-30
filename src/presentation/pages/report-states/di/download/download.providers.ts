import { Provider } from '@angular/core';
import { DownloadRepository } from '@pages/report-states/domain/repositories/download/download.repository';
import { DownloadRepositoryImpl } from '@pages/report-states/infrastructure/data/repositories/download/download.repository.impl';

export const provideDownload: Provider[] = [
    {
        provide: DownloadRepository,
        useClass: DownloadRepositoryImpl,
    },
];
