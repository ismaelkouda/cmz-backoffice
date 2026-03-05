import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
    selector: 'app-messaging-form-skeleton',
    standalone: true,
    imports: [CommonModule, SkeletonModule],
    templateUrl: './messaging-form-skeleton.component.html',
    styleUrls: ['./messaging-form-skeleton.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagingFormSkeletonComponent implements OnInit {
    ngOnInit(): void {
        console.log();
    }
}
