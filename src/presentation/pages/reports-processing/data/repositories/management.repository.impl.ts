import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, map, tap } from 'rxjs';
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

    fetchTake(
        payload: ManagementForm,
        endPointType: EndPointType
    ): Observable<ManagementEntity> {
        return this.api
            .fetchTake(payload.toDto(), endPointType)
            .pipe(
                map((response) => this.managementMapper.mapFromDto(response)),
                tap(() => {
                    this.translateService.instant('COMMON.SUCCESS.TAKE');
                })
            );
    }

    fetchApprove(
        payload: ManagementForm,
        endPointType: EndPointType
    ): Observable<ManagementEntity> {
        return this.api
            .fetchApprove(payload.toDto(), endPointType)
            .pipe(
                map((response) => this.managementMapper.mapFromDto(response)),
                tap(() => {
                    this.translateService.instant('COMMON.SUCCESS.APPROVE');
                })
            );
    }

    fetchReject(
        payload: ManagementForm,
        endPointType: EndPointType
    ): Observable<ManagementEntity> {
        return this.api
            .fetchReject(payload.toDto(), endPointType)
            .pipe(
                map((response) => this.managementMapper.mapFromDto(response)),
                tap(() => {
                    this.translateService.instant('COMMON.SUCCESS.REJECT');
                })
            );
    }

    fetchProcess(payload: ManagementForm): Observable<ManagementEntity> {
        return this.api
            .fetchProcess(payload.toDto())
            .pipe(
                map((response) => this.managementMapper.mapFromDto(response)),
                tap(() => {
                    this.translateService.instant('COMMON.SUCCESS.PROCESS');
                })
            );
    }

    fetchFinalize(payload: ManagementForm): Observable<ManagementEntity> {
        return this.api
            .fetchFinalize(payload.toDto())
            .pipe(
                map((response) => this.managementMapper.mapFromDto(response)),
                tap(() => {
                    this.translateService.instant('COMMON.SUCCESS.FINALIZE');
                })
            );
    }
}
