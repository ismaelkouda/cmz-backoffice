import { Injectable } from '@angular/core';
import { Status } from '@pages/team-organization/domain/enums/teams/teams-status.enum';

@Injectable({ providedIn: 'root' })
export class StatusMapper {
    readonly statusMapping = {
        toApi: {
            [Status.ACTIVE]: true,
            [Status.INACTIVE]: false,
        } as const,
    };

    mapStatusToApi(status: Status): boolean {
        return this.statusMapping.toApi[status];
    }

    mapApiToStatus(apiStatus: boolean): Status {
        return apiStatus ? Status.ACTIVE : Status.INACTIVE;
    }
}
