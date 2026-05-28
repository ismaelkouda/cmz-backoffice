import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Status } from '@pages/content-management/domain/enums/home/home-status.enum';
import { HomeFilterDto } from '@presentation/pages/content-management/application/dto/home/home-filter.dto';
import { HomeFacade } from '@presentation/pages/content-management/application/services/home/home.facade';
import { HomeFilterControl } from '@presentation/pages/content-management/application/store/home/home-filter.control';
import { Platform } from '@shared/domain/enums/platform.enum';

@Injectable()
export class HomeFilterStore {
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(HomeFacade);

    private readonly currentFilter = toSignal(this.facade.currentFilter$, {
        initialValue: null,
    });

    readonly form: FormGroup<HomeFilterControl> =
        this.fb.group<HomeFilterControl>({
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

    get value(): HomeFilterDto {
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
