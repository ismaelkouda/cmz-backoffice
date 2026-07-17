import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { Technology } from '@pages/coverage-areas/domain/enums/mobile-network/mobile-network-technology.enum';
import { Operator } from '@pages/coverage-areas/domain/enums/mobile-network/mobile-network-operator.enum';
import { MobileNetworkFilterDto } from '@pages/coverage-areas/application/dto/mobile-network/mobile-network-filter.dto';
import { MobileNetworkFacade } from '@pages/coverage-areas/application/services/mobile-network/mobile-network.facade';
import { MobileNetworkFilterControl } from '@pages/coverage-areas/presentation/store/mobile-network/mobile-network-filter.control';
import { FormValidators } from '@pages/coverage-areas/domain/validators/form-validators';

@Injectable()
export class MobileNetworkFilterStore {
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(MobileNetworkFacade);

    private readonly currentFilter = toSignal(this.facade.currentFilter$, {
        initialValue: null,
    });

    readonly form: FormGroup<MobileNetworkFilterControl> =
        this.fb.group<MobileNetworkFilterControl>({
            search: new FormControl<string | undefined>(undefined, {
                nonNullable: true,
            }),
            towerTypeId: new FormControl<string | undefined>(undefined, {
                nonNullable: true,
            }),
            towerSize: new FormControl<number | undefined>(undefined, {
                nonNullable: true,
                validators: [
                    Validators.pattern(FormValidators.DECIMAL.PATTERN),
                ],
            }),
            technology: new FormControl<Technology | undefined>(undefined, {
                nonNullable: true,
            }),
            operator: new FormControl<Operator | undefined>(undefined, {
                nonNullable: true,
            }),
            radius: new FormControl<number | undefined>(undefined, {
                nonNullable: true,
                validators: [
                    Validators.pattern(FormValidators.DECIMAL.PATTERN),
                ],
            }),
            startDate: new FormControl<Date | undefined>(undefined, {
                nonNullable: true,
            }),

            endDate: new FormControl<Date | undefined>(undefined, {
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

    get value(): MobileNetworkFilterDto {
        const raw = this.form.getRawValue();

        return {
            search: raw.search || undefined,
            towerTypeId: raw.towerTypeId || undefined,
            towerSize: this.toValidDecimal(
                raw.towerSize,
                this.form.get('towerSize')
            ),
            technology: raw.technology || undefined,
            operator: raw.operator || undefined,
            radius: this.toValidDecimal(raw.radius, this.form.get('radius')),
            startDate: raw.startDate || undefined,
            endDate: raw.endDate || undefined,
        };
    }

    private toValidDecimal(
        value: number | string | undefined,
        control: AbstractControl | null
    ): number | undefined {
        if (value === undefined || value === null || value === '') {
            return undefined;
        }
        if (control?.invalid) {
            return undefined;
        }
        const parsed = Number(value);
        return Number.isNaN(parsed) ? undefined : parsed;
    }
}
