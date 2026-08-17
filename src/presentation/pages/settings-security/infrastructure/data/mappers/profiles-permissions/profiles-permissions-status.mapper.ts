import { Injectable } from '@angular/core';
import { Status } from '@pages/settings-security/domain/enums/profiles-permissions/profiles-permissions-status.enum';

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
