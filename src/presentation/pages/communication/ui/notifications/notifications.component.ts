import { AsyncPipe, CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
    inject,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NotificationsFacade } from '@presentation/pages/communication/application/notifications.facade';
import { NotificationsFilter } from '@presentation/pages/communication/domain/value-objects/notifications-filter.vo';
import { ManagementComponent } from '@presentation/pages/reports-processing/ui/management/management.component';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { Subject } from 'rxjs';
import { NotificationsFilterPayloadEntity } from '../../domain/entities/notifications-filter-payload.entity';
import { NotificationsEntity } from '../../domain/entities/notifications.entity';
import { NotificationsFilterComponent } from '../../feature/notifications-filter/notifications-filter.component';
import { NotificationsTableComponent } from '../../feature/notifications-table/notifications-table.component';

@Component({
    selector: 'app-notifications',
    standalone: true,
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.scss'],
    imports: [
        CommonModule,
        BreadcrumbComponent,
        ManagementComponent,
        PageTitleComponent,
        PaginationComponent,
        TranslateModule,
        NotificationsTableComponent,
        NotificationsFilterComponent,
        AsyncPipe,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsComponent implements OnInit, OnDestroy {
    private readonly title = inject(Title);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly translate = inject(TranslateService);
    private readonly notificationsFacade = inject(NotificationsFacade);
    public module: string = this.translate.instant('COMMUNICATION.LABEL');
    public subModule: string = this.translate.instant('COMMUNICATION.NOTIFICATIONS.LABEL');
    public notifications$ = this.notificationsFacade.notifications$;
    public pagination$ = this.notificationsFacade.pagination$;
    public loading$ = this.notificationsFacade.isLoading$;
    private readonly destroy$ = new Subject<void>();
    public reportTreatmentVisible = false;
    public selectedReportId: string | null = null;

    ngOnInit(): void {
        this.setupMeta();
        this.loadData();
    }

    private loadData(): void {
        const defaultFilter = NotificationsFilter.create();
        this.notificationsFacade.fetchNotifications(defaultFilter, '1', false);
    }

    private setupMeta(): void {
        this.title.setTitle(this.translate.instant('COMMUNICATION.NOTIFICATIONS.TITLE'));
    }

    public filter(filterData: NotificationsFilterPayloadEntity): void {
        const filter = NotificationsFilter.create(filterData);
        this.notificationsFacade.fetchNotifications(filter, '1', true);
    }

    public onPageChange(event: number): void {
        this.notificationsFacade.changePage(event + 1);
    }

    public onReadOneClicked(item: NotificationsEntity): void {
    }

    public onReadAllClicked(): void {
    }

    public onRefreshClicked(): void {
        this.notificationsFacade.refresh();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}