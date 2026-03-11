import { inject, Injectable } from '@angular/core';
import { MessagingFindOneFilterDto } from '@pages/communication/application/dto/messaging/messaging-find-one-filter.dto';
import { MessagingFindOneFilterEntity } from '@pages/communication/domain/entities/messaging/messaging-find-one-filter.entity';
import { MessagingFindOneEntity } from '@pages/communication/domain/entities/messaging/messaging-find-one.entity';
import { MessagingFindOneRepository } from '@pages/communication/domain/repositories/messaging/messaging-find-one-repository';
import { MessagingFindOneFilterVo } from '@pages/communication/domain/value-objects/messaging/messaging-find-one-filter.vo';
import { Observable } from 'rxjs';

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
        console.log('filter: ', filter);
        return this.repository.read(filter);
    }
}
