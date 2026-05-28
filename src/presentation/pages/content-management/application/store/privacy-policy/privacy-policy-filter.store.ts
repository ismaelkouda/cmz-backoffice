import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { Status } from '@pages/content-management/domain/enums/privacy-policy/privacy-policy-status.enum';
import { PrivacyPolicyFilterDto } from '@presentation/pages/content-management/application/dto/privacy-policy/privacy-policy-filter.dto';
import { PrivacyPolicyFacade } from '@presentation/pages/content-management/application/services/privacy-policy/privacy-policy.facade';
import { PrivacyPolicyFilterControl } from '@presentation/pages/content-management/application/store/privacy-policy/privacy-policy-filter.control';
import { semanticVersionValidator } from '@shared/domain/functions/semantic-version-validator';

@Injectable()
export class PrivacyPolicyFilterStore {
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(PrivacyPolicyFacade);

    private readonly currentFilter = toSignal(this.facade.currentFilter$, {
        initialValue: null,
    });

    readonly form: FormGroup<PrivacyPolicyFilterControl> =
        this.fb.group<PrivacyPolicyFilterControl>({
            search: new FormControl<string | undefined>(undefined, {
                nonNullable: true,
            }),
            version: new FormControl<string | undefined>(undefined, {
                validators: [
                    semanticVersionValidator(),
                    Validators.pattern(/^\d+(\.\d+){0,2}$/),
                ],
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

    get value(): PrivacyPolicyFilterDto {
        const raw = this.form.getRawValue();

        return {
            search: raw.search || undefined,
            version: raw.version || undefined,
            status: raw.status || undefined,
            startDate: raw.startDate || undefined,
            endDate: raw.endDate || undefined,
        };
    }
}
