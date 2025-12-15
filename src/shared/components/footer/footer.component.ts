import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ConfigurationService } from '@core/services/configuration.service';
import { TranslateModule } from '@ngx-translate/core';
import { AppCustomizationService } from '@shared/services/app-customization.service';

@Component({
    selector: 'app-footer',
    standalone: true,
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    imports: [CommonModule, TranslateModule],
})
export class FooterComponent {
    public today: number = Date.now();
    private readonly configService = inject(ConfigurationService);
    public readonly appSettings = this.configService.appSettings;
    public readonly config = inject(AppCustomizationService).config;
    public currentYear = new Date().getFullYear();
}
