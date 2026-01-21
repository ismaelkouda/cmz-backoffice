import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { BreadcrumbService } from './breadcrumb.service';

@Component({
    selector: 'app-breadcrumb',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, BreadcrumbModule, RouterModule, TranslateModule],
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent {
    private readonly service = inject(BreadcrumbService);
    private readonly translate = inject(TranslateService);

    readonly items = computed(() =>
        this.service.breadcrumbs().map((item) => ({
            label: this.translate.instant(item.label),
            icon: this.translate.instant(item.icon ?? ''),
            routerLink: this.translate.instant(item.url),
        }))
    );
}
