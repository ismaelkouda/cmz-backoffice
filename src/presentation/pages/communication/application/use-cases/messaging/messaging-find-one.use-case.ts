import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { MessagingFindOneFilterDto } from '@presentation/pages/communication/application/dto/messaging/messaging-find-one-filter.dto';
import { MessagingFindOneFilterEntity } from '@presentation/pages/communication/domain/entities/messaging/messaging-find-one-filter.entity';
import { MessagingFindOneEntity } from '@presentation/pages/communication/domain/entities/messaging/messaging-find-one.entity';
import { MessagingFindOneRepository } from '@presentation/pages/communication/domain/repositories/messaging/messaging-find-one-repository';
import { MessagingFindOneFilterVo } from '@presentation/pages/communication/domain/value-objects/messaging/messaging-find-one-filter.vo';

@Injectable({
    providedIn: 'root',
})
export class MessagingFindOneUseCase {
    private readonly repository = inject(MessagingFindOneRepository);

    execute(
        filterDto: MessagingFindOneFilterDto
    ): Observable<MessagingFindOneEntity> {
        const vo = MessagingFindOneFilterVo.fromDto(filterDto);
        const filter = MessagingFindOneFilterEntity.fromVo(vo);
        return this.repository.read(filter);
    }
}
