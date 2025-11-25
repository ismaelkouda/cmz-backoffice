import { AsyncPipe, CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnDestroy,
    OnInit,
    inject,
} from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NewspapersFacade } from '@presentation/pages/reports-processing/application/newspapers.facade';
import { NewspapersFilterPayloadEntity } from '@presentation/pages/reports-processing/domain/entities/management/newspapers/newspapers-filter-payload.entity';
import { NewspapersEntity } from '@presentation/pages/reports-processing/domain/entities/management/newspapers/newspapers.entity';
import { NewspapersFilter } from '@presentation/pages/reports-processing/domain/value-objects/newspapers-filter.vo';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { Paginate } from '@shared/interfaces/paginate';
import { TableExportExcelFileService } from '@shared/services/table-export-excel-file.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject } from 'rxjs';
import { ModalActivityComponent } from './modal-activity/modal-activity.component';
import { TableNewspapersComponent } from './table-newspapers/table-newspapers.component';

@Component({
    selector: 'app-newspapers',
    standalone: true,
    templateUrl: './newspapers.component.html',
    imports: [
        CommonModule,
        TableNewspapersComponent,
        PageTitleComponent,
        PaginationComponent,
        TranslateModule,
        AsyncPipe,
        ModalActivityComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewspapersComponent implements OnInit, OnDestroy {
    private readonly newspapersFacade = inject(NewspapersFacade);
    private readonly translate = inject(TranslateService);
    private readonly toastService = inject(ToastrService);
    private readonly tableExportExcelFileService = inject(
        TableExportExcelFileService
    );
    private readonly destroy$ = new Subject<void>();

    @Input() reportUniqId!: string;
    public visibleActivity: boolean = false;

    public pagination$!: Observable<Paginate<NewspapersEntity>>;
    public newspapers$!: Observable<NewspapersEntity[]>;
    public loading$!: Observable<boolean>;

    ngOnInit(): void {
        this.setupObservables();
        this.loadNewspapersData();
    }

    private loadNewspapersData(): void {
        const defaultFilter = NewspapersFilter.create({
            reportUniqId: this.reportUniqId,
        } as NewspapersFilterPayloadEntity);
        this.newspapersFacade.fetchNewspapers(defaultFilter, '1', false);
    }

    private setupObservables(): void {
        this.newspapers$ = this.newspapersFacade.newspapers$;
        this.pagination$ = this.newspapersFacade.pagination$;
        this.loading$ = this.newspapersFacade.isLoading$;
    }

    public filter(filterData: NewspapersFilterPayloadEntity): void {
        const filter = NewspapersFilter.create({
            ...filterData,
            reportUniqId: this.reportUniqId,
        });
        this.newspapersFacade.fetchNewspapers(filter, '1', true);
    }

    public onPageChange(event: number): void {
        this.newspapersFacade.changePage(event + 1);
    }

    public refreshNewspapers(): void {
        this.newspapersFacade.refresh();
    }

    public onAllAction(): void {
        this.visibleActivity = true;
    }

    public onReportActivityClosed(): void {
        this.visibleActivity = false;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
