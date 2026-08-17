import { Injectable } from '@angular/core';
import { Status } from '@pages/administrative-boundary/domain/enums/regions/regions-status.enum';

@Injectable({ providedIn: 'root' })
export class StatusMapper {
    private readonly statusMapping = {
        toApi: {
            [Status.ACTIVE]: true,
            [Status.INACTIVE]: false,
        },
    };

    mapStatusToApi(status: Status): boolean {
        return this.statusMapping.toApi[status];
    }

    mapApiToStatus(apiStatus: boolean): Status {
        return apiStatus ? Status.ACTIVE : Status.INACTIVE;
    }
}
