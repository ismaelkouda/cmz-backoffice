/* import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { Subject, takeUntil } from 'rxjs';
import { MessagingFacade } from '../../application/messaging.facade';
import { MessagingEntity } from '../../domain/entities/messaging.entity';
import { MessagingFilter } from '../../domain/value-objects/messaging-filter.vo';
import { TableMessagingComponent } from '../../feature/table-messaging/table-messaging.component';

@Component({
    selector: 'app-messaging',
    standalone: true,
    templateUrl: './messaging.component.html',
    styleUrls: ['./messaging.component.scss'],
    imports: [
        CommonModule,
        TranslateModule,
        TableMessagingComponent,
        PageTitleComponent,
        PaginationComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagingComponent implements OnInit {
    private readonly facade = inject(MessagingFacade);
    private readonly route = inject(ActivatedRoute);
    private readonly titleService = inject(Title);
    private readonly destroy$ = new Subject<void>();

    public readonly messages$ = this.facade.messages$;
    public readonly pagination$ = this.facade.pagination$;
    public readonly loading$ = this.facade.isLoading$;

    public readonly module = signal<string>('');
    public readonly subModule = signal<string>('');

    ngOnInit(): void {
        this.setupRouteData();
        this.loadMessages();
    }

    private setupRouteData(): void {
        this.route.data.pipe(takeUntil(this.destroy$)).subscribe((data) => {
            this.titleService.setTitle(data['title'] ?? 'COMMUNICATION.TITLE');
            this.module.set(data['module'] ?? 'COMMUNICATION.LABEL');
            this.subModule.set(data['subModule'] ?? 'COMMUNICATION.MESSAGES.LABEL');
        });
    }

    private loadMessages(): void {
        const filter = MessagingFilter.create({});
        this.facade.fetchMessages(filter);
    }

    public onPageChange(page: number): void {
        this.facade.changePage(page + 1);
    }

    public onViewMessage(message: MessagingEntity): void {
        console.log('View message', message);
        // TODO: Implement view message logic (modal or navigation)
    }

    public onRefresh(): void {
        this.facade.refresh();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.facade.resetMemory();
    }
}
 */