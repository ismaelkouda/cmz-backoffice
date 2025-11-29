/* import { Injectable } from '@angular/core';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { Observable, map } from 'rxjs';
import { MessagingEntity } from '../../domain/entities/messaging.entity';
import { MessagingRepository } from '../../domain/repositories/messaging.repository';
import { MessagingFilter } from '../../domain/value-objects/messaging-filter.vo';
import { MessagingMapper } from '../mappers/messaging.mapper';
import { MessagingApi } from '../sources/messaging.api';

@Injectable({ providedIn: 'root' })
export class MessagingRepositoryImpl extends MessagingRepository {
    constructor(private readonly api: MessagingApi) {
        super();
    }

    fetchMessages(
        filter: MessagingFilter,
        page: string
    ): Observable<Paginate<MessagingEntity>> {
        return this.api.fetchMessages(filter.get(), page).pipe(
            map((response) => MessagingMapper.toEntity(response))
        );
    }
}
 */
