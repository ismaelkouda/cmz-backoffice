import {
    ChangeDetectionStrategy,
    Component,
    input,
    output,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-chat-input',
    standalone: true,
    imports: [ButtonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './chat-input.component.html',
    styleUrls: ['./chat-input.component.scss'],
})
export class ChatInputComponent {
    readonly draft = input.required<string>();
    readonly sending = input<boolean>(false);

    readonly draftChange = output<string>();
    readonly send = output();

    readonly maxLength = 250;

    onInput(event: Event): void {
        const value = (event.target as HTMLTextAreaElement).value;
        this.draftChange.emit(value);
    }

    onSend(): void {
        if (this.draft().trim() && !this.sending()) {
            this.send.emit();
        }
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.onSend();
        }
    }
}
