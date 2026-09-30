import { Injectable, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { SlaBusinessContactsApi } from '@pages/sla/infrastructure/data/sources/sla/sla-business-contacts.api';
import {
    BusinessContactAddApiDto,
    BusinessContactFilterApiDto,
    BusinessContactFreeMemberApiDto,
} from '@pages/sla/infrastructure/api/dto/sla/business-contact-response-api.dto';
import {
    BusinessContactSlaFilterApiDto,
    BusinessContactAvailableSlaItemApiDto,
    BusinessContactSlaIdsApiDto,
    BusinessContactSlaItemApiDto,
    BusinessContactSlaRemoveIdsApiDto,
} from '@pages/sla/infrastructure/api/dto/sla/business-contact-sla-response-api.dto';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { handleObservableWithFeedback } from '@shared/application/services/facade.utils';
import { SlaBusinessContactEntity } from '@pages/sla/domain/entities/sla/sla-business-contact.entity';
import { SlaBusinessContactSlaEntity } from '@pages/sla/domain/entities/sla/sla-business-contact-sla.entity';
import { SlaBusinessContactsMapper } from '@pages/sla/infrastructure/data/mappers/sla/sla-business-contacts.mapper';

@Injectable({ providedIn: 'root' })
export class SlaBusinessContactsFacade {
    private readonly api = inject(SlaBusinessContactsApi);
    private readonly ui = inject(UiFeedbackService);
    private readonly mapper = inject(SlaBusinessContactsMapper);

    readonly contacts = signal<SlaBusinessContactEntity[]>([]);
    readonly freeMembers = signal<BusinessContactFreeMemberApiDto[]>([]);
    readonly managementItems = signal<SlaBusinessContactSlaEntity[]>([]);
    readonly availableSlas = signal<BusinessContactAvailableSlaItemApiDto[]>(
        []
    );
    readonly assignedSlas = signal<BusinessContactSlaItemApiDto[]>([]);
    readonly loading = signal(false);
    readonly loadingFreeMembers = signal(false);
    readonly loadingManagement = signal(false);
    readonly loadingSlas = signal(false);
    readonly actionLoading = signal(false);

    private currentFilter: BusinessContactFilterApiDto = {};

    readAll(filter: BusinessContactFilterApiDto = {}): void {
        this.currentFilter = filter;
        this.loading.set(true);
        this.api
            .readAll(filter)
            .pipe(finalize(() => this.loading.set(false)))
            .subscribe({
                next: (response) =>
                    this.contacts.set(
                        response.data.map((item) =>
                            this.mapper.mapContact(item)
                        )
                    ),
                error: (error) => this.ui.notifyError(error),
            });
    }

    readFreeMembers(): void {
        this.loadingFreeMembers.set(true);
        this.api
            .freeMembers()
            .pipe(finalize(() => this.loadingFreeMembers.set(false)))
            .subscribe({
                next: (response) => this.freeMembers.set(response.data),
                error: (error) => this.ui.notifyError(error),
            });
    }

    add(dto: BusinessContactAddApiDto, onSuccess?: () => void): void {
        this.runAction(this.api.add(dto), 'COMMON.SUCCESS.CREATE', () => {
            this.readAll(this.currentFilter);
            onSuccess?.();
        });
    }

    enable(id: string | number): void {
        this.runAction(this.api.enable(id), 'COMMON.SUCCESS.ENABLE', () =>
            this.readAll(this.currentFilter)
        );
    }

    disable(id: string | number): void {
        this.runAction(this.api.disable(id), 'COMMON.SUCCESS.DISABLE', () =>
            this.readAll(this.currentFilter)
        );
    }

    remove(id: string | number): void {
        this.runAction(this.api.remove(id), 'COMMON.SUCCESS.DELETE', () =>
            this.readAll(this.currentFilter)
        );
    }

    readManagement(
        id: string | number,
        filter: BusinessContactSlaFilterApiDto = {}
    ): void {
        this.loadingManagement.set(true);
        this.api
            .readManagement(id, filter)
            .pipe(finalize(() => this.loadingManagement.set(false)))
            .subscribe({
                next: (response) =>
                    this.managementItems.set(
                        response.data.map((item) => this.mapper.mapSla(item))
                    ),
                error: (error) => this.ui.notifyError(error),
            });
    }

    readAvailableSlas(id: string | number): void {
        this.loadingSlas.set(true);
        this.api
            .readAvailableSlas(id)
            .pipe(finalize(() => this.loadingSlas.set(false)))
            .subscribe({
                next: (response) => this.availableSlas.set(response.data),
                error: (error) => this.ui.notifyError(error),
            });
    }

    readAssignedSlas(id: string | number): void {
        this.loadingSlas.set(true);
        this.api
            .readAssignedSlas(id)
            .pipe(finalize(() => this.loadingSlas.set(false)))
            .subscribe({
                next: (response) => this.assignedSlas.set(response.data),
                error: (error) => this.ui.notifyError(error),
            });
    }

    affectSlas(id: string | number, dto: BusinessContactSlaIdsApiDto): void {
        this.runAction(
            this.api.affectSlas(id, dto),
            'COMMON.SUCCESS.UPDATE',
            () => this.readManagement(id)
        );
    }

    reassignSlas(id: string | number, dto: BusinessContactSlaIdsApiDto): void {
        this.runAction(
            this.api.reassignSlas(id, dto),
            'COMMON.SUCCESS.UPDATE',
            () => this.readManagement(id)
        );
    }

    removeSlas(
        id: string | number,
        dto: BusinessContactSlaRemoveIdsApiDto
    ): void {
        this.runAction(
            this.api.removeSlas(id, dto),
            'COMMON.SUCCESS.DELETE',
            () => this.readManagement(id)
        );
    }

    private runAction<T>(
        request$: import('rxjs').Observable<T>,
        successKey: string,
        onSuccess: () => void
    ): void {
        this.actionLoading.set(true);
        handleObservableWithFeedback(request$, this.ui, successKey, onSuccess)
            .pipe(finalize(() => this.actionLoading.set(false)))
            .subscribe();
    }
}
