import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
    selector: 'app-profiles-permissions-form-skeleton',
    standalone: true,
    imports: [SkeletonModule],
    templateUrl: './profiles-permissions-form-skeleton.component.html',
    styleUrls: ['./profiles-permissions-form-skeleton.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilesPermissionsFormSkeletonComponent implements OnInit {
    ngOnInit(): void {
        console.log();
    }
}
