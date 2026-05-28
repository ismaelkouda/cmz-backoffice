import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Status } from '@pages/content-management/domain/enums/slide/slide-status.enum';
import { SlideFilterDto } from '@presentation/pages/content-management/application/dto/slide/slide-filter.dto';
import { SlideFacade } from '@presentation/pages/content-management/application/services/slide/slide.facade';
import { SlideFilterControl } from '@presentation/pages/content-management/application/store/slide/slide-filter.control';
import { Platform } from '@shared/domain/enums/platform.enum';

@Injectable()
export class SlideFilterStore {
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(SlideFacade);

    private readonly currentFilter = toSignal(this.facade.currentFilter$, {
        initialValue: null,
    });

    readonly form: FormGroup<SlideFilterControl> =
        this.fb.group<SlideFilterControl>({
            search: new FormControl<string | undefined>(undefined, {
                nonNullable: true,
            }),
            platforms: new FormControl<Platform[] | undefined>(undefined, {
                nonNullable: true,
            }),
            status: new FormControl<Status | undefined>(undefined, {
                nonNullable: true,
            }),
            startDate: new FormControl<string | undefined>(undefined, {
                nonNullable: true,
            }),
            endDate: new FormControl<string | undefined>(undefined, {
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

    get value(): SlideFilterDto {
        const raw = this.form.getRawValue();

        return {
            search: raw.search || undefined,
            platforms: raw.platforms || undefined,
            status: raw.status || undefined,
            startDate: raw.startDate || undefined,
            endDate: raw.endDate || undefined,
        };
    }
}
