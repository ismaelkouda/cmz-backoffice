import { NgModule } from '@angular/core';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { FieldsetModule } from 'primeng/fieldset';
import { FileUploadModule } from 'primeng/fileupload';
import { ImageModule } from 'primeng/image';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { PaginatorModule } from 'primeng/paginator';
import { PasswordModule } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { SliderModule } from 'primeng/slider';
import { SplitButtonModule } from 'primeng/splitbutton';
import { EditableRow, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { TreeModule } from 'primeng/tree';

@NgModule({
    imports: [
        PaginatorModule,
        MultiSelectModule,
        PasswordModule,
        DialogModule,
        BadgeModule,
        TooltipModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        ProgressSpinnerModule,
        InputNumberModule,
        InputMaskModule,
        CheckboxModule,
        RadioButtonModule,
        SplitButtonModule,
        ToolbarModule,
        ConfirmDialogModule,
        DynamicDialogModule,
        FieldsetModule,
        TreeModule,
        ImageModule,
        SkeletonModule,
        SliderModule,
        FileUploadModule,
        TagModule,
        SelectModule,
        SelectButtonModule,
    ],
    exports: [
        PaginatorModule,
        MultiSelectModule,
        PasswordModule,
        DialogModule,
        BadgeModule,
        TooltipModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        ProgressSpinnerModule,
        InputNumberModule,
        InputMaskModule,
        CheckboxModule,
        RadioButtonModule,
        SplitButtonModule,
        ToolbarModule,
        ConfirmDialogModule,
        DynamicDialogModule,
        FieldsetModule,
        TreeModule,
        ImageModule,
        SkeletonModule,
        SliderModule,
        FileUploadModule,
        TagModule,
        SelectModule,
        SelectButtonModule,
    ],
    providers: [EditableRow],
})
export class PrimengModule {}
