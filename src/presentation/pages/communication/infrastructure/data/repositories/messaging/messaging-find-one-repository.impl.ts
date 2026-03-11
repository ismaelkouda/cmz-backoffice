import { inject, Injectable } from '@angular/core';
import { MessagingFindOneFilterEntity } from '@pages/communication/domain/entities/messaging/messaging-find-one-filter.entity';
import { MessagingFindOneEntity } from '@pages/communication/domain/entities/messaging/messaging-find-one.entity';
import { MessagingFindOneRepository } from '@pages/communication/domain/repositories/messaging/messaging-find-one-repository';
import { messagingFindOneFilterMapper } from '@pages/communication/infrastructure/data/mappers/messaging/messaging-find-one-filter.mapper';
import { MessagingFindOneMapper } from '@pages/communication/infrastructure/data/mappers/messaging/messaging-find-one.mapper';
import { MessagingFindOneApi } from '@pages/communication/infrastructure/data/sources/messaging/messaging-find-one.api';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MessagingFindOneRepositoryImpl implements MessagingFindOneRepository {
    private readonly api = inject(MessagingFindOneApi);
    private readonly mapper = inject(MessagingFindOneMapper);

    read(
        filter: MessagingFindOneFilterEntity
    ): Observable<MessagingFindOneEntity> {
        const paramsDto = messagingFindOneFilterMapper(filter);
        console.log('paramsDto: ', paramsDto);
        return this.api
            .read(paramsDto)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
