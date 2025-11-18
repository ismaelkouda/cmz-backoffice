import { NgModule, Optional, SkipSelf } from '@angular/core';
import { ConfigurationService } from './services/configuration.service';

@NgModule({
    providers: [ConfigurationService],
})
export class CoreModule {
    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error(
                'CoreModule est déjà chargé. Importer uniquement dans AppModule.'
            );
        }
    }
}
