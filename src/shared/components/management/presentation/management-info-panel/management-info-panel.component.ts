import { CommonModule } from '@angular/common';
import {
    Component,
    input,
    computed,
    ChangeDetectionStrategy,
    output,
    inject,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FilterOption } from '@shared/components/filter/filter.types';
import { LocationCoordinates } from '@shared/components/location-picker/models/location-coordinates.model';
import { LocationPickerDialogComponent } from '@shared/components/location-picker/ui/location-picker-dialog.component';
import { formatCoordinatesString } from '@shared/components/location-picker/utils/coordinates.utils';
import { ManagementFormControl } from '@shared/components/management/domain/controls/management-form-control';
import { operatorsTagStyle } from '@shared/domain/functions/operators-tag-style.function';
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
    private readonly store = inject(ManagementFormStore);
    private readonly dialogService = inject(DialogService);
    public readonly item = input.required<ManagementEntityType>();
    public readonly loading = input.required<boolean>();

    public readonly copyClicked = output<string>();
    protected readonly coordinates = computed((): string => {
        const currentItem = this.item();
        if (!currentItem?.location?.coordinates) {
            return '';
        }

        const { latitude, longitude } = currentItem.location.coordinates;
        return latitude && longitude ? `${latitude}, ${longitude}` : '';
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

    protected isManagementType(
        value: 'edit' | 'callback' | 'details'
    ): boolean {
        return this.store.isManagementType(value);
    }

    public readonly submitting = input<boolean>(false);
    public readonly submitLabel = input.required<string>();
    public readonly showApprovalSection = input<boolean>(false);
    public readonly reportTypeOptions = input<FilterOption[]>([]);
    public readonly telecomOperatorsOptions = input<FilterOption[]>([]);
    public readonly locationNameOptions = input<FilterOption[]>([]);

    protected shouldShowCallbackTypeField =
        this.store.shouldShowCallbackTypeField;
    protected isFormValid = this.store.isFormValid;

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
            data: { initialCoords: this.item()?.location?.coordinates },
            styleClass: 'location-picker-dialog',
        });
        ref?.onClose.subscribe((result: LocationCoordinates | null) => {
            if (result) {
                console.log('result: ', result);
                const coordinatesString = formatCoordinatesString(
                    result.lat,
                    result.lng
                );
                this.store.setCoordinates(coordinatesString);
            }
        });
    }
    private isMobile(): boolean {
        return window.innerWidth <= 992;
    }
}
