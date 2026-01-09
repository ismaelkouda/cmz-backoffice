import { AsyncPipe, CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
    inject,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NewsFacade } from '@presentation/pages/content-management/core/application/services/news.facade';
import { NewsEntity } from '@presentation/pages/content-management/core/domain/entities/news.entity';
import { NewsFilterPayloadEntity } from '@presentation/pages/content-management/core/domain/entities/news/news-filter-payload.entity';
import { NewsFilter } from '@presentation/pages/content-management/core/domain/value-objects/news-filter.vo';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { Observable, Subject } from 'rxjs';
import { FilterNewsComponent } from '../filter-news/filter-news.component';
import {
    NEWS_CREATE_ROUTE,
    NEWS_EDIT_ROUTE,
    NEWS_VIEW_ROUTE,
} from '../news.routes';
import { TableNewsComponent } from '../table-news/table-news.component';

@Component({
    selector: 'app-news',
    standalone: true,
    templateUrl: './news.component.html',
    styleUrls: ['./news.component.scss'],
    imports: [
        CommonModule,
        BreadcrumbComponent,
        FilterNewsComponent,
        TableNewsComponent,
        PageTitleComponent,
        PaginationComponent,
        TranslateModule,
        AsyncPipe,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsComponent implements OnInit, OnDestroy {
    private readonly title = inject(Title);
    private readonly router = inject(Router);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly translate = inject(TranslateService);
    private readonly newsFacade = inject(NewsFacade);
    public news$: Observable<NewsEntity[]> = this.newsFacade.news$;
    public pagination$: Observable<Paginate<NewsEntity>> =
        this.newsFacade.pagination$;
    public loading$: Observable<boolean> = this.newsFacade.isLoading$;
    private readonly destroy$ = new Subject<void>();

    ngOnInit(): void {
        this.setupMeta();
        this.loadData();
    }

    private loadData(): void {
        const defaultFilter = NewsFilter.create();
        this.newsFacade.fetchNews(defaultFilter, '1', false);
    }

    private setupMeta(): void {
        this.title.setTitle(
            this.translate.instant('CONTENT_MANAGEMENT.NEWS.TITLE')
        );
    }

    public filter(filterData: NewsFilterPayloadEntity): void {
        const filter = NewsFilter.create({
            ...filterData,
            status: filterData.status ?? undefined,
        });
        this.newsFacade.fetchNews(filter, '1', true);
    }

    public onPageChange(event: number): void {
        this.newsFacade.changePage(event);
    }

    public refreshNews(): void {
        this.newsFacade.refresh();
    }

    public onCreateClicked(): void {
        this.router.navigate([NEWS_CREATE_ROUTE], {
            relativeTo: this.activatedRoute,
        });
    }

    public onEditClicked(item: NewsEntity): void {
        this.router.navigate([item.slug, NEWS_EDIT_ROUTE], {
            relativeTo: this.activatedRoute,
        });
    }

    public onViewClicked(item: NewsEntity): void {
        this.router.navigate([item.slug, NEWS_VIEW_ROUTE], {
            relativeTo: this.activatedRoute,
        });
    }

    public onEnableClicked(item: NewsEntity): void {
        this.newsFacade.enableNews(item.slug).subscribe();
    }

    public onDisableClicked(item: NewsEntity): void {
        this.newsFacade.disableNews(item.slug).subscribe();
    }

    public onDeleteClicked(item: NewsEntity): void {
        this.newsFacade.deleteNews(item.slug).subscribe();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
