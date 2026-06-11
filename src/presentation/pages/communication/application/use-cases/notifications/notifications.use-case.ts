import { inject, Injectable } from '@angular/core';
import { NotificationsFilterDto } from '@pages/communication/application/dto/notifications/notifications-filter.dto';
import { NotificationsReadOneDto } from '@pages/communication/application/dto/notifications/notifications-read-one.dto';
import { NotificationsFilterEntity } from '@pages/communication/domain/entities/notifications/notifications-filter.entity';
import { NotificationsReadOneEntity } from '@pages/communication/domain/entities/notifications/notifications-read-one.entity';
import { NotificationsEntity } from '@pages/communication/domain/entities/notifications/notifications.entity';
import { NotificationsRepository } from '@pages/communication/domain/repositories/notifications/notifications.repository';
import { NotificationsFilterVo } from '@pages/communication/domain/value-objects/notifications/notifications-filter.vo';
import { NotificationsReadOneVo } from '@pages/communication/domain/value-objects/notifications/notifications-read-one.vo';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class NotificationsUseCase {
    private readonly repository = inject(NotificationsRepository);

    execute(
        filterDto: NotificationsFilterDto | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<NotificationsEntity>> {
        const vo = NotificationsFilterVo.fromDto(filterDto);
        const entity = NotificationsFilterEntity.fromVo(vo);
        return this.repository.execute(entity, page, options);
    }

    readOne(dto: NotificationsReadOneDto): Observable<SimpleResponseDto<void>> {
        const vo = NotificationsReadOneVo.fromDto(dto);
        const entity = NotificationsReadOneEntity.fromVo(vo);
        return this.repository.readOne(entity);
    }

    readAll(): Observable<SimpleResponseDto<void>> {
        return this.repository.readAll();
    }
}
