import { Injectable } from '@angular/core';
import { Status } from '@pages/content-management/domain/enums/news/news-status.enum';

@Injectable({ providedIn: 'root' })
export class StatusMapper {
    mapFromDto(dto: boolean): Status {
        return dto ? Status.PUBLISH : Status.UNPUBLISH;
    }
    mapToDto(value: Status): boolean {
        const methodMap: Record<Status, boolean> = {
            [Status.PUBLISH]: true,
            [Status.UNPUBLISH]: false,
        };
        return methodMap[value];
    }
}
