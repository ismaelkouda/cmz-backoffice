import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NotificationsFilterDto } from '@pages/communication/application/dto/notifications/notifications-filter.dto';
import { NotificationsFacade } from '@pages/communication/application/services/notifications/notifications.facade';
import { NotificationsFilterControl } from '@pages/communication/presentation/store/notifications/notifications-filter-control';

@Injectable()
export class NotificationsFilterStore {
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(NotificationsFacade);

    private readonly currentFilter = toSignal(this.facade.currentFilter$, {
        initialValue: null,
    });

    readonly form: FormGroup<NotificationsFilterControl> =
        this.fb.group<NotificationsFilterControl>({
            search: new FormControl<string>('', {
                nonNullable: true,
            }),
            type: new FormControl<string | null>(null, {
                nonNullable: true,
            }),
            startDate: new FormControl<string>('', {
                nonNullable: true,
            }),
            endDate: new FormControl<string>('', {
                nonNullable: true,
            }),
        });

    constructor() {
        const filter = this.currentFilter();

        if (!filter) {
            return;
        }

        this.form.patchValue(filter, {
            emitEvent: false,
        });
    }

    reset(): void {
        this.form.reset();
    }

    get value(): NotificationsFilterDto {
        const raw = this.form.getRawValue();

        return {
            search: raw.search || undefined,
            startDate: raw.startDate || undefined,
            endDate: raw.endDate || undefined,
            type: raw.type || undefined,
        };
    }
}
