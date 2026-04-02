import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    input,
    output,
    ViewChild,
    ElementRef,
    effect,
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
            if (this.messages().length > 0 && this.shouldAutoScroll) {
                setTimeout(() => this.scrollToBottom(), 30);
            }
        });
    }

    onScroll(): void {
        const el = this.scrollContainerRef?.nativeElement;
        if (!el) {
            return;
        }

        if (el.scrollTop < 40 && !this.loading()) {
            this.shouldAutoScroll = false;
            this.loadNextPage.emit();
        }
    }

    private scrollToBottom(): void {
        const el = this.scrollContainerRef?.nativeElement;
        if (el) {
            el.scrollTop = el.scrollHeight;
            this.shouldAutoScroll = true;
        }
    }
}
