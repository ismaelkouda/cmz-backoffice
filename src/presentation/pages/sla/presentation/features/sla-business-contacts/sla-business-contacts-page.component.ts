import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-sla-business-contacts-page',
    standalone: true,
    imports: [
        BreadcrumbComponent,
        PageTitleComponent,
        RouterOutlet,
        TranslateModule,
    ],
    templateUrl: './sla-business-contacts-page.component.html',
    styleUrls: ['./sla-business-contacts-page.component.scss'],
})
export class SlaBusinessContactsPageComponent {
    readonly page = true;
}
