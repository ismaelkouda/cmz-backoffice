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
import { SiteGroupFindOneFacade } from '@pages/coverage-areas/application/services/site-group/site-group-find-one.facade';
import { SiteGroupFormControl } from '@pages/coverage-areas/presentation/store/site-group/site-group-form.control';
import { FormValidators } from '@pages/coverage-areas/domain/validators/form-validators';
import { startWith } from 'rxjs';
type FormMode = 'create' | 'edit' | 'details';

@Injectable()
export class SiteGroupFormStore {
    private readonly fb = inject(FormBuilder);

    private readonly findOneFacade = inject(SiteGroupFindOneFacade);

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

    private createForm(): FormGroup<SiteGroupFormControl> {
        return this.fb.nonNullable.group<SiteGroupFormControl>({
            code: new FormControl<string | undefined>(undefined, {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.pattern(FormValidators.CODE.PATTERN),
                ],
            }),

            name: new FormControl<string | undefined>(undefined, {
                nonNullable: true,
                validators: [Validators.required],
            }),

            description: new FormControl<string | undefined>(undefined, {
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

            const { code, name, description } = item;
            const details = this.isDetailsMode();

            untracked(() => {
                queueMicrotask(() => {
                    this.form.patchValue({
                        code,
                        name,
                        description,
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
                code: undefined,
                name: undefined,
                description: undefined,
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
