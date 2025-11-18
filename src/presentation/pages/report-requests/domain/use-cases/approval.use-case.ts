import { inject, Injectable } from '@angular/core';
import { Paginate } from '@shared/interfaces/paginate';
import { Observable } from 'rxjs';
import { ApprovalEntity } from '../entities/approval/approval.entity';
import { ApprovalRepository } from '../repositories/approval.repository';
import { ApprovalFilter } from '../value-objects/approval-filter.vo';

@Injectable({
    providedIn: 'root',
})
export class FetchApprovalsUseCase {
    private readonly approvalRepository = inject(ApprovalRepository);

    execute(
        filter: ApprovalFilter,
        page: string
    ): Observable<Paginate<ApprovalEntity>> {
        return this.approvalRepository.fetchApprovals(filter, page);
    }
}
