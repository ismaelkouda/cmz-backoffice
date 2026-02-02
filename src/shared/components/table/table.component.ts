import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Output,
    inject,
    input,
    output,
} from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

import { SearchTableComponent } from '@shared/components/search-table/search-table.component';
import {
    TableButtonHeaderComponent,
    TableHeaderButton,
} from '@shared/components/table-button-header/table-button-header.component';
import { TableTitleComponent } from '@shared/components/table-title/table-title.component';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { ActionDropdown } from '@shared/domain/enums/action-dropdown.enum';
import { CrudFormType } from '@shared/domain/utils/crud-form-utils';
import { SeparatorThousandsPipe } from '@shared/pipes/separator-thousands.pipe';
import { TableConfig } from '@shared/services/table-export-excel-file.service';

import { HomeActionDropdownComponent } from '@presentation/pages/content-management/presentation/features/home/table-home/home-action-dropdown/home-action-dropdown.component';
import { ReportStatus } from '@presentation/pages/report-requests/domain/entities/all/all.entity';

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
        HomeActionDropdownComponent,
        SeparatorThousandsPipe,
    ],
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent {
    public readonly loading = input<boolean>(false);
    public readonly items = input<any[]>([]);
    public readonly pagination = input<Paginate<any> | null>(null);
    public readonly config = input.required<TableConfig>();
    public readonly hiddenButtonOther = input<boolean>(true);
    public readonly dataKey = input<string>('id');

    public readonly headerButtons = input<TableHeaderButton[]>([]);
    public readonly selectionMode = input<'single' | 'multiple' | null>(
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
    public readonly enableRequested = output<{ item: any; ref: CrudFormType }>();
    public readonly disableRequested = output<{
        item: any;
        ref: CrudFormType;
    }>();
    public readonly viewRequested = output<{ item: any; ref: CrudFormType }>();
    public readonly badgeClicked = output<{ item: any; col: any }>();
    public readonly actionClicked = output<any>();

    public readonly headerButtonClicked = output<string>();
    public readonly selectionChange = output<any | any[]>();

    @Output() export = new EventEmitter<void>();

    private readonly clipboardService = inject(ClipboardService);
    private readonly toastService = inject(ToastrService);
    private readonly translate = inject(TranslateService);

    public onRefresh(): void {
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

    public onExportExcel(): void {
        this.export.emit();
    }

    public onHeaderButtonClick(actionId: string): void {
        this.headerButtonClicked.emit(actionId);
    }

    public onSelectionChange(value: any | any[]): void {
        this.selectionChange.emit(value);
    }

    public trackByColField(_: number, col: any): string {
        return col.field;
    }

    public getItemStatus(item: any): ActionDropdown {
        return (
            (item.status as ActionDropdown) ||
            ('NONE' as unknown as ActionDropdown)
        );
    }

    public formatDate(value: string): string {
        if (!value) {
            return '-';
        }
        try {
            const normalized = value.includes('T')
                ? value
                : value.replace(' ', 'T');
            const withTimezone = normalized.endsWith('Z')
                ? normalized
                : `${normalized}Z`;
            const date = new Date(withTimezone);
            return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
        } catch {
            return value;
        }
    }

    public copyToClipboard(data: string): void {
        this.clipboardService.copyFromContent(data);
        this.toastService.success(
            this.translate.instant('COPIED_TO_THE_CLIPBOARD')
        );
    }

    public getOperatorColor(operator: string): string {
        const normalized = operator?.toLowerCase().trim() ?? '';
        const colorMap: Record<string, string> = {
            orange: 'rgb(241, 110, 0)',
            mtn: 'rgb(255, 203, 5)',
            moov: 'rgb(0, 91, 164)',
        };
        return colorMap[normalized] ?? `rgba(var(--theme-default-rgb), 0.8)`;
    }

    public getOperatorTagStyle(operator: string): Record<string, string> {
        const backgroundColor = this.getOperatorColor(operator);
        const textColor =
            operator?.toLowerCase() === 'mtn' ? '#212121' : '#ffffff';
        return { backgroundColor, color: textColor };
    }

    public numberSeverity(value: number) {
        if (value === 0) {
            return 'danger';
        } else if (value > 0 && value < 999999) {
            return 'warn';
        } else {
            return 'success';
        }
    }

    public getStatusSeverity(status: string): StatusTagSeverity {

        console.log('status', status);
        const severityMap: Record<string, StatusTagSeverity> = {
            [ReportStatus.ABANDONED]: 'warning',
            [ReportStatus.APPROVED]: 'success',
            [ReportStatus.REJECTED]: 'danger',
            [ReportStatus.CONFIRMED]: 'contrast',
            [ReportStatus.UNKNOWN]: 'dark',
            [ActionDropdown.ACTIVE]: 'success',
            [ActionDropdown.INACTIVE]: 'danger',
            [ActionDropdown.PUBLISHED]: 'success',
            [ActionDropdown.UNPUBLISHED]: 'danger',
        };
        return severityMap[status] ?? 'secondary';
    }
}

type StatusTagSeverity =
    | 'success'
    | 'info'
    | 'warning'
    | 'danger'
    | 'secondary'
    | 'contrast'
    | 'dark';
