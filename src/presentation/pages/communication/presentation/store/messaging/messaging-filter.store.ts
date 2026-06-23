import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MessagingFilterDto } from '@pages/communication/application/dto/messaging/messaging-filter.dto';
import { MessagingFacade } from '@pages/communication/application/services/messaging/messaging.facade';
import { MessagingFilterControl } from '@pages/communication/presentation/store/messaging/messaging-filter.control';
import { MessagingChannelsEnum } from '@pages/communication/domain/enums/messaging/messaging-channels.enum';
import { MessagingTargetEnum } from '@pages/communication/domain/enums/messaging/messaging-target.enum';

@Injectable()
export class MessagingFilterStore {
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(MessagingFacade);

    private readonly currentFilter = toSignal(this.facade.currentFilter$, {
        initialValue: null,
    });

    readonly form: FormGroup<MessagingFilterControl> =
        this.fb.group<MessagingFilterControl>({
            search: new FormControl<string>('', {
                nonNullable: true,
            }),
            channels: new FormControl<MessagingChannelsEnum[] | undefined>(
                undefined,
                {
                    nonNullable: true,
                }
            ),
            targetType: new FormControl<MessagingTargetEnum | undefined>(
                undefined,
                {
                    nonNullable: true,
                }
            ),
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

    get value(): MessagingFilterDto {
        const raw = this.form.getRawValue();

        return {
            search: raw.search || undefined,
            channels: raw.channels || undefined,
            targetType: raw.targetType || undefined,
        };
    }
}
