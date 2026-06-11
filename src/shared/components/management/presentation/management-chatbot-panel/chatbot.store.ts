import { inject, Injectable, signal, computed, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ChatbotFacade } from '@shared/components/management/application/services/chatbot/chatbot.facade';
import { ChatbotEntity } from '@shared/components/management/domain/entities/chatbot/chatbot.entity';

import { ChatbotPresenter } from './chatbot.presenter';
import { ChatMessageVM } from './chatbot.types';

@Injectable()
export class ChatbotStore {
    private readonly facade = inject(ChatbotFacade);
    private readonly presenter = inject(ChatbotPresenter);

    // ── State ─────────────────────────────────────────────────────
    private readonly _currentUniqId = signal<string>('');
    private readonly _draftMessage = signal<string>('');
    private readonly _sending = signal<boolean>(false);
    private readonly _currentPage = signal<number>(1);
    private readonly _hasNextPage = signal<boolean>(true);
    private readonly _isLoadingNextPage = signal<boolean>(false);

    private readonly _accumulatedMessages = signal<ChatbotEntity[]>([]);

    // ── Signals from Facade ───────────────────────────────────────
    readonly apiItems = toSignal(this.facade.items$, {
        initialValue: [] as ChatbotEntity[],
    });
    readonly loading = toSignal(this.facade.isLoading$, {
        initialValue: false,
    });
    readonly pagination = toSignal(this.facade.pagination$, {
        initialValue: null,
    });
    readonly actionSuccess = this.facade.actionSuccess; // signal<number>
    readonly actionState = this.facade.actionState; // 'idle' | 'loading'

    // ── Public Readonly State ─────────────────────────────────────
    readonly currentUniqId = this._currentUniqId.asReadonly();
    readonly draftMessage = this._draftMessage.asReadonly();
    readonly sending = computed(
        () => this._sending() || this.actionState() === 'loading'
    );

    // ── Computed UI ───────────────────────────────────────────────
    readonly rawMessages = computed(() => this._accumulatedMessages());

    readonly sortedMessages = computed<ChatMessageVM[]>(() => {
        const mapped = this.presenter.mapToVM(this.rawMessages());
        return [...mapped].sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateB - dateA; // descendant : plus récent en premier
        });
    });

    /** Version inversée pour affichage chat (plus récent en bas) */
    readonly messages = computed(() => [...this.sortedMessages()].reverse());

    readonly isDraftValid = computed(() => {
        const trimmed = this._draftMessage().trim();
        return trimmed.length > 0 && trimmed.length <= 250;
    });

    readonly isSendDisabled = computed(
        () => !this.isDraftValid() || this.sending()
    );

    readonly hasNextPage = this._hasNextPage.asReadonly();

    private lastSuccessCount = 0;

    private readonly syncEffect = effect(() => {
        const newItems = this.apiItems();
        const isNextPageLoad = this._isLoadingNextPage();

        if (isNextPageLoad) {
            this._accumulatedMessages.update((current) => {
                const existingIds = new Set(
                    current.map((m) => m.uniqId || m.uniqId)
                );
                const uniqueNew = newItems.filter(
                    (m) => !existingIds.has(m.uniqId || m.uniqId)
                );
                return [...uniqueNew, ...current];
            });
        } else {
            this._accumulatedMessages.set(newItems);
        }

        this._isLoadingNextPage.set(false);

        const pag = this.pagination();
        if (pag?.last_page) {
            this._hasNextPage.set(this._currentPage() < pag.last_page);
        }
    });

    /** Déclenchement du load quand uniqId change */
    private readonly loadOnUniqIdChange = effect(() => {
        const uniqId = this._currentUniqId();
        if (uniqId) {
            this.loadMessages(uniqId, 1);
        }
    });

    /** Gestion succès envoi */
    private readonly successEffect = effect(() => {
        const currentSuccess = this.actionSuccess();
        if (currentSuccess > this.lastSuccessCount) {
            this.lastSuccessCount = currentSuccess;
            this._draftMessage.set('');
            this._sending.set(false);
        }
    });

    // ── Public API ────────────────────────────────────────────────
    public setUniqId(uniqId: string): void {
        this._currentUniqId.set(uniqId);
    }

    public loadMessages(uniqId: string, page = 1): void {
        if (!uniqId) {
            return;
        }

        this._currentUniqId.set(uniqId);
        this._currentPage.set(page);
        this._isLoadingNextPage.set(page > 1);

        const filter = {
            search: uniqId,
        };

        this.facade.readAll(filter, page.toString());
    }

    public loadNextPage(): void {
        if (!this.hasNextPage() || this.loading()) {
            return;
        }
        const nextPage = this._currentPage() + 1;
        this.loadMessages(this._currentUniqId(), nextPage);
    }

    public refresh(): void {
        const uniqId = this._currentUniqId();
        if (uniqId) {
            this.loadMessages(uniqId, 1);
        }
    }

    public updateDraft(value: string): void {
        this._draftMessage.set(value.slice(0, 250));
    }

    public sendMessage(): void {
        const content = this._draftMessage().trim();
        const uniqId = this._currentUniqId();

        if (!uniqId || !content || !this.isDraftValid()) {
            return;
        }

        this._sending.set(true);

        this.facade.create({
            type: 'awareness',
            reportId: uniqId,
            targetType: 'report',
            channels: ['push', 'mail'],
            subject: 'vsdvsdvdsvdsvdsvds',
            content: content,
            region: '',
            department: '',
            municipality: '',
        });
        // Le reset du draft et du sending se fait dans l'effect success
    }

    public reset(): void {
        this._currentUniqId.set('');
        this._accumulatedMessages.set([]);
        this._draftMessage.set('');
        this._sending.set(false);
        this._currentPage.set(1);
        this._hasNextPage.set(true);
        this._isLoadingNextPage.set(false);
    }
}
