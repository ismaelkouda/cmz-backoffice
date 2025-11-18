import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
    inject,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-report',
    standalone: true,
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.scss'],
    imports: [
        CommonModule,
        BreadcrumbComponent,
        PageTitleComponent,
        TranslateModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportComponent implements OnInit, OnDestroy {
    private readonly title = inject(Title);
    public module!: string;
    public subModule!: string;
    private readonly destroy$ = new Subject<void>();

    isFullscreen: boolean = false;

    constructor(private readonly activatedRoute: ActivatedRoute) {}

    ngOnInit(): void {
        this.activatedRoute.data
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                this.title.setTitle(data['title'] ?? 'REPORTING.REPORT.TITLE');
                this.module = data['module'] ?? 'REPORTING.LABEL';
                this.subModule = data['subModule'] ?? 'REPORTING.REPORT.LABEL';
            });
    }

    onIframeLoad() {}

    onIframeError() {
        console.error('Error loading Grafana iframe');
    }

    toggleFullscreen() {
        this.isFullscreen = !this.isFullscreen;

        if (this.isFullscreen) {
            // Empêcher le scroll du body en mode plein écran
            document.body.style.overflow = 'hidden';
        } else {
            // Restaurer le scroll du body
            document.body.style.overflow = 'auto';
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
