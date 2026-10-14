import { Injectable, inject, signal } from '@angular/core';
import { SlaThresholdCommandBus } from '@pages/sla/application/commands-bus/sla-thresholds/sla-threshold.command-bus';
import { SlaThresholdUpdateCommand } from '@pages/sla/application/commands/sla-thresholds/sla-threshold-update.command';
import { SlaThresholdUpdateDto } from '@pages/sla/application/dto/sla/sla-threshold-update.dto';
import {
    SlaChannelOptionsQuery,
    SlaThresholdQuery,
} from '@pages/sla/application/queries/sla-thresholds/sla-threshold.query';
import { SlaThresholdBus } from '@pages/sla/application/queries-bus/sla-thresholds/sla-threshold.bus';
import { SlaChannelOptionEntity } from '@pages/sla/domain/entities/sla/sla-channel-option.entity';
import { SlaThresholdEntity } from '@pages/sla/domain/entities/sla/sla-threshold.entity';
import { handleObservableWithFeedback } from '@shared/application/services/facade.utils';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { finalize } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SlaThresholdsFacade {
    private readonly queryBus = inject(SlaThresholdBus);
    private readonly commandBus = inject(SlaThresholdCommandBus);
    private readonly ui = inject(UiFeedbackService);
    private lastFilter: {
        slaType?: string;
        channel?: string;
    } = {};

    readonly reportTypes = signal<SlaThresholdEntity[]>([]);
    readonly channelOptions = signal<SlaChannelOptionEntity[]>([]);
    readonly loading = signal(false);

    readReportTypes(
        slaType?: string,
        channel?: string,
        options: FetchOptions = {}
    ): void {
        this.lastFilter = { slaType, channel };
        this.loading.set(true);
        this.queryBus
            .dispatch(new SlaThresholdQuery(slaType, channel), options)
            .pipe(finalize(() => this.loading.set(false)))
            .subscribe({
                next: (items) => this.reportTypes.set(items),
                error: (error) => this.ui.notifyError(error),
            });
    }

    readChannelOptions(): void {
        this.queryBus.dispatch(new SlaChannelOptionsQuery()).subscribe({
            next: (items) => this.channelOptions.set(items),
            error: (error) => this.ui.notifyError(error),
        });
    }

    update(
        dto: SlaThresholdUpdateDto,
        onSuccess: () => void,
        onError: () => void
    ): void {
        handleObservableWithFeedback(
            this.commandBus.dispatch(
                new SlaThresholdUpdateCommand(
                    dto.id,
                    dto.slaId,
                    dto.threshold,
                    dto.criticalThreshold
                )
            ),
            this.ui,
            'COMMON.SUCCESS.UPDATE',
            () => {
                onSuccess();
                this.refresh();
            }
        ).subscribe({ error: onError });
    }

    refresh(): void {
        this.readReportTypes(this.lastFilter.slaType, this.lastFilter.channel, {
            forceRefresh: true,
        });
    }
}
