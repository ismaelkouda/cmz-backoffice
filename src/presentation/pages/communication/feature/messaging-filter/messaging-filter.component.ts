import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-messaging-filter',
    standalone: true,
    templateUrl: './messaging-filter.component.html',
    styleUrls: ['./messaging-filter.component.scss'],
    imports: [CommonModule, TranslateModule, ButtonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagingFilterComponent {
    onFilter(): void {
        // Implement filter logic
    }

    onReset(): void {
        // Implement reset logic
    }
}
