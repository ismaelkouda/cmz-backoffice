import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    effect,
    inject,
    input,
    output,
    signal,
} from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActionDropdownComponent } from '@shared/components/action-dropdown/action-dropdown.component';
import { SearchTableComponent } from '@shared/components/search-table/search-table.component';
import {
    TableButtonHeaderComponent,
    TableHeaderButton,
} from '@shared/components/table-button-header/table-button-header.component';
import { TableTitleComponent } from '@shared/components/table-title/table-title.component';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { ActionDropdown } from '@shared/domain/enums/action-dropdown.enum';
import { formatDate } from '@shared/domain/functions/format-data.function';
import { operatorsTagStyle } from '@shared/domain/functions/operators-tag-style.function';
import { SeparatorThousandsPipe } from '@shared/domain/pipes/separator-thousands.pipe';
import { TableConfig } from '@shared/domain/services/table-export-excel-file.service';
import { CrudFormType } from '@shared/domain/utils/crud-form-utils';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-table',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        BadgeModule,
        ButtonModule,
        TranslateModule,
        SearchTableComponent,
        TableButtonHeaderComponent,
        TableTitleComponent,
        ProgressSpinnerModule,
        TooltipModule,
        TagModule,
        ActionDropdownComponent,
        SeparatorThousandsPipe,
        CheckboxModule,
    ],
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent {
    public selectedItems: any[] = [];
    public readonly numberToCheck = signal<number>(0);
    private readonly clipboardService = inject(ClipboardService);
    private readonly toastService = inject(ToastrService);
    private readonly translate = inject(TranslateService);
    public readonly loading = input<boolean>(false);
    public readonly items = input<any[]>([]);
    public readonly pagination = input<Paginate<any> | null>(null);
    public readonly config = input.required<TableConfig>();
    public readonly hiddenButtonOther = input<boolean>(true);
    public readonly hiddenButtonExport = input<boolean>(false);
    public readonly hiddenButtonRefresh = input<boolean>(false);
    public readonly dataKey = input<string>('uniqId');
    public readonly headerButtons = input<TableHeaderButton[]>([]);
    public readonly selectionMode = input<'single' | 'multiple' | 'saisie'>(
        'single'
    );
    public readonly selection = input<any | any[] | null>(null);

    public readonly refreshRequested = output<undefined>();
    public readonly createRequested = output<{ ref: CrudFormType }>();
    public readonly editRequested = output<{ item: any; ref: CrudFormType }>();
    public readonly deleteRequested = output<{
        item: any;
        ref: CrudFormType;
    }>();
    public readonly enableRequested = output<{
        item: any;
        ref: CrudFormType;
    }>();
    public readonly disableRequested = output<{
        item: any;
        ref: CrudFormType;
    }>();
    public readonly selectionChange = output<any[]>();
    public readonly viewRequested = output<{ item: any; ref: CrudFormType }>();
    public readonly badgeClicked = output<{ item: any; col: any }>();
    public readonly actionClicked = output<any>();
    public readonly headerButtonClicked = output<string>();
    public readonly export = new EventEmitter<void>();

    constructor() {
        effect(() => {
            if (this.numberToCheck() > 0) {
                this.onNumberInputChange(this.numberToCheck());
            }
        });
    }

    public onRefresh(): void {
        this.selectedItems = [];
        this.refreshRequested.emit(undefined);
    }

    public onCreate(): void {
        this.createRequested.emit({ ref: CrudFormType.CREATE });
    }

    public onEdit(item: any): void {
        this.editRequested.emit({ item, ref: CrudFormType.EDIT });
    }

    public onDelete(item: any): void {
        this.deleteRequested.emit(item);
    }

    public onEnable(item: any): void {
        this.enableRequested.emit(item);
    }

    public onDisable(item: any): void {
        this.disableRequested.emit(item);
    }

    public onView(item: any): void {
        this.viewRequested.emit(item);
    }

    public onBadgeClick(item: any, col: any): void {
        this.badgeClicked.emit({ item, col });
    }

    public onActionClick(item: any, actionId?: string): void {
        this.actionClicked.emit({ item, actionId });
    }

    getTooltip(action: any, rowData: any): string {
        return `${this.translate.instant(action.tooltip)} 
            <span class="custom-tooltip">${rowData.actionsRef}</span>
        `;
    }

    public onNumberInputChange(count: number): void {
        const items = this.items();

        if (!items?.length) {
            return;
        }

        const safeCount = Math.min(count ?? 0, items.length);

        this.selectedItems = items.slice(0, safeCount);

        this.selectionChange.emit(this.selectedItems);
    }

    public onTableSelectionChange(selection: any[]): void {
        this.selectedItems = selection ?? [];
        this.selectionChange.emit(this.selectedItems);
    }

    public onExportExcel(): void {
        this.export.emit();
    }

    public onHeaderButtonClick(actionId: string): void {
        this.headerButtonClicked.emit(actionId);
    }

    public getItemStatus(item: any): ActionDropdown {
        return (
            (item.status as ActionDropdown) ||
            ('NONE' as unknown as ActionDropdown)
        );
    }

    public getFormatDate(value: string): string {
        return formatDate(value);
    }

    public copyToClipboard(data: string): void {
        this.clipboardService.copyFromContent(data);
        this.toastService.success(
            this.translate.instant('COMMON.COPIED_TO_CLIPBOARD')
        );
    }

    public getOperatorTagStyle(operator: string): Record<string, string> {
        return operatorsTagStyle(operator);
    }
}
