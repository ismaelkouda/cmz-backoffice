import {
    Injectable,
    inject,
    signal,
    computed,
    effect,
    untracked,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MobileNetworkFindOneFacade } from '@pages/coverage-areas/application/services/mobile-network/mobile-network-find-one.facade';
import { MobileNetworkFormControl } from '@pages/coverage-areas/presentation/store/mobile-network/mobile-network-form.control';
import { Operator } from '@pages/coverage-areas/domain/enums/mobile-network/mobile-network-operator.enum';
import { startWith } from 'rxjs';
type FormMode = 'create' | 'edit' | 'details';

@Injectable()
export class MobileNetworkFormStore {
    private readonly fb = inject(FormBuilder);

    private readonly findOneFacade = inject(MobileNetworkFindOneFacade);

    readonly form = this.createForm();

    readonly mode = signal<FormMode>('create');

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

    readonly isValid = computed(() => {
        return this.status() === 'VALID';
    });

    private readonly item = this.findOneFacade.items;

    constructor() {
        this.initializeDetailsModeEffect();
    }

    private createForm(): FormGroup<MobileNetworkFormControl> {
        return this.fb.nonNullable.group<MobileNetworkFormControl>({
            siteId: new FormControl<string | undefined>(undefined, {
                nonNullable: true,
                validators: [Validators.required],
            }),

            siteName: new FormControl<string | undefined>(undefined, {
                nonNullable: true,
                validators: [Validators.required],
            }),

            siteGroupId: new FormControl<string | number | undefined>(
                undefined,
                {
                    nonNullable: true,
                    validators: [Validators.required],
                }
            ),

            towerTypeId: new FormControl<string | number | undefined>(
                undefined,
                {
                    nonNullable: true,
                    validators: [Validators.required],
                }
            ),

            towerHeight: new FormControl<string | undefined>(undefined, {
                nonNullable: true,
                validators: [Validators.required],
            }),

            networkTechnology: new FormControl<string | undefined>(undefined, {
                nonNullable: true,
                validators: [Validators.required],
            }),

            operator: new FormControl<Operator | undefined>(undefined, {
                nonNullable: true,
                validators: [Validators.required],
            }),

            coverageRadius: new FormControl<number | undefined>(undefined, {
                nonNullable: true,
            }),
        });
    }

    private initializeDetailsModeEffect(): void {
        effect(() => {
            const item = this.item();
            if (this.isCreateMode() || !item) {
                return;
            }

            const {
                siteId,
                siteName,
                siteGroupId,
                towerTypeId,
                towerHeight,
                networkTechnology,
                operator,
                coverageRadius,
            } = item;
            const details = this.isDetailsMode();

            untracked(() => {
                queueMicrotask(() => {
                    this.form.patchValue({
                        siteId,
                        siteName,
                        siteGroupId,
                        towerTypeId,
                        towerHeight,
                        networkTechnology,
                        operator,
                        coverageRadius,
                    });
                    if (details) {
                        this.form.disable({ emitEvent: false });
                    }
                });
            });
        });
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
                siteId: undefined,
                siteName: undefined,
                siteGroupId: undefined,
                towerTypeId: undefined,
                towerHeight: undefined,
                networkTechnology: undefined,
                operator: undefined,
                coverageRadius: undefined,
            },
            {
                emitEvent: true,
            }
        );
        this.mode.set('create');
        this.form.markAsPristine();
        this.form.markAsUntouched();
    }
}
