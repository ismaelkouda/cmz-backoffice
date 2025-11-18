import { CommonModule } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    inject,
} from '@angular/core';
import {
    ActivatedRoute,
    NavigationEnd,
    Router,
    RouterOutlet,
} from '@angular/router';
import { fadeInAnimation } from '@shared/data/router-animation/router-animation';
import { AppCustomizationService } from '@shared/services/app-customization.service';
import { LayoutService } from '@shared/services/layout.service';
import { NavService } from '@shared/services/nav.service';
import * as feather from 'feather-icons';
import { filter } from 'rxjs';
import { FooterComponent } from '../../footer/footer.component';
import { HeaderComponent } from '../../header/header.component';
import { SidebarComponent } from '../../sidebar/sidebar.component';

@Component({
    selector: 'app-content',
    standalone: true,
    templateUrl: './content.component.html',
    styleUrls: ['./content.component.scss'],
    imports: [
        CommonModule,
        FooterComponent,
        SidebarComponent,
        HeaderComponent,
        RouterOutlet,
    ],
    animations: [fadeInAnimation],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentComponent implements AfterViewInit {
    public readonly config = inject(AppCustomizationService).config;
    public showTabs = false;

    constructor(
        private route: ActivatedRoute,
        public navServices: NavService,
        public layout: LayoutService,
        private router: Router
    ) {
        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe(() => {
                setTimeout(() => {
                    this.showTabs = true;
                }, 2500);
            });

        this.route.queryParams.subscribe((params) => {
            this.layout.config.settings.layout = params['layout']
                ? params['layout']
                : this.layout.config.settings.layout;
        });
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            feather.replace();
        });
    }

    get layoutClass(): string {
        switch (globalThis.localStorage.getItem('layout')) {
            case 'Paris':
                return 'compact-wrapper dark-sidebar';
            case 'Barcelona':
                return this.navServices.horizontal
                    ? 'horizontal-wrapper enterprice-type advance-layout'
                    : 'compact-wrapper enterprice-type advance-layout';
            default:
                return 'compact-wrapper dark-sidebar';
        }
    }
}
