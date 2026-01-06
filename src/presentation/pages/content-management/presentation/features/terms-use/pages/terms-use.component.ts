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
import { TermsUseFacade } from '@presentation/pages/content-management/core/application/services/terms-use.facade';
import { TermsUseEntity } from '@presentation/pages/content-management/core/domain/entities/terms-use.entity';
import { TermsUseFilter } from '@presentation/pages/content-management/core/domain/value-objects/terms-use-filter.vo';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { Observable, Subject } from 'rxjs';
import { FilterTermsUseComponent } from '../filter-terms-use/filter-terms-use.component';
import { TableTermsUseComponent } from '../table-terms-use/table-terms-use.component';
import { CREATE_ROUTE, EDIT_ROUTE, VIEW_ROUTE } from '../terms-use.routes';
@Component({
    selector: 'app-terms-use',
    standalone: true,
    templateUrl: './terms-use.component.html',
    styleUrls: ['./terms-use.component.scss'],
    imports: [
        CommonModule,
        BreadcrumbComponent,
        FilterTermsUseComponent,
        TableTermsUseComponent,
        PageTitleComponent,
        PaginationComponent,
        TranslateModule,
        AsyncPipe,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TermsUseComponent implements OnInit {
    private readonly title = inject(Title);
    private readonly router = inject(Router);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly facade = inject(TermsUseFacade);
    private readonly translate = inject(TranslateService);
    private readonly termsUseFacade = inject(TermsUseFacade);
    public module: string = this.translate.instant('CONTENT_MANAGEMENT.LABEL');
    public subModule: string = this.translate.instant(
        'CONTENT_MANAGEMENT.TERMS_USE.LABEL'
    );
    public termsUse$: Observable<TermsUseEntity[]> =
        this.termsUseFacade.termsUse$;
    public pagination$: Observable<Paginate<TermsUseEntity>> =
        this.termsUseFacade.pagination$;
    public loading$: Observable<boolean> = this.termsUseFacade.isLoading$;
    private readonly destroy$ = new Subject<void>();

    ngOnInit(): void {
        this.setupMeta();
        this.loadData();
    }

    private loadData(): void {
        const defaultFilter = TermsUseFilter.create();
        this.termsUseFacade.fetchTermsUse(defaultFilter, '1', false);
    }

    private setupMeta(): void {
        this.title.setTitle(
            this.translate.instant('CONTENT_MANAGEMENT.TERMS_USE.TITLE')
        );
    }

    public filter(filterData: any): void {
        const filter = TermsUseFilter.create(filterData);
        this.termsUseFacade.fetchTermsUse(filter, '1', true);
    }

    public onPageChange(event: number): void {
        this.termsUseFacade.changePage(event + 1);
    }

    public refreshTermsUse(): void {
        this.termsUseFacade.refresh();
    }

    public onCreateClicked(): void {
        this.router.navigate([CREATE_ROUTE], {
            relativeTo: this.activatedRoute,
        });
    }

    public onEditClicked(item: TermsUseEntity): void {
        this.router.navigate([item.uniqId, EDIT_ROUTE], {
            relativeTo: this.activatedRoute,
        });
    }

    public onViewClicked(item: TermsUseEntity): void {
        this.router.navigate([item.uniqId, VIEW_ROUTE], {
            relativeTo: this.activatedRoute,
        });
    }

    public onPublishClicked(item: TermsUseEntity): void {
        this.termsUseFacade.publish(item.uniqId).subscribe();
    }

    public onUnpublishClicked(item: TermsUseEntity): void {
        this.termsUseFacade.unpublish(item.uniqId).subscribe();
    }

    public onDeleteClicked(item: TermsUseEntity): void {
        this.termsUseFacade.delete(item.uniqId).subscribe();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
