/* import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input,
    output
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { SearchTableComponent } from '@shared/components/search-table/search-table.component';
import { TableButtonHeaderComponent } from '@shared/components/table-button-header/table-button-header.component';
import { TableTitleComponent } from '@shared/components/table-title/table-title.component';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { TableConfig } from '@shared/services/table-export-excel-file.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { Observable } from 'rxjs';
import { AccessLogsEntity } from '../../../domain/entities/access-logs/access-logs.entity';

@Component({
    selector: 'app-table-access-logs',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        TranslateModule,
        SkeletonModule,
        TableTitleComponent,
        TableButtonHeaderComponent,
        PaginationComponent,
        SearchTableComponent,
        ButtonModule,
        InputTextModule,
    ],
    templateUrl: './table-access-logs.component.html',
    styleUrls: ['./table-access-logs.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableAccessLogsComponent {
    private readonly translateService = inject(TranslateService);
    public readonly accessLogs$ = input.required<Observable<AccessLogsEntity[]>>()
    public readonly pagination$ = input.required<Observable<Paginate<AccessLogsEntity>>>()
    public readonly loading$ = input.required<Observable<boolean>>()
    public readonly tableConfig = input.required<TableConfig>();
    readonly accessLogs = toSignal(this.accessLogs$(), { initialValue: [] });
    readonly pagination = toSignal(this.pagination$(), {
        initialValue: {} as Paginate<AccessLogsEntity>
    });
    readonly loading = toSignal(this.loading$(), { initialValue: false });
    public readonly pageChange = output<number>();
    public readonly refresh = output<void>();
    public readonly export = output<AccessLogsEntity[]>();
    readonly hasData = computed(() => this.accessLogs().length > 0);
    readonly totalItems = computed(() => this.pagination().total || 0);
    readonly skeletonRows = computed(() => {
        const rows = this.pagination().per_page || 5;
        return Array(rows).fill(0);
    });


    onPageChange(page: number): void {
        this.pageChange.emit(page);
    }

    onRefresh(): void {
        this.refresh.emit();
    }

    public onExportExcel(): void {
        this.export.emit(this.accessLogs());
    }

    formatDate(value: string): string {
        if (!value) return '-';
        try {
            const date = new Date(value);
            if (isNaN(date.getTime())) return value;

            return date.toLocaleDateString(this.translateService.currentLang, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return value;
        }
    }

    copyToClipboard(content: string): void {
        if (!content) return;

        navigator.clipboard.writeText(content)
            .then(() => {
                console.log('Copié:', content);
            })
            .catch(err => console.error('Erreur copie:', err));
    }

    getEventSeverityClass(event: string): string {
        if (!event) return '';

        const eventLower = event.toLowerCase();
        if (eventLower.includes('error') || eventLower.includes('fail') || eventLower.includes('denied')) {
            return 'text-danger';
        }
        if (eventLower.includes('warn') || eventLower.includes('alert')) {
            return 'text-warning';
        }
        if (eventLower.includes('success') || eventLower.includes('granted') || eventLower.includes('allowed')) {
            return 'text-success';
        }
        if (eventLower.includes('info') || eventLower.includes('log')) {
            return 'text-info';
        }

        return '';
    }

}
 */
