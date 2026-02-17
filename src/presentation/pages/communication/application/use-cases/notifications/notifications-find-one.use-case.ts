import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { NotificationsFindOneFilterDto } from '@presentation/pages/communication/application/dto/notifications/notifications-find-one-filter.dto';
import { NotificationsFindOneFilterEntity } from '@presentation/pages/communication/domain/entities/notifications/notifications-find-one-filter.entity';
import { NotificationsFindOneEntity } from '@presentation/pages/communication/domain/entities/notifications/notifications-find-one.entity';
import { NotificationsFindOneRepository } from '@presentation/pages/communication/domain/repositories/notifications/notifications-find-one.repository';
import { NotificationsFindOneFilterVo } from '@presentation/pages/communication/domain/value-objects/notifications/notifications-find-one-filter.vo';

@Injectable({
    providedIn: 'root',
})
export class NotificationsFindOneUseCase {
    private readonly repository = inject(NotificationsFindOneRepository);

    execute(
        filterDto: NotificationsFindOneFilterDto,
        page: string
    ): Observable<Paginate<NotificationsFindOneEntity>> {
        const vo = NotificationsFindOneFilterVo.fromDto(filterDto);
        const filter = NotificationsFindOneFilterEntity.fromVo(vo);
        return this.repository.execute(filter, page);
    }
}
