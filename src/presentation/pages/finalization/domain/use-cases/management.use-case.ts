import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ManagementEntity } from '../entities/management/management.entity';
import { ManagementRepository } from '../repositories/management.repository';
import { ManagementForm } from '../value-objects/management-form.vo';

@Injectable({
    providedIn: 'root',
})
export class ManagementUseCase {
    private readonly managementRepository = inject(ManagementRepository);

    executeFetchTake(
        payload: ManagementForm,
        endPointType: EndPointType
    ): Observable<ManagementEntity> {
        return this.managementRepository.fetchTake(payload, endPointType);
    }

    executeFetchApprove(
        payload: ManagementForm,
        endPointType: EndPointType
    ): Observable<ManagementEntity> {
        return this.managementRepository.fetchApprove(payload, endPointType);
    }

    executeFetchReject(
        payload: ManagementForm,
        endPointType: EndPointType
    ): Observable<ManagementEntity> {
        return this.managementRepository.fetchReject(payload, endPointType);
    }

    executeFetchProcess(payload: ManagementForm): Observable<ManagementEntity> {
        return this.managementRepository.fetchProcess(payload);
    }
}
