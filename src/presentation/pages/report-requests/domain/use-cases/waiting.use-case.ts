import { Injectable } from '@angular/core';
import { WaitingEntity } from '@presentation/pages/report-requests/domain/entities/waiting/waiting.entity';
import { WaitingRepository } from '@presentation/pages/report-requests/domain/repositories/waiting.repository';
import { WaitingFilter } from '@presentation/pages/report-requests/domain/value-objects/waiting-filter.vo';
import { Paginate } from '@shared/interfaces/paginate';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FetchWaitingUseCase {
    constructor(private readonly waitingRepository: WaitingRepository) {}

    execute(
        filter: WaitingFilter,
        page: string
    ): Observable<Paginate<WaitingEntity>> {
        return this.waitingRepository.fetchWaiting(filter, page);
    }
}
