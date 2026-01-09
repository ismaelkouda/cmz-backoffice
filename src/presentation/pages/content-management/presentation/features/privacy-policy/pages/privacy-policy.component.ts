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
import { PrivacyPolicyFacade } from '@presentation/pages/content-management/core/application/services/privacy-policy.facade';
import { PrivacyPolicyEntity } from '@presentation/pages/content-management/core/domain/entities/privacy-policy.entity';
import { PrivacyPolicyFilter } from '@presentation/pages/content-management/core/domain/value-objects/privacy-policy-filter.vo';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { Observable, Subject } from 'rxjs';
import { FilterPrivacyPolicyComponent } from '../filter-privacy-policy/filter-privacy-policy.component';
import { CREATE_ROUTE, EDIT_ROUTE, VIEW_ROUTE } from '../privacy-policy.routes';
import { TablePrivacyPolicyComponent } from '../table-privacy-policy/table-privacy-policy.component';
@Component({
    selector: 'app-privacy-policy',
    standalone: true,
    templateUrl: './privacy-policy.component.html',
    styleUrls: ['./privacy-policy.component.scss'],
    imports: [
        CommonModule,
        BreadcrumbComponent,
        FilterPrivacyPolicyComponent,
        TablePrivacyPolicyComponent,
        PageTitleComponent,
        PaginationComponent,
        TranslateModule,
        AsyncPipe,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivacyPolicyComponent implements OnInit {
    private readonly title = inject(Title);
    private readonly router = inject(Router);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly translate = inject(TranslateService);
    private readonly privacyPolicyFacade = inject(PrivacyPolicyFacade);
    public privacyPolicy$: Observable<PrivacyPolicyEntity[]> =
        this.privacyPolicyFacade.privacyPolicy$;
    public pagination$: Observable<Paginate<PrivacyPolicyEntity>> =
        this.privacyPolicyFacade.pagination$;
    public loading$: Observable<boolean> = this.privacyPolicyFacade.isLoading$;
    private readonly destroy$ = new Subject<void>();

    ngOnInit(): void {
        this.setupMeta();
        this.loadData();
    }

    private loadData(): void {
        const defaultFilter = PrivacyPolicyFilter.create();
        this.privacyPolicyFacade.fetchPrivacyPolicy(defaultFilter, '1', false);
    }

    private setupMeta(): void {
        this.title.setTitle(
            this.translate.instant('CONTENT_MANAGEMENT.PRIVACY_POLICY.TITLE')
        );
    }

    public filter(filterData: any): void {
        const filter = PrivacyPolicyFilter.create(filterData);
        this.privacyPolicyFacade.fetchPrivacyPolicy(filter, '1', true);
    }

    public onPageChange(event: number): void {
        this.privacyPolicyFacade.changePage(event + 1);
    }

    public onRefreshClicked(): void {
        this.privacyPolicyFacade.refresh();
    }

    public onCreateClicked(): void {
        this.router.navigate([CREATE_ROUTE], {
            relativeTo: this.activatedRoute,
        });
    }

    public onEditClicked(item: PrivacyPolicyEntity): void {
        this.router.navigate([item.uniqId, EDIT_ROUTE], {
            relativeTo: this.activatedRoute,
        });
    }

    public onViewClicked(item: PrivacyPolicyEntity): void {
        this.router.navigate([item.uniqId, VIEW_ROUTE], {
            relativeTo: this.activatedRoute,
        });
    }

    public onPublishClicked(item: PrivacyPolicyEntity): void {
        this.privacyPolicyFacade.publish(item.uniqId).subscribe();
    }

    public onUnpublishClicked(item: PrivacyPolicyEntity): void {
        this.privacyPolicyFacade.unpublish(item.uniqId).subscribe();
    }

    public onDeleteClicked(item: PrivacyPolicyEntity): void {
        this.privacyPolicyFacade.delete(item.uniqId).subscribe();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
