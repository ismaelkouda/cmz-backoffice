import { CommonModule } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    inject,
} from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { FooterComponent } from '@shared/components/footer/footer.component';
import { HeaderComponent } from '@shared/components/header/header.component';
import { PrivacyPolicyDialogComponent } from '@shared/components/privacy-policy-dialog/privacy-policy-dialog.component';
import { SidebarComponent } from '@shared/components/sidebar/sidebar.component';
import { fadeInAnimation } from '@shared/data/router-animation/router-animation';
import { AppCustomizationService } from '@shared/domain/services/app-customization/app-customization.service';
import { NavService } from '@shared/domain/services/nav.service';
import * as feather from 'feather-icons';
import { filter } from 'rxjs';

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
        PrivacyPolicyDialogComponent,
    ],
    animations: [fadeInAnimation],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentComponent implements AfterViewInit {
    navServices = inject(NavService);
    private readonly router = inject(Router);

    public readonly config = inject(AppCustomizationService);
    public readonly layoutType = this.config.layoutType;
    public readonly sidebarType = this.config.sidebarType;
    public readonly sidebarIcon = this.config.sidebarIcon;
    public showTabs = false;

    /**
     * Le thème ne définit aucune règle 'light-sidebar' : seule la variante
     * 'dark-sidebar' est stylée. On la renvoie toujours, comme le faisait
     * le template original ('compact-wrapper dark-sidebar'), indépendamment
     * du mode clair/sombre.
     */
    public readonly layoutClass = 'dark-sidebar';

    constructor() {
        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe(() => {
                setTimeout(() => {
                    this.showTabs = true;
                }, 2500);
            });

        this.config.listenToSystemMode();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            feather.replace();
        });
    }
}
