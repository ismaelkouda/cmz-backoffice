import { AsyncPipe, CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    inject,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LegalNoticeFacade } from '@presentation/pages/content-management/core/application/services/legal-notice.facade';
import { LegalNoticeEntity } from '@presentation/pages/content-management/core/domain/entities/legal-notice.entity';
import { LegalNoticeFilter } from '@presentation/pages/content-management/core/domain/value-objects/legal-notice-filter.vo';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { Observable, Subject } from 'rxjs';
import { FilterLegalNoticeComponent } from '../filter-legal-notice/filter-legal-notice.component';
import { CREATE_ROUTE, EDIT_ROUTE, VIEW_ROUTE } from '../legal-notice.routes';
import { TableLegalNoticeComponent } from '../table-legal-notice/table-legal-notice.component';

@Component({
    selector: 'app-legal-notice',
    standalone: true,
    templateUrl: './legal-notice.component.html',
    styleUrls: ['./legal-notice.component.scss'],
    imports: [
        CommonModule,
        BreadcrumbComponent,
        FilterLegalNoticeComponent,
        TableLegalNoticeComponent,
        PageTitleComponent,
        PaginationComponent,
        TranslateModule,
        AsyncPipe,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegalNoticeComponent implements OnInit {
    private readonly title = inject(Title);
    private readonly router = inject(Router);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly translate = inject(TranslateService);
    private readonly legalNoticeFacade = inject(LegalNoticeFacade);
    public legalNotice$: Observable<LegalNoticeEntity[]> =
        this.legalNoticeFacade.legalNotice$;
    public pagination$: Observable<Paginate<LegalNoticeEntity>> =
        this.legalNoticeFacade.pagination$;
    public loading$: Observable<boolean> = this.legalNoticeFacade.isLoading$;
    private readonly destroy$ = new Subject<void>();

    ngOnInit(): void {
        this.setupMeta();
        this.loadData();
    }

    private loadData(): void {
        const defaultFilter = LegalNoticeFilter.create();
        this.legalNoticeFacade.fetchLegalNotice(defaultFilter, '1', false);
    }

    private setupMeta(): void {
        this.title.setTitle(
            this.translate.instant('CONTENT_MANAGEMENT.LEGAL_NOTICE.TITLE')
        );
    }

    public filter(filterData: any): void {
        const filter = LegalNoticeFilter.create(filterData);
        this.legalNoticeFacade.fetchLegalNotice(filter, '1', true);
    }

    public onPageChange(event: number): void {
        this.legalNoticeFacade.changePage(event + 1);
    }

    public onRefreshClicked(): void {
        this.legalNoticeFacade.refresh();
    }

    public onCreateClicked(): void {
        this.router.navigate([CREATE_ROUTE], {
            relativeTo: this.activatedRoute,
        });
    }

    public onEditClicked(item: LegalNoticeEntity): void {
        this.router.navigate([item.uniqId, EDIT_ROUTE], {
            relativeTo: this.activatedRoute,
        });
    }

    public onViewClicked(item: LegalNoticeEntity): void {
        this.router.navigate([item.uniqId, VIEW_ROUTE], {
            relativeTo: this.activatedRoute,
        });
    }

    public onPublishClicked(item: LegalNoticeEntity): void {
        this.legalNoticeFacade.publish(item.uniqId).subscribe();
    }

    public onUnpublishClicked(item: LegalNoticeEntity): void {
        this.legalNoticeFacade.unpublish(item.uniqId).subscribe();
    }

    public onDeleteClicked(item: LegalNoticeEntity): void {
        this.legalNoticeFacade.delete(item.uniqId).subscribe();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
