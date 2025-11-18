import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, map } from 'rxjs';
import { ManagementEntity } from '../../domain/entities/management/management.entity';
import { ManagementRepository } from '../../domain/repositories/management.repository';
import { ManagementForm } from '../../domain/value-objects/management-form.vo';
import { ManagementMapper } from '../mappers/management.mapper';
import { ManagementApi } from '../sources/management.api';

@Injectable({ providedIn: 'root' })
export class ManagementRepositoryImpl extends ManagementRepository {
    constructor(
        private readonly api: ManagementApi,
        private readonly managementMapper: ManagementMapper,
        private readonly translateService: TranslateService
    ) {
        super();
    }

    fetchTake(payload: ManagementForm): Observable<ManagementEntity> {
        return this.api
            .fetchTake(payload.toDto())
            .pipe(
                map((response) => this.managementMapper.mapFromDto(response))
            );
    }

    fetchApprove(payload: ManagementForm): Observable<ManagementEntity> {
        return this.api
            .fetchApprove(payload.toDto())
            .pipe(
                map((response) => this.managementMapper.mapFromDto(response))
            );
    }

    fetchReject(payload: ManagementForm): Observable<ManagementEntity> {
        return this.api
            .fetchReject(payload.toDto())
            .pipe(
                map((response) => this.managementMapper.mapFromDto(response))
            );
    }

    fetchProcess(payload: ManagementForm): Observable<ManagementEntity> {
        return this.api
            .fetchProcess(payload.toDto())
            .pipe(
                map((response) => this.managementMapper.mapFromDto(response))
            );
    }
}
