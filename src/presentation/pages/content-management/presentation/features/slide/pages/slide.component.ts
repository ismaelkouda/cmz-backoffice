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
import {
    CREATE_ROUTE,
    EDIT_ROUTE,
    VIEW_ROUTE,
} from '@presentation/pages/content-management/content-management.routes';
import { SlideFacade } from '@presentation/pages/content-management/core/application/services/slide.facade';
import { SlideEntity } from '@presentation/pages/content-management/core/domain/entities/slide.entity';
import { SlideFilterPayloadEntity } from '@presentation/pages/content-management/core/domain/entities/slide/slide-filter-payload.entity';
import { SlideFilter } from '@presentation/pages/content-management/core/domain/value-objects/slide-filter.vo';
import { FilterSlideComponent } from '@presentation/pages/content-management/presentation/features/slide/filter-slide/filter-slide.component';
import { TableSlideComponent } from '@presentation/pages/content-management/presentation/features/slide/table-slide/table-slide.component';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { Observable, Subject } from 'rxjs';

@Component({
    selector: 'app-slide',
    standalone: true,
    templateUrl: './slide.component.html',
    styleUrls: ['./slide.component.scss'],
    imports: [
        CommonModule,
        BreadcrumbComponent,
        FilterSlideComponent,
        TableSlideComponent,
        PageTitleComponent,
        PaginationComponent,
        TranslateModule,
        AsyncPipe,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlideComponent implements OnInit, OnDestroy {
    private readonly title = inject(Title);
    private readonly router = inject(Router);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly translate = inject(TranslateService);
    private readonly slideFacade = inject(SlideFacade);
    public slide$: Observable<SlideEntity[]> = this.slideFacade.slide$;
    public pagination$: Observable<Paginate<SlideEntity>> =
        this.slideFacade.pagination$;
    public loading$: Observable<boolean> = this.slideFacade.isLoading$;
    private readonly destroy$ = new Subject<void>();

    ngOnInit(): void {
        this.setupMeta();
        this.loadData();
    }

    private loadData(): void {
        const defaultFilter = SlideFilter.create();
        this.slideFacade.fetchSlide(defaultFilter, '1', false);
    }

    private setupMeta(): void {
        this.title.setTitle(
            this.translate.instant('CONTENT_MANAGEMENT.SLIDE.TITLE')
        );
    }

    public filter(filterData: SlideFilterPayloadEntity): void {
        const filter = SlideFilter.create({
            ...filterData,
            status: filterData.status ?? undefined,
        });
        this.slideFacade.fetchSlide(filter, '1', true);
    }

    public onPageChange(event: number): void {
        this.slideFacade.changePage(event + 1);
    }

    public refreshSlide(): void {
        this.slideFacade.refresh();
    }

    public onCreateClicked(): void {
        this.router.navigate([CREATE_ROUTE], {
            relativeTo: this.activatedRoute,
        });
    }

    public onEditClicked(item: SlideEntity): void {
        this.router.navigate([item.uniqId, EDIT_ROUTE], {
            relativeTo: this.activatedRoute,
        });
    }

    public onViewClicked(item: SlideEntity): void {
        this.router.navigate([item.uniqId, VIEW_ROUTE], {
            relativeTo: this.activatedRoute,
        });
    }

    public onEnableClicked(item: SlideEntity): void {
        this.slideFacade.enableSlide(item.uniqId).subscribe();
    }

    public onDisableClicked(item: SlideEntity): void {
        this.slideFacade.disableSlide(item.uniqId).subscribe();
    }

    public onDeleteClicked(item: SlideEntity): void {
        this.slideFacade.deleteSlide(item.uniqId).subscribe();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
