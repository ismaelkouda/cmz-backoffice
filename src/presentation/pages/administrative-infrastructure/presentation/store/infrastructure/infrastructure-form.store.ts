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
import { InfrastructureFindOneFacade } from '@pages/administrative-infrastructure/application/services/infrastructure/infrastructure-find-one.facade';
import { InfrastructureFormControl } from '@presentation/pages/administrative-infrastructure/presentation/store/infrastructure/infrastructure-form.control';
import { FormValidators } from '@pages/administrative-infrastructure/domain/validators/form-validators';
import { startWith } from 'rxjs';
import { InfrastructureTypeSelectFacade } from '@presentation/pages/administrative-infrastructure/application/services/infrastructure-type/infrastructure-type-select.facade';
import { Coordinates } from '@shared/domain/interfaces/coordinates.interface';
import { GeoLocation } from '@shared/components/location-picker/domain/models/geo-location.model';
type FormMode = 'create' | 'edit' | 'details';

@Injectable()
export class InfrastructureFormStore {
    private readonly fb = inject(FormBuilder);
    private readonly findOneFacade = inject(InfrastructureFindOneFacade);
    private readonly infrastructureTypeFacade = inject(
        InfrastructureTypeSelectFacade
    );
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

    private readonly infrastructureType = toSignal(
        this.infrastructureTypeFacade.items$,
        {
            initialValue: [],
        }
    );
    private readonly infrastructureTypeLoading = toSignal(
        this.infrastructureTypeFacade.isLoading$,
        {
            initialValue: false,
        }
    );
    readonly position = toSignal(this.form.controls.position.valueChanges, {
        initialValue: this.form.controls.position.value,
    });

    readonly coordinates = computed(() => {
        const coords = this.position();
        if (!coords) {
            return '';
        }
        return `${coords.latitude}, ${coords.longitude}`;
    });

    public setCoordinates(position: GeoLocation): void {
        this.form.controls.position.setValue({
            longitude: Number(position.lng),
            latitude: Number(position.lat),
            what3words: undefined,
        });
    }

    public readonly vm = computed(() => ({
        item: this.item(),
        position: this.coordinates(),
        infrastructureTypeLoading: this.infrastructureTypeLoading(),
        infrastructureType: this.infrastructureType(),
    }));

    constructor() {
        this.initializeDetailsModeEffect();
    }

    private createForm(): FormGroup<InfrastructureFormControl> {
        return this.fb.nonNullable.group<InfrastructureFormControl>({
            name: new FormControl<string | undefined>(undefined, {
                nonNullable: true,
                validators: [Validators.required],
            }),
            type: new FormControl<string | undefined>(undefined, {
                nonNullable: true,
                validators: [Validators.required],
            }),
            description: new FormControl<string | undefined>(undefined, {
                nonNullable: true,
                validators: [Validators.required],
            }),
            position: new FormControl<Coordinates | undefined>(undefined, {
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
            const { name, type, description, position } = item;
            const details = this.isDetailsMode();
            untracked(() => {
                queueMicrotask(() => {
                    this.form.patchValue({ name, type, description, position });
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
        this.infrastructureTypeFacade.readAll({ forceRefresh: true });
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
        this.form.reset();
    }
}
