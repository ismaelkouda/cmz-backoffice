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
import { TranslateModule } from '@ngx-translate/core';
import { NotificationsFacade } from '@presentation/pages/communication/application/notifications.facade';
import { NotificationsFilter } from '@presentation/pages/communication/domain/value-objects/notifications-filter.vo';
import { ManagementComponent } from '@presentation/pages/reports-processing/ui/management/management.component';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { Subject, takeUntil } from 'rxjs';
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
    private readonly notificationsFacade = inject(NotificationsFacade);
    public module!: string;
    public subModule!: string;
    public notifications$ = this.notificationsFacade.notifications$;
    public pagination$ = this.notificationsFacade.pagination$;
    public loading$ = this.notificationsFacade.isLoading$;
    private readonly destroy$ = new Subject<void>();
    public reportTreatmentVisible = false;
    public selectedReportId: string | null = null;

    ngOnInit(): void {
        this.setupRouteData();
        this.loadData();
    }

    private loadData(): void {
        const defaultFilter = NotificationsFilter.create(
            {} as NotificationsFilterPayloadEntity
        );
        this.notificationsFacade.fetchNotifications(defaultFilter, '1', false);
    }

    private setupRouteData(): void {
        this.activatedRoute.data
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                this.title.setTitle(
                    data['title'] ?? 'COMMUNICATION.NOTIFICATIONS.TITLE'
                );
                this.module = data['module'] ?? 'COMMUNICATION.LABEL';
                this.subModule =
                    data['subModule'] ?? 'COMMUNICATION.NOTIFICATIONS.LABEL';
            });
    }

    public filter(filterData: NotificationsFilterPayloadEntity): void {
        const filter = NotificationsFilter.create(filterData);
        this.notificationsFacade.fetchNotifications(filter, '1', true);
    }

    public onPageChange(event: number): void {
        this.notificationsFacade.changePage(event + 1);
    }

    public onReadOneNotification(item: NotificationsEntity): void {
    }

    public onReadAllNotifications(): void {
    }

    public refreshNotifications(): void {
        this.notificationsFacade.refresh();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}