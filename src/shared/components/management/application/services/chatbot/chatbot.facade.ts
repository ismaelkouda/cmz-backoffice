import { inject, Injectable, signal } from '@angular/core';
import { BaseFacade } from '@shared/application/services/base-facade';
import { handleObservableWithFeedback } from '@shared/application/services/facade.utils';
import { ChatbotCreateCommand } from '@shared/components/management/application/commands/chatbot/chatbot-create.command';
import { ChatbotDeleteCommand } from '@shared/components/management/application/commands/chatbot/chatbot-delete.command';
import { ChatbotDisableCommand } from '@shared/components/management/application/commands/chatbot/chatbot-disable.command';
import { ChatbotEnableCommand } from '@shared/components/management/application/commands/chatbot/chatbot-enable.command';
import { ChatbotUpdateCommand } from '@shared/components/management/application/commands/chatbot/chatbot-update.command';
import { ChatbotCreateBus } from '@shared/components/management/application/commands-bus/chatbot/chatbot-create.bus';
import { ChatbotDeleteBus } from '@shared/components/management/application/commands-bus/chatbot/chatbot-delete.bus';
import { ChatbotDisableBus } from '@shared/components/management/application/commands-bus/chatbot/chatbot-disable.bus';
import { ChatbotEnableBus } from '@shared/components/management/application/commands-bus/chatbot/chatbot-enable.bus';
import { ChatbotUpdateBus } from '@shared/components/management/application/commands-bus/chatbot/chatbot-update.bus';
import { ChatbotCreateDto } from '@shared/components/management/application/dto/chatbot/chatbot-create.dto';
import { ChatbotDeleteDto } from '@shared/components/management/application/dto/chatbot/chatbot-delete.dto';
import { ChatbotDisableDto } from '@shared/components/management/application/dto/chatbot/chatbot-disable.dto';
import { ChatbotEnableDto } from '@shared/components/management/application/dto/chatbot/chatbot-enable.dto';
import { ChatbotFilterDto } from '@shared/components/management/application/dto/chatbot/chatbot-filter.dto';
import { ChatbotUpdateDto } from '@shared/components/management/application/dto/chatbot/chatbot-update.dto';
import { ChatbotQuery } from '@shared/components/management/application/queries/chatbot/chatbot.query';
import { ChatbotBus } from '@shared/components/management/application/queries-bus/chatbot/chatbot.bus';
import { ChatbotEntity } from '@shared/components/management/domain/entities/chatbot/chatbot.entity';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class ChatbotFacade extends BaseFacade<ChatbotEntity, ChatbotFilterDto> {
    private readonly uiFeedback = inject(UiFeedbackService);
    private readonly filterBus = inject(ChatbotBus);
    private readonly createBus = inject(ChatbotCreateBus);
    private readonly updateBus = inject(ChatbotUpdateBus);
    private readonly enableBus = inject(ChatbotEnableBus);
    private readonly disableBus = inject(ChatbotDisableBus);
    private readonly deleteBus = inject(ChatbotDeleteBus);

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
        filter: ChatbotFilterDto = {},
        page: string = PAGINATION_CONST.DEFAULT_PAGE,
        options: FetchOptions = {}
    ): void {
        const command = new ChatbotQuery(
            filter?.search,
            filter?.reportId,
            filter?.targetType,
            filter?.region,
            filter?.department,
            filter?.municipality,
            filter?.channels,
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
        const command = new ChatbotQuery(
            filter?.search,
            filter?.reportId,
            filter?.targetType,
            filter?.region,
            filter?.department,
            filter?.municipality,
            filter?.channels,
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
        const command = new ChatbotQuery(
            filter?.reportId,
            filter?.search,
            filter?.targetType,
            filter?.region,
            filter?.department,
            filter?.municipality,
            filter?.channels,
            filter?.startDate,
            filter?.endDate
        );
        const fetch$ = this.filterBus.dispatch(command, page);
        this.fetchWithFilterAndPage(filter, page, fetch$, this.uiFeedback);
        this.lastFetchTimestamp = Date.now();
    }

    refreshWithLastFilterAndPage(): void {
        const filter = this.filterSubject.getValue();
        const page = this.pageSubject.getValue();
        const command = new ChatbotQuery(
            filter?.reportId,
            filter?.search,
            filter?.targetType,
            filter?.region,
            filter?.department,
            filter?.municipality,
            filter?.channels,
            filter?.startDate,
            filter?.endDate
        );
        const fetch$ = this.filterBus.dispatch(command, page);
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

    create(chatbot: ChatbotCreateDto): void {
        this._actionState.set('loading');

        const command = new ChatbotCreateCommand(
            chatbot.reportId,
            chatbot.type,
            chatbot.targetType,
            chatbot.region,
            chatbot.department,
            chatbot.municipality,
            chatbot.channels,
            chatbot.subject,
            chatbot.content
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

    update(chatbot: ChatbotUpdateDto): void {
        this._actionState.set('loading');
        const command = new ChatbotUpdateCommand(
            chatbot.uniqId,
            chatbot.reportId,
            chatbot.type,
            chatbot.targetType,
            chatbot.region,
            chatbot.department,
            chatbot.municipality,
            chatbot.channels,
            chatbot.subject,
            chatbot.content
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

    enable(team: ChatbotEnableDto): void {
        const command = new ChatbotEnableCommand(team.uniqId);
        this.handleActionWithRefresh(
            this.enableBus.dispatch(command),
            'COMMON.SUCCESS.UPDATE'
        );
    }

    disable(team: ChatbotDisableDto): void {
        const command = new ChatbotDisableCommand(team.uniqId);
        this.handleActionWithRefresh(
            this.disableBus.dispatch(command),
            'COMMON.SUCCESS.UPDATE'
        );
    }

    delete(team: ChatbotDeleteDto): void {
        const command = new ChatbotDeleteCommand(team.uniqId);
        this.handleActionWithRefresh(
            this.deleteBus.dispatch(command),
            'COMMON.SUCCESS.DELETE'
        );
    }
}
