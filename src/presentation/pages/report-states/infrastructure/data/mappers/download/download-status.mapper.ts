import { Injectable } from '@angular/core';
import { Status } from '@pages/report-states/domain/enums/download/download-status.enum';
import { ApiStatus } from '@pages/report-states/infrastructure/enums/download/download-status-api.enum';

@Injectable({ providedIn: 'root' })
export class StatusMapper {
    private readonly statusMapping = {
        toApi: {
            [Status.PENDING]: ApiStatus.PENDING,
            [Status.PROCESSING]: ApiStatus.PROCESSING,
            [Status.DONE]: ApiStatus.DONE,
            [Status.FAILED]: ApiStatus.FAILED,
        },
        fromApi: {
            [ApiStatus.PENDING]: Status.PENDING,
            [ApiStatus.PROCESSING]: Status.PROCESSING,
            [ApiStatus.DONE]: Status.DONE,
            [ApiStatus.FAILED]: Status.FAILED,
        },
    };

    mapStatusToApi(status: Status): ApiStatus {
        return this.statusMapping.toApi[status];
    }

    mapApiToStatus(apiStatus: ApiStatus): Status {
        return this.statusMapping.fromApi[apiStatus];
    }
}
