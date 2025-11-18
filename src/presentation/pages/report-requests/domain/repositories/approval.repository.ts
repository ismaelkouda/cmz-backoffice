import { Paginate } from '@shared/interfaces/paginate';
import { Observable } from 'rxjs';
import { ApprovalEntity } from '../entities/approval/approval.entity';
import { ApprovalFilter } from '../value-objects/approval-filter.vo';

export abstract class ApprovalRepository {
    abstract fetchApprovals(
        filter: ApprovalFilter,
        page: string
    ): Observable<Paginate<ApprovalEntity>>;
}
