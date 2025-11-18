import { Injectable } from '@angular/core';
import { Paginate } from '@shared/interfaces/paginate';
import { Observable, map } from 'rxjs';
import { ApprovalEntity } from '../../domain/entities/approval/approval.entity';
import { ApprovalRepository } from '../../domain/repositories/approval.repository';
import { ApprovalFilter } from '../../domain/value-objects/approval-filter.vo';
import { ApprovalMapper } from '../mappers/approval.mapper';
import { ApprovalApi } from '../sources/approval.api';

@Injectable({
    providedIn: 'root',
})
export class ApprovalRepositoryImpl extends ApprovalRepository {
    constructor(
        private readonly approvalApi: ApprovalApi,
        private readonly approvalMapper: ApprovalMapper
    ) {
        super();
    }

    fetchApprovals(
        filter: ApprovalFilter,
        page: string
    ): Observable<Paginate<ApprovalEntity>> {
        return this.approvalApi
            .fetchApprovals(filter.toDto(), page)
            .pipe(map((response) => this.approvalMapper.mapFromDto(response)));
    }
}
