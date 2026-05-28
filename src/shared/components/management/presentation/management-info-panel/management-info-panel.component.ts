import { CommonModule } from '@angular/common';
import {
    Component,
    input,
    computed,
    ChangeDetectionStrategy,
    output,
    inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FilterOption } from '@shared/components/filter/filter.types';
import { LocationCoordinates } from '@shared/components/location-picker/models/location-coordinates.model';
import { LocationPickerDialogComponent } from '@shared/components/location-picker/ui/location-picker-dialog.component';
import { ManagementFormControl } from '@shared/components/management/domain/controls/management-form-control';
import { operatorsTagStyle } from '@shared/domain/functions/operators-tag-style.function';
import { Coordinates } from '@shared/domain/interfaces/coordinates.interface';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

import { ManagementEntityType } from '../../domain/types/management-entity.type';
import { ManagementFormStore } from '../store/management-form.store';

@Component({
    selector: 'app-management-info-panel',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SkeletonModule,
        TranslateModule,
        InputTextModule,
        InputGroupModule,
        InputGroupAddonModule,
        SelectModule,
        MultiSelectModule,
        ButtonModule,
        TagModule,
        TooltipModule,
        DynamicDialogModule,
    ],
    providers: [DialogService],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './management-info-panel.component.html',
    styleUrls: ['./management-info-panel.component.scss'],
})
export class ManagementInfoPanelComponent {
    public readonly store = inject(ManagementFormStore);
    private readonly dialogService = inject(DialogService);
    public readonly item = input.required<ManagementEntityType>();
    public readonly loading = input.required<boolean>();

    public readonly copyClicked = output<string>();
    readonly coordinatesSignal = toSignal(
        this.store.form.controls.coordinates.valueChanges,
        {
            initialValue: this.store.form.controls.coordinates.value,
        }
    );

    readonly coordinates = computed(() => {
        const coords = this.coordinatesSignal();

        if (coords === null) {
            return '';
        }

        const fallback = this.item()?.location?.coordinates;
        const finalCoords = coords ?? fallback;

        return finalCoords
            ? `${finalCoords.latitude}, ${finalCoords.longitude}`
            : '';
    });

    protected readonly formErrors = computed(() => this.store.formErrors());

    protected readonly hasErrors = computed(() => this.store.hasErrors());

    protected onCopyCoordinates(): void {
        const coords = this.coordinates();
        if (coords) {
            this.copyClicked.emit(coords);
        }
    }

    protected getOperatorTagStyle(operator: string): Record<string, string> {
        return operatorsTagStyle(operator);
    }

    protected isFieldInvalid(fieldName: keyof ManagementFormControl): boolean {
        const control = this.store.form.get(fieldName);
        return !!(control?.invalid && control?.touched);
    }

    protected isApprovalType(value: 'edit' | 'callback' | 'view'): boolean {
        return this.store.isApprovalType(value);
    }

    public readonly submitting = input<boolean>(false);
    public readonly submitLabel = input.required<string>();
    public readonly showApprovalSection = input<boolean>(false);
    public readonly reportTypeOptions = input<FilterOption[]>([]);
    public readonly telecomOperatorsOptions = input<FilterOption[]>([]);
    public readonly locationNameOptions = input<FilterOption[]>([]);

    protected shouldShowCallbackTypeField =
        this.store.shouldShowCallbackTypeField;

    public openLocationPicker(): void {
        if (!this.dialogService) {
            return;
        }
        const ref = this.dialogService.open(LocationPickerDialogComponent, {
            header: 'Sélectionner une position sur la carte',
            width: this.isMobile() ? '100vw' : '90vw',
            height: this.isMobile() ? '100vh' : 'auto',
            maximizable: true,
            draggable: false,
            closable: true,
            data: { initialCoords: this.initialCoords },
            styleClass: 'location-picker-dialog',
        });
        ref?.onClose.subscribe((result: LocationCoordinates | null) => {
            console.log('result: ', result);
            if (result) {
                this.store.setCoordinates(result);
            }
        });
    }
    private get initialCoords(): Coordinates | null {
        const coordinatesControl = this.store.form.controls.coordinates;
        if (coordinatesControl.value) {
            return coordinatesControl.value;
        }
        return this.item()?.location?.coordinates ?? null;
    }
    private isMobile(): boolean {
        return window.innerWidth <= 992;
    }
}
