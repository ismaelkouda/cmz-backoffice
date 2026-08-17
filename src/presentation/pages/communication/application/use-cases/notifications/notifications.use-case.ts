import { inject, Injectable } from '@angular/core';
import { NotificationsFilterContract } from '@pages/communication/domain/contracts/notifications/notifications-filter.contract';
import { NotificationsReadOneDto } from '@pages/communication/application/dto/notifications/notifications-read-one.dto';
import { notificationsFilterEntity } from '@pages/communication/domain/entities/notifications/notifications-filter.entity';
import { NotificationsEntity } from '@pages/communication/domain/entities/notifications/notifications.entity';
import { NotificationsRepository } from '@pages/communication/domain/repositories/notifications/notifications.repository';
import { notificationsFilterVo } from '@pages/communication/domain/value-objects/notifications/notifications-filter.vo';
import { notificationsReadOneVo } from '@pages/communication/domain/value-objects/notifications/notifications-read-one.vo';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { defer, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class NotificationsUseCase {
    private readonly repository = inject(NotificationsRepository);

    execute(
        contract: NotificationsFilterContract,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<NotificationsEntity>> {
        return defer(() => {
            const vo = notificationsFilterVo(contract);
            const entity = notificationsFilterEntity(vo);
            return this.repository.execute(entity, page, options);
        });
    }

    readOne(dto: NotificationsReadOneDto): Observable<SimpleResponseDto<void>> {
        return defer(() =>
            this.repository.readOne(notificationsReadOneVo(dto))
        );
    }

    readAll(): Observable<SimpleResponseDto<void>> {
        return this.repository.readAll();
    }
}
