import { Injectable } from '@angular/core';

import { Status } from '@presentation/pages/requests/domain/enums/all/all-status.enum';
import { ApiStatus } from '@presentation/pages/requests/infrastructure/enums/all/all-status-api.enum';

@Injectable({ providedIn: 'root' })
export class StatusMapper {
    private readonly statusMapping = {
        toApi: {
            [Status.PENDING]: ApiStatus.PENDING,
            [Status.APPROVED]: ApiStatus.APPROVED,
            [Status.REJECTED]: ApiStatus.REJECTED,
            [Status.ABANDONED]: ApiStatus.ABANDONED,
            [Status.IN_PROGRESS]: ApiStatus.IN_PROGRESS,
            [Status.TERMINATED]: ApiStatus.TERMINATED,
            [Status.CONFIRMED]: ApiStatus.CONFIRMED,
        },
        fromApi: {
            [ApiStatus.PENDING]: Status.PENDING,
            [ApiStatus.APPROVED]: Status.APPROVED,
            [ApiStatus.REJECTED]: Status.REJECTED,
            [ApiStatus.ABANDONED]: Status.ABANDONED,
            [ApiStatus.IN_PROGRESS]: Status.IN_PROGRESS,
            [ApiStatus.TERMINATED]: Status.TERMINATED,
            [ApiStatus.CONFIRMED]: Status.CONFIRMED,
        },
    };

    mapStatusToApi(status: Status): ApiStatus {
        return this.statusMapping.toApi[status];
    }

    mapApiToStatus(apiStatus: ApiStatus): Status {
        return this.statusMapping.fromApi[apiStatus];
    }
}
