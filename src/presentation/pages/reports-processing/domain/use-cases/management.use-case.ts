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

    executeFetchTake(payload: ManagementForm): Observable<ManagementEntity> {
        return this.managementRepository.fetchTake(payload);
    }

    executeFetchApprove(payload: ManagementForm): Observable<ManagementEntity> {
        return this.managementRepository.fetchApprove(payload);
    }

    executeFetchReject(payload: ManagementForm): Observable<ManagementEntity> {
        return this.managementRepository.fetchApprove(payload);
    }

    executeFetchProcess(payload: ManagementForm): Observable<ManagementEntity> {
        return this.managementRepository.fetchProcess(payload);
    }
}
