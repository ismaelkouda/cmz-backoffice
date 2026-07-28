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
import { OpticalFiberNetworkFindOneFacade } from '@pages/coverage-areas/application/services/optical-fiber-network/optical-fiber-network-find-one.facade';
import { OpticalFiberNetworkFormControl } from '@pages/coverage-areas/presentation/store/optical-fiber-network/optical-fiber-network-form.control';
import { Operator } from '@pages/coverage-areas/domain/enums/optical-fiber-network/optical-fiber-network-operator.enum';
import { FiberType } from '@pages/coverage-areas/domain/enums/optical-fiber-network/optical-fiber-network-type.enum';
import { startWith } from 'rxjs';

type FormMode = 'create' | 'edit' | 'details';

@Injectable()
export class OpticalFiberNetworkFormStore {
    private readonly fb = inject(FormBuilder);
    private readonly findOneFacade = inject(OpticalFiberNetworkFindOneFacade);

    readonly form = this.createForm();
    readonly mode = signal<FormMode>('create');
    readonly isCreateMode = computed(() => this.mode() === 'create');
    readonly isEditMode = computed(() => this.mode() === 'edit');
    readonly isDetailsMode = computed(() => this.mode() === 'details');
    readonly loading = computed(() => this.findOneFacade.loading());
    readonly status = toSignal(
        this.form.statusChanges.pipe(startWith(this.form.status)),
        { initialValue: this.form.status }
    );
    readonly isValid = computed(() => this.status() === 'VALID');
    private readonly item = this.findOneFacade.items;
    readonly existingGeom = signal<object | string | null>(null);

    constructor() {
        this.initializeDetailsModeEffect();
    }

    private createForm(): FormGroup<OpticalFiberNetworkFormControl> {
        return this.fb.nonNullable.group<OpticalFiberNetworkFormControl>({
            name: new FormControl<string | undefined>(undefined, {
                nonNullable: true,
                validators: [Validators.required],
            }),
            operator: new FormControl<Operator | undefined>(undefined, {
                nonNullable: true,
                validators: [Validators.required],
            }),
            fiberConstructorId: new FormControl<string | undefined>(undefined, {
                nonNullable: true,
                validators: [Validators.required],
            }),
            type: new FormControl<FiberType | undefined>(undefined, {
                nonNullable: true,
                validators: [Validators.required],
            }),
            geomFile: new FormControl<File | null>(null, {
                nonNullable: true,
                validators: [Validators.required],
            }),
        });
    }

    private initializeDetailsModeEffect(): void {
        effect(() => {
            const item = this.item();
            if (this.isCreateMode() || !item) {
                return;
            }

            const { name, operator, fiberConstructorId, type, geom, geomUrl } =
                item;
            const details = this.isDetailsMode();

            untracked(() => {
                queueMicrotask(() => {
                    this.form.patchValue({
                        name,
                        operator,
                        fiberConstructorId,
                        type,
                        geomFile: null,
                    });
                    this.existingGeom.set(geom ?? geomUrl ?? null);
                    this.form.controls.geomFile.clearValidators();
                    this.form.controls.geomFile.updateValueAndValidity({
                        emitEvent: false,
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
        this.form.controls.geomFile.setValidators([Validators.required]);
        this.form.reset(
            {
                name: undefined,
                operator: undefined,
                fiberConstructorId: undefined,
                type: undefined,
                geomFile: null,
            },
            { emitEvent: true }
        );
        this.existingGeom.set(null);
        this.mode.set('create');
        this.form.markAsPristine();
        this.form.markAsUntouched();
    }
}
