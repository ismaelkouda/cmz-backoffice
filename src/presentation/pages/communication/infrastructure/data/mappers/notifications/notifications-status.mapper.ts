import { Injectable } from '@angular/core';

import { Status } from '@presentation/pages/communication/domain/enums/notifications/notifications-status.enum';
import { ApiStatus } from '@presentation/pages/communication/infrastructure/enums/notifications/notifications-status-api.enum';

@Injectable({ providedIn: 'root' })
export class StatusMapper {
    private readonly statusMapping = {
        toApi: {
            [Status.READ]: ApiStatus.READ,
            [Status.UNREAD]: ApiStatus.UNREAD,
        },
        fromApi: {
            [ApiStatus.READ]: Status.READ,
            [ApiStatus.UNREAD]: Status.UNREAD,
        },
    };

    mapToDto(status: Status): ApiStatus {
        return this.statusMapping.toApi[status];
    }

    mapFromDto(dto: ApiStatus): Status {
        return this.statusMapping.fromApi[dto];
    }
}
