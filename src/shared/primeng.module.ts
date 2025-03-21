import { NgModule } from "@angular/core";
import { PasswordModule } from "primeng/password";
import { BadgeModule } from "primeng/badge";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { EditableRow, TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { DropdownModule } from "primeng/dropdown";
import { CalendarModule } from "primeng/calendar";
import { TooltipModule } from "primeng/tooltip";
import { DialogModule } from "primeng/dialog";
import { MultiSelectModule } from "primeng/multiselect";
import { PaginatorModule } from 'primeng/paginator';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from "primeng/inputtextarea";
import { TabViewModule } from "primeng/tabview";
import { InputMaskModule } from "primeng/inputmask";
import { RadioButtonModule } from "primeng/radiobutton";
import { CheckboxModule } from "primeng/checkbox";
import { InputSwitchModule } from "primeng/inputswitch";
import { SplitButtonModule } from "primeng/splitbutton";
import { ToolbarModule } from "primeng/toolbar";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { FieldsetModule } from "primeng/fieldset";
import { DynamicDialogModule } from "primeng/dynamicdialog";
import { TreeModule } from "primeng/tree";
import { ImageModule } from 'primeng/image';
import { SkeletonModule } from 'primeng/skeleton';
import { SliderModule } from 'primeng/slider';
// import { SharedModule } from "primeng/api";
import { FileUploadModule } from 'primeng/fileupload';
import { TagModule } from 'primeng/tag';
import { MessageModule } from 'primeng/message';

@NgModule({
    imports: [
        PaginatorModule,
        MultiSelectModule,
        PasswordModule,
        DialogModule,
        BadgeModule,
        TooltipModule,
        CalendarModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        DropdownModule,
        ProgressSpinnerModule,
        InputNumberModule,
        InputTextareaModule,
        TabViewModule,
        InputMaskModule,
        CheckboxModule,
        RadioButtonModule,
        InputSwitchModule,
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
        // SharedModule,
        TagModule,
        MessageModule
    ],
    exports: [
        PaginatorModule,
        MultiSelectModule,
        PasswordModule,
        DialogModule,
        BadgeModule,
        TooltipModule,
        CalendarModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        DropdownModule,
        ProgressSpinnerModule,
        InputNumberModule,
        InputTextareaModule,
        TabViewModule,
        InputMaskModule,
        CheckboxModule,
        RadioButtonModule,
        InputSwitchModule,
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
        // SharedModule,
        TagModule,
        MessageModule
    ],
    providers: [EditableRow]
})

export class PrimengModule {

}