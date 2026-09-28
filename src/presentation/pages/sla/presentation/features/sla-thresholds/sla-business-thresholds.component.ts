import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SlaThresholdsComponent } from './sla-thresholds.component';

@Component({
    selector: 'app-sla-business-thresholds',
    standalone: true,
    imports: [SlaThresholdsComponent],
    template: '<app-sla-thresholds />',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlaBusinessThresholdsComponent {
    readonly mode = 'business';
}
