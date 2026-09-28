import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SlaThresholdsComponent } from './sla-thresholds.component';

@Component({
    selector: 'app-sla-system-thresholds',
    standalone: true,
    imports: [SlaThresholdsComponent],
    template: '<app-sla-thresholds [system]="true" />',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlaSystemThresholdsComponent {
    readonly mode = 'system';
}
