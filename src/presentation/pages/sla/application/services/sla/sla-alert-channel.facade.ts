import { Injectable, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { handleObservableWithFeedback } from '@shared/application/services/facade.utils';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { SlaAlertContactEntity } from '@pages/sla/domain/entities/sla/sla-alert-contact.entity';
import {
    SlaAlertChannelOptionApiDto,
    SlaAlertUpdatePayloadApiDto,
} from '@pages/sla/infrastructure/api/dto/sla/sla-alert-channel-response-api.dto';
import { SlaAlertChannelMapper } from '@pages/sla/infrastructure/data/mappers/sla/sla-alert-channel.mapper';
import { SlaAlertChannelApi } from '@pages/sla/infrastructure/data/sources/sla/sla-alert-channel.api';

@Injectable({ providedIn: 'root' })
export class SlaAlertChannelFacade {
    private readonly api = inject(SlaAlertChannelApi);
    private readonly mapper = new SlaAlertChannelMapper();
    private readonly ui = inject(UiFeedbackService);

    readonly items = signal<SlaAlertContactEntity[]>([]);
    readonly channelOptions = signal<SlaAlertChannelOptionApiDto[]>([]);
    readonly loading = signal(false);

    readAll(search?: string): void {
        this.loading.set(true);
        this.api
            .readAll(search)
            .pipe(finalize(() => this.loading.set(false)))
            .subscribe({
                next: (response) =>
                    this.items.set(
                        response.data.map((item) => this.mapper.map(item))
                    ),
                error: (error) => this.ui.notifyError(error),
            });
    }

    readChannelOptions(): void {
        this.api.readChannelOptions().subscribe({
            next: (response) => this.channelOptions.set(response.data),
            error: (error) => this.ui.notifyError(error),
        });
    }

    update(
        payload: SlaAlertUpdatePayloadApiDto,
        onSuccess: () => void,
        onError: () => void
    ): void {
        handleObservableWithFeedback(
            this.api.update(payload),
            this.ui,
            'COMMON.SUCCESS.UPDATE'
        ).subscribe({ next: onSuccess, error: onError });
    }
}
