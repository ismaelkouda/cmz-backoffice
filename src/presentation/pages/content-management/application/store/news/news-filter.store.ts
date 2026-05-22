import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Status } from '@pages/content-management/domain/enums/news/news-status.enum';
import { NewsFilterDto } from '@presentation/pages/content-management/application/dto/news/news-filter.dto';
import { NewsFacade } from '@presentation/pages/content-management/application/services/news/news.facade';
import { NewsFilterControl } from '@presentation/pages/content-management/application/store/news/news-filter.control';

@Injectable()
export class NewsFilterStore {
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(NewsFacade);

    private readonly currentFilter = toSignal(this.facade.currentFilter$, {
        initialValue: null,
    });

    readonly form: FormGroup<NewsFilterControl> =
        this.fb.group<NewsFilterControl>({
            search: new FormControl<string | undefined>(undefined, {
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

    get value(): NewsFilterDto {
        const raw = this.form.getRawValue();

        return {
            search: raw.search || undefined,
            status: raw.status || undefined,
            startDate: raw.startDate || undefined,
            endDate: raw.endDate || undefined,
        };
    }
}
