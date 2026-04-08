import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    input,
    output,
    ViewChild,
    ElementRef,
    effect,
    afterNextRender,
} from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';

import { ChatMessageItemComponent } from '../chat-message-item/chat-message-item.component';
import { ChatMessageVM } from '../chatbot.types';

@Component({
    selector: 'app-chat-message-list',
    standalone: true,
    imports: [CommonModule, SkeletonModule, ChatMessageItemComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './chat-message-list.component.html',
    styleUrls: ['./chat-message-list.component.scss'],
})
export class ChatMessageListComponent {
    readonly messages = input.required<ChatMessageVM[]>();
    readonly loading = input<boolean>(false);

    readonly loadNextPage = output();

    @ViewChild('scrollContainer')
    private readonly scrollContainerRef!: ElementRef<HTMLDivElement>;

    private shouldAutoScroll = true;

    constructor() {
        effect(() => {
            const currentMessages = this.messages();
            if (currentMessages.length > 0 && this.shouldAutoScroll) {
                afterNextRender(() => {
                    this.scrollToBottom();
                });
            }
        });
    }

    onScroll(): void {
        const el = this.scrollContainerRef?.nativeElement;
        if (!el) {
            return;
        }

        // Détection du scroll en haut pour charger les anciens messages
        if (el.scrollTop <= 50 && !this.loading()) {
            this.shouldAutoScroll = false;
            this.loadNextPage.emit();
        }

        // Mise à jour de l'état auto-scroll
        const isAtBottom =
            el.scrollHeight - el.scrollTop - el.clientHeight < 80;
        if (isAtBottom) {
            this.shouldAutoScroll = true;
        }
    }

    private scrollToBottom(smooth = false): void {
        const el = this.scrollContainerRef?.nativeElement;
        if (!el) {
            return;
        }

        if (smooth) {
            el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
        } else {
            el.scrollTop = el.scrollHeight;
        }
    }
}
