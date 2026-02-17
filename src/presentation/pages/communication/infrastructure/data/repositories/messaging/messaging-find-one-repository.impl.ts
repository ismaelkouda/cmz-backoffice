import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { MessagingFindOneFilterEntity } from '@presentation/pages/communication/domain/entities/messaging/messaging-find-one-filter.entity';
import { MessagingFindOneEntity } from '@presentation/pages/communication/domain/entities/messaging/messaging-find-one.entity';
import { MessagingFindOneRepository } from '@presentation/pages/communication/domain/repositories/messaging/messaging-find-one-repository';
import { messagingFindOneFilterMapper } from '@presentation/pages/communication/infrastructure/data/mappers/messaging/messaging-find-one-filter.mapper';
import { MessagingFindOneMapper } from '@presentation/pages/communication/infrastructure/data/mappers/messaging/messaging-find-one.mapper';
import { MessagingFindOneApi } from '@presentation/pages/communication/infrastructure/data/sources/messaging/messaging-find-one.api';

@Injectable({ providedIn: 'root' })
export class MessagingFindOneRepositoryImpl implements MessagingFindOneRepository {
    private readonly api = inject(MessagingFindOneApi);
    private readonly mapper = inject(MessagingFindOneMapper);

    read(
        filter: MessagingFindOneFilterEntity
    ): Observable<MessagingFindOneEntity> {
        const paramsDto = messagingFindOneFilterMapper(filter);
        return this.api
            .read(paramsDto)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
