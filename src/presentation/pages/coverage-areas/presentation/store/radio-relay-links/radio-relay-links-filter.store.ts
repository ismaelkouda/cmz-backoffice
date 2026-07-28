import { Injectable, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { RadioRelayLinksOperator } from '@pages/coverage-areas/domain/enums/radio-relay-links/radio-relay-links-operator.enum';
import { RadioRelayLinksFrequency } from '@pages/coverage-areas/domain/enums/radio-relay-links/radio-relay-links-frequency.enum';

export interface RadioRelayLinksFilterControl {
    search?: FormControl<string | null>;
    operator?: FormControl<RadioRelayLinksOperator | null>;
    frequency?: FormControl<RadioRelayLinksFrequency | null>;
    startDate?: FormControl<Date | null>;
    endDate?: FormControl<Date | null>;
}

@Injectable()
export class RadioRelayLinksFilterStore {
    private readonly fb = inject(FormBuilder);

    readonly form: FormGroup<RadioRelayLinksFilterControl> = this.createForm();

    get value(): any {
        return this.form.getRawValue();
    }

    reset(): void {
        this.form.reset();
    }

    private createForm(): FormGroup<RadioRelayLinksFilterControl> {
        return this.fb.group<RadioRelayLinksFilterControl>({
            search: new FormControl<string | null>(null),
            operator: new FormControl<RadioRelayLinksOperator | null>(null),
            frequency: new FormControl<RadioRelayLinksFrequency | null>(null),
            startDate: new FormControl<Date | null>(null),
            endDate: new FormControl<Date | null>(null),
        });
    }
}
