import { Injectable, inject, signal, effect, computed } from '@angular/core';
import {
    FormGroup,
    FormBuilder,
    FormControl,
    Validators,
} from '@angular/forms';
import { ManagementFormControl } from '@shared/components/management/domain/controls/management-form-control';
import { Coordinates } from '@shared/domain/interfaces/coordinates.interface';

import { ManagementEntityType } from '../../domain/types/management-entity.type';

@Injectable()
export class ManagementFormStore {
    private readonly fb = inject(FormBuilder);
    readonly item = signal<ManagementEntityType | null>(null);

    readonly form: FormGroup<ManagementFormControl> = this.createForm();

    readonly managementType = signal<'edit' | 'callback' | 'details' | ''>(
        'details'
    );
    readonly decision = signal<'accepted' | 'rejected' | ''>('');

    readonly isEditMode = signal(false);

    readonly shouldShowCallbackTypeField = computed(
        () => this.managementType() === 'callback'
    );

    readonly shouldShowReasonField = computed(
        () => this.decision() === 'rejected'
    );

    readonly isFormValid = computed(() => this.form?.valid ?? false);

    readonly formErrors = computed((): Record<string, string[]> => {
        const errors: Record<string, string[]> = {};
        const form = this.form;

        if (!form) {
            return errors;
        }

        Object.keys(form.controls).forEach((key) => {
            const control = form.get(key);
            if (control?.errors) {
                errors[key] = Object.keys(control.errors);
            }
        });

        return errors;
    });

    readonly hasErrors = computed(
        () => Object.keys(this.formErrors()).length > 0
    );

    setItem(item: ManagementEntityType): void {
        this.item.set(item);
    }

    private createForm(): FormGroup<ManagementFormControl> {
        return this.fb.nonNullable.group<ManagementFormControl>({
            managementType: new FormControl<string>('details', {
                nonNullable: true,
            }),
            callbackType: new FormControl<string>('', { nonNullable: true }),
            coordinates: new FormControl<string>('', { nonNullable: true }),
            locationName: new FormControl<string>('', { nonNullable: true }),
            reportType: new FormControl<string>('', { nonNullable: true }),
            description: new FormControl<string>('', { nonNullable: true }),
            operators: new FormControl<string[]>([], { nonNullable: true }),
            decision: new FormControl<string>('', { nonNullable: true }),
            comment: new FormControl<string>('', { nonNullable: true }),
            reason: new FormControl<string>('', { nonNullable: true }),
        });
    }

    private readonly managementTypeSyncEffect = effect((onCleanup) => {
        const control = this.form.get('managementType');
        if (!control) {
            return;
        }

        this.managementType.set(control.value as any);

        const sub = control.valueChanges.subscribe((value) => {
            this.managementType.set(value as any);
        });

        onCleanup(() => sub.unsubscribe());
    });

    private readonly decisionSyncEffect = effect((onCleanup) => {
        const control = this.form.get('decision');
        if (!control) {
            return;
        }

        this.decision.set(control.value as any);

        const sub = control.valueChanges.subscribe((value) => {
            this.decision.set(value as any);
        });

        onCleanup(() => sub.unsubscribe());
    });

    private hydrated = false;

    private readonly hydrateFormEffect = effect(() => {
        const item = this.item();
        const mode = this.managementType();

        if (!item) {
            return;
        }

        const isEditable = mode === 'edit' || mode === 'callback';

        if (!isEditable) {
            this.hydrated = false;
            return;
        }

        if (this.hydrated) {
            return;
        }

        this.form.patchValue(
            {
                coordinates: item.location?.coordinates
                    ? `${item.location.coordinates.latitude}, ${item.location.coordinates.longitude}`
                    : '',
                locationName: item.location?.name ?? '',
                reportType: item.reportTypeKey ?? '',
                description: item.description ?? '',
                operators: item.operatorsKey ?? [],
            },
            { emitEvent: false }
        );

        this.hydrated = true;
    });

    private readonly conditionalStateEffect = effect(() => {
        const managementType = this.managementType();
        const decision = this.decision();

        const callbackControl = this.form.get('callbackType');
        const reasonControl = this.form.get('reason');

        if (!callbackControl || !reasonControl) {
            return;
        }

        if (managementType !== 'callback') {
            callbackControl.reset(null);
            callbackControl.disable();
        } else {
            callbackControl.enable();
            callbackControl.setValidators([Validators.required]);
        }

        if (decision === 'accepted') {
            reasonControl.setValue(null, { emitEvent: false });
            reasonControl.clearValidators();
            reasonControl.disable({ emitEvent: false });
        } else if (decision === 'rejected') {
            reasonControl.enable({ emitEvent: false });
            reasonControl.setValidators([Validators.required]);
        }

        callbackControl.updateValueAndValidity({ emitEvent: false });
        reasonControl.updateValueAndValidity({ emitEvent: false });
    });

    public setManagementType(type: 'edit' | 'callback' | 'details'): void {
        console.log('type: ', type);
        this.form.patchValue({ managementType: type });
        this.form.get('managementType')?.markAsTouched();
    }

    public setCoordinates(coordinates: Coordinates): void {
        this.form.patchValue({
            coordinates: `${coordinates.latitude}, ${coordinates.longitude}`,
        });
    }

    public setDecision(decision: 'accepted' | 'rejected'): void {
        this.form.patchValue({ decision });
        this.form.get('decision')?.markAsTouched();
    }

    public resetForm(): void {
        this.form.reset();
        this.managementType.set('');
        this.decision.set('');
        this.isEditMode.set(false);
        this.form.enable({ emitEvent: false });
    }

    public isManagementType(value: 'edit' | 'callback' | 'details'): boolean {
        return this.managementType() === value;
    }
}
