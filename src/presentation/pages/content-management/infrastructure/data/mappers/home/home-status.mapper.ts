import { Injectable } from '@angular/core';
import { Status } from '@pages/content-management/domain/enums/home/home-status.enum';

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
