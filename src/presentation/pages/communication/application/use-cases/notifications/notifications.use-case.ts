import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { NotificationsFilterDto } from '@presentation/pages/communication/application/dto/notifications/notifications-filter.dto';
import { NotificationsFilterEntity } from '@presentation/pages/communication/domain/entities/notifications/notifications-filter.entity';
import { NotificationsEntity } from '@presentation/pages/communication/domain/entities/notifications/notifications.entity';
import { NotificationsRepository } from '@presentation/pages/communication/domain/repositories/notifications/notifications.repository';
import { NotificationsFilterVo } from '@presentation/pages/communication/domain/value-objects/notifications/notifications-filter.vo';

@Injectable({
    providedIn: 'root',
})
export class NotificationsUseCase {
    private readonly repository = inject(NotificationsRepository);

    execute(
        filterDto: NotificationsFilterDto | null,
        page: string
    ): Observable<Paginate<NotificationsEntity>> {
        const vo = NotificationsFilterVo.fromDto(filterDto);
        const entity = NotificationsFilterEntity.fromVo(vo);
        return this.repository.readAll(entity, page);
    }
}
