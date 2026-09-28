import { inject, Injectable, signal } from '@angular/core';
import { SlaCreateDto } from '@pages/sla/application/dto/sla/sla-create.dto';
import { SlaDeleteDto } from '@pages/sla/application/dto/sla/sla-delete.dto';
import { SlaDisableDto } from '@pages/sla/application/dto/sla/sla-disable.dto';
import { SlaEnableDto } from '@pages/sla/application/dto/sla/sla-enable.dto';
import { SlaFilterDto } from '@pages/sla/application/dto/sla/sla-filter.dto';
import { SlaUpdateDto } from '@pages/sla/application/dto/sla/sla-update.dto';
import { SlaQuery } from '@pages/sla/application/queries/sla/sla.query';
import { SlaBus } from '@pages/sla/application/queries-bus/sla/sla.bus';
import { SlaUseCase } from '@pages/sla/application/use-cases/sla/sla.use-case';
import { SlaEntity } from '@pages/sla/domain/entities/sla/sla.entity';
import { ArrayBaseFacade } from '@shared/application/services/array-base-facade';
import { handleObservableWithFeedback } from '@shared/application/services/facade.utils';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { SlaApi } from '@pages/sla/infrastructure/data/sources/sla/sla.api';
import { SlaMapper } from '@pages/sla/infrastructure/data/mappers/sla/sla.mapper';
import { finalize } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SlaFacade extends ArrayBaseFacade<SlaEntity, SlaFilterDto> {
    private readonly bus = inject(SlaBus);
    private readonly useCase = inject(SlaUseCase);
    private readonly uiFeedback = inject(UiFeedbackService);
    private readonly api = inject(SlaApi);
    private readonly mapper = inject(SlaMapper);
    readonly systemItems = signal<SlaEntity[]>([]);
    readonly systemLoading = signal(false);

    read(filter: SlaFilterDto | null = {}, options: FetchOptions = {}): void {
        const normalizedFilter = filter ?? {};
        this.fetchWithFilter(
            normalizedFilter,
            () =>
                this.bus.dispatch(
                    new SlaQuery(normalizedFilter.search),
                    options
                ),
            this.uiFeedback
        );
    }

    refresh(): void {
        this.read(this.filterSubject.getValue() ?? {}, { forceRefresh: true });
    }

    readSystem(
        filter: SlaFilterDto | null = {},
        options: FetchOptions = {}
    ): void {
        this.systemLoading.set(true);
        this.api
            .executeSystem({ search: filter?.search }, options)
            .pipe(finalize(() => this.systemLoading.set(false)))
            .subscribe({
                next: (response) =>
                    this.systemItems.set(this.mapper.mapFromDto(response)),
                error: (error) => this.uiFeedback.notifyError(error),
            });
    }

    create(dto: SlaCreateDto): void {
        handleObservableWithFeedback(
            this.useCase.create(dto),
            this.uiFeedback,
            'COMMON.SUCCESS.CREATE',
            () => this.refresh()
        ).subscribe();
    }

    update(dto: SlaUpdateDto): void {
        handleObservableWithFeedback(
            this.useCase.update(dto),
            this.uiFeedback,
            'COMMON.SUCCESS.UPDATE',
            () => this.refresh()
        ).subscribe();
    }

    enable(dto: SlaEnableDto): void {
        handleObservableWithFeedback(
            this.useCase.enable(dto),
            this.uiFeedback,
            'COMMON.SUCCESS.ENABLE',
            () => this.refresh()
        ).subscribe();
    }

    disable(dto: SlaDisableDto): void {
        handleObservableWithFeedback(
            this.useCase.disable(dto),
            this.uiFeedback,
            'COMMON.SUCCESS.DISABLE',
            () => this.refresh()
        ).subscribe();
    }

    delete(dto: SlaDeleteDto): void {
        handleObservableWithFeedback(
            this.useCase.delete(dto),
            this.uiFeedback,
            'COMMON.SUCCESS.DELETE',
            () => this.refresh()
        ).subscribe();
    }
}
