import { Injectable } from '@angular/core';
import { Status } from '@pages/team-organization/domain/enums/teams/teams-status.enum';

@Injectable({ providedIn: 'root' })
export class StatusMapper {
    mapFromDto(dto: boolean): Status {
        return dto ? Status.ACTIVE : Status.INACTIVE;
    }
    mapToDto(value: Status): boolean {
        const methodMap: Record<Status, boolean> = {
            [Status.ACTIVE]: true,
            [Status.INACTIVE]: false,
        };
        return methodMap[value];
    }
}
