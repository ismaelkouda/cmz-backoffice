import { Injectable } from '@angular/core';

import { Status } from '@presentation/pages/team-organization/domain/enums/teams/teams-status.enum';

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
