import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
    selector: 'app-dashboard-skeleton',
    standalone: true,
    templateUrl: './dashboard-skeleton.component.html',
    styleUrls: ['./dashboard-skeleton.component.scss'],
    imports: [SkeletonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class DashboardSkeletonComponent {}
