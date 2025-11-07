import { Component, inject } from '@angular/core';
import { ConfigurationService } from '../../../core/services/configuration.service';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
})

export class FooterComponent {
    public today: number = Date.now();
    private configService = inject(ConfigurationService);
    public readonly appSettings = this.configService.appSettings;
}
