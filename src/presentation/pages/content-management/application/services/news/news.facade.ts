import { inject, Injectable, signal } from '@angular/core';
import { NewsCreateCommand } from '@pages/content-management/application/commands/news/news-create.command';
import { NewsDeleteCommand } from '@pages/content-management/application/commands/news/news-delete.command';
import { NewsPublishCommand } from '@pages/content-management/application/commands/news/news-publish.command';
import { NewsUnpublishCommand } from '@pages/content-management/application/commands/news/news-unpublish.command';
import { NewsUpdateCommand } from '@pages/content-management/application/commands/news/news-update.command';
import { NewsCreateBus } from '@pages/content-management/application/commands-bus/news/news-create.bus';
import { NewsDeleteBus } from '@pages/content-management/application/commands-bus/news/news-delete.bus';
import { NewsPublishBus } from '@pages/content-management/application/commands-bus/news/news-publish.bus';
import { NewsUnpublishBus } from '@pages/content-management/application/commands-bus/news/news-unpublish.bus';
import { NewsUpdateBus } from '@pages/content-management/application/commands-bus/news/news-update.bus';
import { NewsCreateDto } from '@pages/content-management/application/dto/news/news-create.dto';
import { NewsDeleteDto } from '@pages/content-management/application/dto/news/news-delete.dto';
import { NewsFilterDto } from '@pages/content-management/application/dto/news/news-filter.dto';
import { NewsPublishDto } from '@pages/content-management/application/dto/news/news-publish.dto';
import { NewsUnpublishDto } from '@pages/content-management/application/dto/news/news-unpublish.dto';
import { NewsUpdateDto } from '@pages/content-management/application/dto/news/news-update.dto';
import { NewsQuery } from '@pages/content-management/application/queries/news/news.query';
import { NewsBus } from '@pages/content-management/application/queries-bus/news/news.bus';
import { NewsEntity } from '@pages/content-management/domain/entities/news/news.entity';
import { BaseFacade } from '@shared/application/services/base-facade';
import { handleObservableWithFeedback } from '@shared/application/services/facade.utils';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class NewsFacade extends BaseFacade<NewsEntity, NewsFilterDto> {
    private readonly uiFeedback = inject(UiFeedbackService);
    private readonly filterBus = inject(NewsBus);
    private readonly createBus = inject(NewsCreateBus);
    private readonly updateBus = inject(NewsUpdateBus);
    private readonly enableBus = inject(NewsPublishBus);
    private readonly disableBus = inject(NewsUnpublishBus);
    private readonly deleteBus = inject(NewsDeleteBus);

    private readonly _actionState = signal<'idle' | 'loading'>('idle');
    readonly actionState = this._actionState.asReadonly();

    private readonly _actionSuccess = signal(0);
    readonly actionSuccess = this._actionSuccess.asReadonly();

    private readonly _actionError = signal<unknown | null>(null);
    readonly actionError = this._actionError.asReadonly();

    private hasInitialized = false;
    private lastFetchTimestamp = 0;

    private handleActionWithRefresh<T>(
        observable: Observable<T>,
        successKey: string
    ): Observable<T> {
        return handleObservableWithFeedback(
            observable,
            this.uiFeedback,
            successKey,
            () => this.refreshWithLastFilterAndPage()
        );
    }

    readAll(
        filter: NewsFilterDto = {},
        page: string = PAGINATION_CONST.DEFAULT_PAGE,
        options: FetchOptions = {}
    ): void {
        const command = new NewsQuery(
            filter?.search,
            filter?.status,
            filter?.startDate,
            filter?.endDate
        );
        const fetch$ = this.filterBus.dispatch(command, page, options);
        this.fetchWithFilterAndPage(filter, page, fetch$, this.uiFeedback);

        this.hasInitialized = true;
        this.lastFetchTimestamp = Date.now();
    }

    refresh(): void {
        this.filterSubject.next(null);
        this.pageSubject.next(PAGINATION_CONST.DEFAULT_PAGE);
        const filter = this.filterSubject.getValue();
        const page = this.pageSubject.getValue();
        const command = new NewsQuery(
            filter?.search,
            filter?.status,
            filter?.startDate,
            filter?.endDate
        );
        const fetch$ = this.filterBus.dispatch(command, page, {
            forceRefresh: true,
        });
        this.fetchWithFilterAndPage(null, page, fetch$, this.uiFeedback);
        this.lastFetchTimestamp = Date.now();
    }

    changePage(page: string): void {
        const filter = this.filterSubject.getValue();
        if (!filter) {
            return;
        }
        const command = new NewsQuery(
            filter?.search,
            filter?.status,
            filter?.startDate,
            filter?.endDate
        );
        const fetch$ = this.filterBus.dispatch(command, page);
        this.fetchWithFilterAndPage(filter, page, fetch$, this.uiFeedback);
        this.lastFetchTimestamp = Date.now();
    }

    private refreshWithLastFilterAndPage(): void {
        const filter = this.filterSubject.getValue();
        const page = this.pageSubject.getValue();
        const command = new NewsQuery(
            filter?.search,
            filter?.status,
            filter?.startDate,
            filter?.endDate
        );
        const fetch$ = this.filterBus.dispatch(command, page, {
            forceRefresh: true,
        });
        this.fetchWithFilterAndPage(filter, page, fetch$, this.uiFeedback);
        this.lastFetchTimestamp = Date.now();
    }

    resetMemory(): void {
        this.hasInitialized = false;
        this.lastFetchTimestamp = 0;
        this.reset();
    }

    getMemoryStatus(): {
        hasInitialized: boolean;
        lastFetch: number;
        hasData: boolean;
    } {
        return {
            hasInitialized: this.hasInitialized,
            lastFetch: this.lastFetchTimestamp,
            hasData: this.itemsSubject.getValue() !== null,
        };
    }

    create(news: NewsCreateDto): void {
        this._actionState.set('loading');

        const command = new NewsCreateCommand(
            news.type,
            news.image,
            news.video,
            news.category,
            news.subCategory,
            news.hashtags,
            news.title,
            news.resume,
            news.content
        );

        this.handleActionWithRefresh(
            this.createBus.dispatch(command),
            'COMMON.SUCCESS.CREATE'
        )
            .pipe(
                tap(() => {
                    this._actionSuccess.update((v) => v + 1);
                }),
                catchError((err) => {
                    this._actionError.set(err);
                    return throwError(() => err);
                }),
                finalize(() => this._actionState.set('idle'))
            )
            .subscribe();
    }

    update(news: NewsUpdateDto): void {
        this._actionState.set('loading');
        const command = new NewsUpdateCommand(
            news.uniqId,
            news.type,
            news.image,
            news.video,
            news.category,
            news.subCategory,
            news.hashtags,
            news.title,
            news.resume,
            news.content
        );
        this.handleActionWithRefresh(
            this.updateBus.dispatch(command),
            'COMMON.SUCCESS.UPDATE'
        )
            .pipe(
                tap(() => {
                    this._actionSuccess.update((v) => v + 1);
                }),
                catchError((err) => {
                    this._actionError.set(err);
                    return throwError(() => err);
                }),
                finalize(() => this._actionState.set('idle'))
            )
            .subscribe();
    }

    publish(team: NewsPublishDto): void {
        const command = new NewsPublishCommand(team.uniqId);
        this.handleActionWithRefresh(
            this.enableBus.dispatch(command),
            'COMMON.SUCCESS.PUBLISH'
        ).subscribe();
    }

    unpublish(team: NewsUnpublishDto): void {
        const command = new NewsUnpublishCommand(team.uniqId);
        this.handleActionWithRefresh(
            this.disableBus.dispatch(command),
            'COMMON.SUCCESS.UNPUBLISH'
        ).subscribe();
    }

    delete(team: NewsDeleteDto): void {
        const command = new NewsDeleteCommand(team.uniqId);
        this.handleActionWithRefresh(
            this.deleteBus.dispatch(command),
            'COMMON.SUCCESS.DELETE'
        ).subscribe();
    }
}
