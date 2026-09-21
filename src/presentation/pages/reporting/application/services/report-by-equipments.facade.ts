import { inject, Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { GrafanaDashboardService } from '@shared/services/grafana-dashboard.service';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

const GRAFANA_KEY = 'impacts_on_equipments_uid';

@Injectable({
    providedIn: 'root',
})
export class ReportByEquipmentsFacade {
    private readonly grafana = inject(GrafanaDashboardService);

    readonly url: Signal<string | null> = toSignal(
        this.grafana.url$(GRAFANA_KEY),
        { initialValue: null }
    );
    readonly loading: Signal<boolean> = toSignal(
        this.grafana.loading$(GRAFANA_KEY),
        { initialValue: false }
    );
    readonly error: Signal<string | null> = toSignal(
        this.grafana.error$(GRAFANA_KEY),
        { initialValue: null }
    );

    execute(options?: FetchOptions): void {
        this.grafana.load(GRAFANA_KEY, options);
    }

    refresh(): void {
        this.grafana.load(GRAFANA_KEY, { forceRefresh: true });
    }
}
