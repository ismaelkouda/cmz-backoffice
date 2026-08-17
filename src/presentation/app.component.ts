import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxLoadingBar } from '@ngx-loading-bar/core';
import { TranslateModule } from '@ngx-translate/core';
import { TapToTopComponent } from '@shared/components/tap-to-top/tap-to-top.component';
import { AppCustomizationService } from '@shared/domain/services/app-customization/app-customization.service';
import { EncodingDataService } from '@shared/domain/services/encoding-data.service';

import { EnvService } from '../core/config/env.service';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [TapToTopComponent, RouterOutlet, NgxLoadingBar, TranslateModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
    private readonly customizationService = inject(AppCustomizationService);
    private readonly envService = inject(EnvService);
    private readonly encodingService = inject(EncodingDataService);

    public readonly config = this.customizationService.customization;

    ngOnInit(): void {
        this.initializeApplication();
    }

    private initializeApplication(): void {
        try {
            const userLang = this.customizationService.getUserLanguage();
            this.customizationService.setDefaultLanguage(userLang);

            const userMode = this.customizationService.getUserMode();
            this.customizationService.setDefaultMode(userMode);

            this.customizationService.applyCustomization();

            this.saveAppSettings();
        } catch (error) {
            console.error("Erreur lors de l'initialisation:", error);
        }
    }

    private saveAppSettings(): void {
        try {
            const appSettings = this.envService.appSettings;
            if (appSettings) {
                this.encodingService.saveData(
                    'app_settings',
                    appSettings,
                    true
                );
            }
        } catch (error) {
            console.error('Erreur lors du stockage des paramètres:', error);
        }
    }
}
