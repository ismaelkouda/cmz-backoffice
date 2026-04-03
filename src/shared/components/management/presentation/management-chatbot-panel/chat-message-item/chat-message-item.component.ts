import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ChatMessageVM } from '../chatbot.types';

@Component({
    selector: 'app-chat-message-item',
    standalone: true,
    imports: [CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './chat-message-item.component.html',
    styleUrls: ['./chat-message-item.component.scss'],
})
export class ChatMessageItemComponent {
    readonly message = input.required<ChatMessageVM>();
}
