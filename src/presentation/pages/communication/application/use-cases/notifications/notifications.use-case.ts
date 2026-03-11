import { inject, Injectable } from '@angular/core';
import { NotificationsFilterDto } from '@pages/communication/application/dto/notifications/notifications-filter.dto';
import { NotificationsFilterEntity } from '@pages/communication/domain/entities/notifications/notifications-filter.entity';
import { NotificationsEntity } from '@pages/communication/domain/entities/notifications/notifications.entity';
import { NotificationsRepository } from '@pages/communication/domain/repositories/notifications/notifications.repository';
import { NotificationsFilterVo } from '@pages/communication/domain/value-objects/notifications/notifications-filter.vo';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

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
        return this.repository.execute(entity, page);
    }

    readAll(): Observable<SimpleResponseDto<void>> {
        return this.repository.readAll();
    }
}
