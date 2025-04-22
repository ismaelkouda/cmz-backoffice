import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { environment } from './environments/environment';
import { AppModule } from './presentation/app.module';

// if (environment.production) {
//     enableProdMode();
// }
function loadEnvConfig(): Promise<void> {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'assets/config/env.template.js'; // ✅ use the generated env.js
        script.onload = () => resolve();
        script.onerror = () => reject(`❌ Could not load env.js`);
        document.head.appendChild(script);
    });
}

loadEnvConfig().then(() => {
    const env = (window as any).__env;
    console.log('✅ Loaded env:', env);

    if (env?.environmentDeployment === 'PROD') {
        enableProdMode();
    }

    platformBrowserDynamic()
        .bootstrapModule(AppModule)
        .catch((err) => console.error(err));
});
