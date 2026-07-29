import {
    Injectable,
    computed,
    effect,
    inject,
    signal,
    untracked,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { RadioRelayLinksOperator } from '@pages/coverage-areas/domain/enums/radio-relay-links/radio-relay-links-operator.enum';
import { RadioRelayLinksFrequency } from '@pages/coverage-areas/domain/enums/radio-relay-links/radio-relay-links-frequency.enum';
import { RadioRelayLinksFormValidatorsService } from '@pages/coverage-areas/presentation/constants/radio-relay-links-form-validators.constants';
import { FormValidators } from '@presentation/pages/coverage-areas/domain/validators/form-validators';
import { startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { RadioRelayLinksFindOneFacade } from '@presentation/pages/coverage-areas/application/services/radio-relay-links/radio-relay-links-find-one.facade';
import { RadioRelayLinksFormControl } from './radio-relay-links-form.control';

type FormMode = 'create' | 'edit' | 'details';

@Injectable()
export class RadioRelayLinksFormStore {
    private readonly fb = inject(FormBuilder);
    private readonly findOneFacade = inject(RadioRelayLinksFindOneFacade);
    readonly VALIDATION = FormValidators;
    readonly form = this.createForm();

    private readonly item = this.findOneFacade.items;

    readonly mode = signal<FormMode>('create');
    readonly isValid = computed(() => this.status() === 'VALID');
    readonly isCreateMode = computed(() => this.mode() === 'create');
    readonly isEditMode = computed(() => this.mode() === 'edit');
    readonly isDetailsMode = computed(() => this.mode() === 'details');

    readonly loading = computed(() => {
        return this.findOneFacade.loading();
    });

    readonly status = toSignal(
        this.form.statusChanges.pipe(startWith(this.form.status)),
        {
            initialValue: this.form.status,
        }
    );

    public readonly vm = computed(() => ({
        item: this.item(),
    }));

    constructor() {
        this.initializeDetailsModeEffect();
    }

    get value(): any {
        return this.form.getRawValue();
    }

    get valid(): boolean {
        return this.form.valid;
    }

    private load(uniqId: string): void {
        this.findOneFacade.read({ uniqId }, { forceRefresh: true });
    }

    setMode(uniqId: string | null, mode: FormMode): void {
        this.mode.set(mode);
        const handlers: Record<FormMode, () => void> = {
            create: () => {
                this.reset();
                this.findOneFacade.reset();
            },
            edit: () => uniqId && this.load(uniqId),
            details: () => uniqId && this.load(uniqId),
        };
        handlers[mode]();
    }

    reset(): void {
        this.form.enable({ emitEvent: false });
        this.form.reset(
            {
                name: undefined,
                operator: undefined,
                frequency: undefined,
            },
            { emitEvent: true }
        );
        this.mode.set('create');
        this.form.markAsPristine();
        this.form.markAsUntouched();
    }

    private initializeDetailsModeEffect(): void {
        effect(() => {
            const item = this.item();
            if (this.isCreateMode() || !item) {
                return;
            }

            const { name, operator, frequency } = item;
            const details = this.isDetailsMode();

            untracked(() => {
                queueMicrotask(() => {
                    this.form.patchValue({
                        name,
                        operator,
                        frequency,
                    });
                    if (details) {
                        this.form.disable({ emitEvent: false });
                    }
                });
            });
        });
    }

    private createForm(): FormGroup<RadioRelayLinksFormControl> {
        return this.fb.nonNullable.group<RadioRelayLinksFormControl>({
            name: new FormControl<string | undefined>(undefined, {
                nonNullable: true,
                validators: RadioRelayLinksFormValidatorsService.NAME,
            }),
            operator: new FormControl<RadioRelayLinksOperator | undefined>(
                undefined,
                {
                    nonNullable: true,
                    validators: RadioRelayLinksFormValidatorsService.OPERATOR,
                }
            ),
            frequency: new FormControl<RadioRelayLinksFrequency | undefined>(
                undefined,
                {
                    nonNullable: true,
                    validators: RadioRelayLinksFormValidatorsService.FREQUENCY,
                }
            ),
        });
    }
}
