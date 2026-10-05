import { Injectable, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { handleObservableWithFeedback } from '@shared/application/services/facade.utils';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import {
    SlaAlertChannelOptionEntity,
    SlaAlertContactEntity,
} from '@pages/sla/domain/entities/sla/sla-alert-contact.entity';
import { SlaAlertChannelUpdateContract } from '@pages/sla/domain/contracts/sla/sla-alert-channel-update.contract';
import { SlaAlertChannelRepository } from '@pages/sla/domain/repositories/sla/sla-alert-channel.repository';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({ providedIn: 'root' })
export class SlaAlertChannelFacade {
    private readonly repository = inject(SlaAlertChannelRepository);
    private readonly ui = inject(UiFeedbackService);

    readonly items = signal<SlaAlertContactEntity[]>([]);
    readonly channelOptions = signal<SlaAlertChannelOptionEntity[]>([]);
    readonly loading = signal(false);

    readAll(search?: string, options: FetchOptions = {}): void {
        this.loading.set(true);
        this.repository
            .readAll(search, options)
            .pipe(finalize(() => this.loading.set(false)))
            .subscribe({
                next: (response) =>
                    this.items.set(response),
                error: (error) => this.ui.notifyError(error),
            });
    }

    readChannelOptions(): void {
        this.repository.readChannelOptions().subscribe({
            next: (response) => this.channelOptions.set(response),
            error: (error) => this.ui.notifyError(error),
        });
    }

    update(
        payload: SlaAlertChannelUpdateContract,
        onSuccess: () => void,
        onError: () => void
    ): void {
        handleObservableWithFeedback(
            this.repository.update(payload),
            this.ui,
            'COMMON.SUCCESS.UPDATE'
        ).subscribe({ next: onSuccess, error: onError });
    }
}
