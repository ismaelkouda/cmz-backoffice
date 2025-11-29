/* import { Injectable } from '@angular/core';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { UseCase } from '@shared/domain/use-cases/use-case';
import { Observable } from 'rxjs';
import { MessagingEntity } from '../entities/messaging.entity';
import { MessagingRepository } from '../repositories/messaging.repository';
import { MessagingFilter } from '../value-objects/messaging-filter.vo';

@Injectable({ providedIn: 'root' })
export class MessagingUseCase implements UseCase<Paginate<MessagingEntity>> {
    constructor(private readonly repository: MessagingRepository) {}

    execute(
        filter: MessagingFilter,
        page: string
    ): Observable<Paginate<MessagingEntity>> {
        return this.repository.fetchMessages(filter, page);
    }
}
 */
