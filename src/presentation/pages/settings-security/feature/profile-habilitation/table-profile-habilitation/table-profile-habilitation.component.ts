/* import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input,
    output
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProfileHabilitationEntity, ProfileStatus } from '@presentation/pages/settings-security/domain/entities/profile-habilitation/profile-habilitation.entity';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { SearchTableComponent } from '@shared/components/search-table/search-table.component';
import { TableButtonHeaderComponent } from '@shared/components/table-button-header/table-button-header.component';
import { TableTitleComponent } from '@shared/components/table-title/table-title.component';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import {
    TableConfig
} from '@shared/services/table-export-excel-file.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-table-profile-habilitation',
    standalone: true,
    templateUrl: './table-profile-habilitation.component.html',
    styleUrls: ['./table-profile-habilitation.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        TableModule,
        TranslateModule,
        SkeletonModule,
        TableTitleComponent,
        TableButtonHeaderComponent,
        PaginationComponent,
        SearchTableComponent,
        ButtonModule,
        InputTextModule,
        TagModule,
        TooltipModule,
        ProgressSpinnerModule,
    ],
})
export class TableProfileHabilitationComponent {
    private readonly translateService = inject(TranslateService);
    public readonly profileHabilitation$ = input.required<Observable<ProfileHabilitationEntity[]>>()
    public readonly pagination$ = input.required<Observable<Paginate<ProfileHabilitationEntity>>>()
    public readonly loading$ = input.required<Observable<boolean>>()
    public readonly tableConfig = input.required<TableConfig>();
    readonly profileHabilitation = toSignal(this.profileHabilitation$(), { initialValue: [] });
    readonly pagination = toSignal(this.pagination$(), {
        initialValue: {} as Paginate<ProfileHabilitationEntity>
    });
    readonly loading = toSignal(this.loading$(), { initialValue: false });
    public readonly pageChange = output<number>();
    public readonly refresh = output<void>();
    public readonly export = output<ProfileHabilitationEntity[]>();
    public readonly profileHabilitationRequested = output<{
        profile: ProfileHabilitationEntity;
        action: 'view' | 'edit' | 'delete' | 'enable' | 'disable' | 'users';
    }>();
    public readonly addProfileRequested = output<void>();
    readonly hasData = computed(() => this.profileHabilitation().length > 0);
    readonly totalItems = computed(() => this.pagination().total || 0);
    readonly skeletonRows = computed(() => {
        const rows = this.pagination().per_page || 5;
        return Array(rows).fill(0);
    });


    private readonly statusSeverityMap: Record<ProfileStatus, TagSeverity> = {
        [ProfileStatus.ACTIVE]: 'success',
        [ProfileStatus.INACTIVE]: 'danger',
    };
    private readonly nameSeverityMap: Record<string, TagSeverity> = {
        'Admin': 'success',
        'User': 'danger',
    };


    onPageChange(page: number): void {
        this.pageChange.emit(page);
    }

    onRefresh(): void {
        this.refresh.emit();
    }

    public onExportExcel(): void {
        this.export.emit(this.profileHabilitation());
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

    public getStatusSeverity(status: ProfileStatus): TagSeverity {
        return this.statusSeverityMap[status] ?? 'secondary';
    }

    public getNameSeverity(name: string): TagSeverity {
        return this.nameSeverityMap[name] ?? 'secondary';
    }

    public onActionClicked(
        item: ProfileHabilitationEntity,
        action: 'view' | 'edit' | 'delete' | 'enable' | 'disable'
    ): void {
        this.profileHabilitationRequested.emit({ profile: item, action });
    }

    public onUsersClicked(item: ProfileHabilitationEntity): void {
        this.profileHabilitationRequested.emit({
            profile: item,
            action: 'users',
        });
    }

    public onAddProfile(): void {
        this.addProfileRequested.emit();
    }

}
type TagSeverity =
    | 'success'
    | 'danger' */