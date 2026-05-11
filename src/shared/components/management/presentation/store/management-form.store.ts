import { Injectable, inject, signal, effect, computed } from '@angular/core';
import {
    FormGroup,
    FormBuilder,
    FormControl,
    Validators,
} from '@angular/forms';
import { ManagementFormControl } from '@shared/components/management/domain/controls/management-form-control';
import { ManagementEntityType } from '@shared/components/management/domain/types/management-entity.type';
import { Coordinates } from '@shared/domain/interfaces/coordinates.interface';
import { MediaValue } from '@shared/domain/types/media.types';

@Injectable({ providedIn: 'root' })
export class ManagementFormStore {
    private readonly fb = inject(FormBuilder);
    readonly item = signal<ManagementEntityType | null>(null);

    readonly form: FormGroup<ManagementFormControl> = this.createForm();

    readonly approvalType = signal<'edit' | 'callback' | 'view' | ''>('view');
    readonly decision = signal<'accepted' | 'rejected' | ''>('');
    private readonly imageError = signal<string | null>(null);

    readonly isEditMode = signal(false);
    readonly imageFile = signal<File | string | null>(null);

    readonly shouldShowCallbackTypeField = computed(
        () => this.approvalType() === 'callback'
    );

    readonly shouldShowDetailsTypeField = computed(
        () => this.approvalType() === 'view'
    );

    readonly shouldShowReasonField = computed(
        () => this.decision() === 'rejected'
    );

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

    public readonly imageErrorMessage = computed(() => this.imageError());
    public readonly hasImage = computed(() => !!this.imageFile());

    setItem(item: ManagementEntityType): void {
        this.item.set(item);
    }

    private createForm(): FormGroup<ManagementFormControl> {
        return this.fb.nonNullable.group<ManagementFormControl>({
            approvalType: new FormControl<string>('view', {
                nonNullable: true,
            }),
            callbackType: new FormControl<string>('', { nonNullable: true }),
            coordinates: new FormControl<Coordinates | null>(null),
            locationName: new FormControl<string>('', { nonNullable: true }),
            reportType: new FormControl<string>('', { nonNullable: true }),
            description: new FormControl<string>('', { nonNullable: true }),
            operators: new FormControl<string[]>([], { nonNullable: true }),
            decision: new FormControl<string>('', { nonNullable: true }),
            placeDescription: new FormControl<string>('', {
                nonNullable: true,
            }),
            reason: new FormControl<string>('', { nonNullable: true }),
            placePhoto: new FormControl<MediaValue | null>(null),
            comment: new FormControl<string>('', { nonNullable: true }),
        });
    }

    private readonly syncApprovalType = effect((onCleanup) => {
        const control = this.form.get('approvalType');
        if (!control) {
            return;
        }

        this.approvalType.set(control.value as any);

        const sub = control.valueChanges.subscribe((value) => {
            this.approvalType.set(value as any);
        });

        onCleanup(() => sub.unsubscribe());
    });

    readonly formStatus = signal(this.form.status);

    private readonly syncFormStatus = effect((onCleanup) => {
        const sub = this.form.statusChanges.subscribe((status) => {
            this.formStatus.set(status);
        });

        onCleanup(() => sub.unsubscribe());
    });

    private readonly syncDecision = effect((onCleanup) => {
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

    private readonly hydrateForm = effect(() => {
        const item = this.item();
        const mode = this.approvalType();
        const isEditable = mode === 'edit' || mode === 'callback';

        if (!item || isEditable) {
            return;
        }

        this.form.patchValue({
            coordinates: {
                latitude: item.location.coordinates.latitude,
                longitude: item.location.coordinates.longitude,
            },
            locationName: item.location?.name ?? '',
            reportType: item.reportTypeKey ?? '',
            description: item.description ?? '',
            placeDescription: item.placeDescription ?? '',
            operators: item.operatorsKey ?? [],
        });

        this.handleExistingImage(item.placePhoto);
    });

    private handleExistingImage(url: string): void {
        const mediaValue: MediaValue = {
            type: 'remote',
            url: url,
        };
        this.imageFile.set(url);
        this.form.controls.placePhoto.setValue(mediaValue, {
            emitEvent: false,
        });
    }

    private readonly conditionalState = effect(() => {
        const approvalType = this.approvalType();
        const decision = this.decision();

        const callbackControl = this.form.get('callbackType');
        const reasonControl = this.form.get('reason');

        const requiredFields = [
            'coordinates',
            'locationName',
            'reportType',
            'description',
            'operators',
            'placeDescription',
            'placePhoto',
            'comment',
        ] as const;

        const callbackRequiredFields = [
            'callbackType',
            ...requiredFields,
        ] as const;

        if (!callbackControl || !reasonControl) {
            return;
        }

        if (approvalType !== 'callback') {
            callbackControl.reset('');
            callbackControl.clearValidators();
            callbackControl.disable();
        } else {
            callbackControl.enable();
        }

        if (decision === 'accepted') {
            reasonControl.setValue('', { emitEvent: false });
            reasonControl.clearValidators();
            reasonControl.disable({ emitEvent: false });
        } else if (decision === 'rejected') {
            reasonControl.enable({ emitEvent: false });
            reasonControl.setValidators([Validators.required]);
        }

        ['callbackType', ...requiredFields].forEach((field) => {
            const control = this.form.get(field);
            control?.clearValidators();
        });

        if (decision === 'accepted') {
            const fieldsToRequire =
                approvalType === 'callback'
                    ? callbackRequiredFields
                    : approvalType === 'edit'
                      ? requiredFields
                      : [];

            fieldsToRequire.forEach((field) => {
                const control = this.form.get(field);
                control?.setValidators([Validators.required]);
                control?.updateValueAndValidity({ emitEvent: false });
            });
        }

        callbackControl.updateValueAndValidity({ emitEvent: false });
        reasonControl.updateValueAndValidity({ emitEvent: false });
    });

    public setApprovalType(type: 'edit' | 'callback' | 'view'): void {
        this.form.patchValue({ approvalType: type });
    }

    public setCoordinates(coordinates: Coordinates): void {
        this.form.patchValue({
            coordinates,
        });
    }

    public setDecision(decision: 'accepted' | 'rejected'): void {
        this.form.patchValue({ decision });
    }

    public getSubmitValue(uniqId: string): any {
        const raw = this.form.getRawValue();

        const basePayload = {
            ...raw,
            image: this.transformImageForApi(raw.placePhoto),
        };

        return { ...basePayload, uniqId };
    }

    private transformImageForApi(
        image: MediaValue | null
    ): string | File | null {
        if (!image) {
            return null;
        }

        return image.type === 'remote' ? image.url : image.file;
    }

    public setImage(file: File): void {
        const mediaValue: MediaValue = {
            type: 'local',
            file: file,
        };
        this.imageFile.set(file);
        this.form.controls.placePhoto.setValue(mediaValue);
        this.form.controls.placePhoto.markAsTouched();
        this.imageError.set(null);
    }

    public resetImage(): void {
        this.imageFile.set(null);
        this.form.controls.placePhoto.reset(null);
    }

    public resetForm(): void {
        this.form.reset();
        this.approvalType.set('');
        this.decision.set('');
        this.imageFile.set(null);
        this.imageError.set(null);
        this.form.enable({ emitEvent: false });
    }

    public isApprovalType(value: 'edit' | 'callback' | 'view'): boolean {
        return this.approvalType() === value;
    }
}
