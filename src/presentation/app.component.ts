import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxLoadingBar } from '@ngx-loading-bar/core';
import { TranslateModule } from '@ngx-translate/core';
import { TapToTopComponent } from '../shared/components/tap-to-top/tap-to-top.component';
import { AppCustomizationService } from '../shared/services/app-customization.service';
import { EncodingDataService } from '../shared/services/encoding-data.service';
import { EnvService } from '../shared/services/env.service';

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

    public readonly config = this.customizationService.config;

    ngOnInit(): void {
        this.initializeApplication();
    }

    private initializeApplication(): void {
        try {
            this.customizationService.applyCustomization();

            const userLang = this.customizationService.getUserLanguage();
            this.customizationService.setDefaultLanguage(userLang);

            this.saveAppSettings();
        } catch (error) {
            console.error(
                "Erreur lors de l'initialisation de l'application:",
                error
            );
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
