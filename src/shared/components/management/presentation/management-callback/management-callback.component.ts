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
import { ManagementFormControl } from '@shared/components/management/domain/controls/management-form-control';
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
    selector: 'app-management-callback',
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
    templateUrl: './management-callback.component.html',
    styleUrls: ['./management-callback.component.scss'],
})
export class ManagementCallbackComponent {
    private readonly store = inject(ManagementFormStore);
    public readonly item = input.required<ManagementEntityType>();
    public readonly loading = input.required<boolean>();

    public readonly approvalTypeChange = output<string>();

    protected readonly formErrors = computed(() => this.store.formErrors());

    protected readonly hasErrors = computed(() => this.store.hasErrors());

    protected isFieldInvalid(fieldName: keyof ManagementFormControl): boolean {
        const control = this.store.form.get(fieldName);
        return !!(control?.invalid && control?.touched);
    }

    protected isApprovalType(value: 'edit' | 'callback' | 'view'): boolean {
        return this.store.isApprovalType(value);
    }

    protected onApprovalTypeChange(
        approvalType: 'edit' | 'callback' | 'view'
    ): void {
        this.store.setApprovalType(approvalType);
        this.approvalTypeChange.emit(approvalType);
    }

    public readonly submitting = input<boolean>(false);
    public readonly showApprovalSection = input<boolean>(false);
    public readonly callbackTypeOptions = input<FilterOption[]>([]);

    protected shouldShowCallbackTypeField =
        this.store.shouldShowCallbackTypeField;
}
