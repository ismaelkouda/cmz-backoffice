import {
    ChangeDetectionStrategy,
    Component,
    effect,
    inject,
    input,
    OnDestroy,
    signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ChatInputComponent } from '@shared/components/management/presentation/management-chatbot-panel/chat-input/chat-input.component';
import { ChatMessageListComponent } from '@shared/components/management/presentation/management-chatbot-panel/chat-message-list/chat-message-list.component';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';

import { ChatbotStore } from './chatbot.store';

@Component({
    selector: 'app-management-chatbot-panel',
    standalone: true,
    imports: [
        TranslateModule,
        ButtonModule,
        SkeletonModule,
        TooltipModule,
        ChatMessageListComponent,
        ChatInputComponent,
    ],
    providers: [ChatbotStore],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './management-chatbot-panel.component.html',
    styleUrls: ['./management-chatbot-panel.component.scss'],
})
export class ManagementChatbotPanelComponent implements OnDestroy {
    readonly uniqId = input.required<string>();

    public readonly store = inject(ChatbotStore);

    readonly messages = this.store.messages;
    readonly loading = this.store.loading;
    readonly sending = this.store.sending;
    readonly draft = this.store.draftMessage;
    readonly isSendDisabled = this.store.isSendDisabled;

    readonly isTyping = signal<boolean>(false);

    constructor() {
        effect(
            () => {
                const currentUniqId = this.uniqId();
                if (currentUniqId) {
                    this.store.setUniqId(currentUniqId);
                }
            },
            { allowSignalWrites: true }
        );
    }

    ngOnDestroy(): void {
        this.store.reset();
    }

    onRefreshClicked(): void {
        this.store.refresh();
    }

    onDraftChange(value: string): void {
        this.store.updateDraft(value);
    }

    onSendClicked(): void {
        this.store.sendMessage();
    }
}
