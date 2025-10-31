import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './presentation/app.module';

loadEnvConfig().then(() => {
    const env = (window as any).__env;

    if (env?.environmentDeployment === 'PROD') {
        enableProdMode();
    }

    platformBrowserDynamic()
        .bootstrapModule(AppModule)
        .catch((err) => console.error(err));
});

function loadEnvConfig(): Promise<void> {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'assets/config/env.js';
        script.onload = () => resolve();
        script.onerror = () => reject(`❌ Could not load env.js`);
        document.head.appendChild(script);
    });
}

//bootstrapApplication(AppComponent, ).catch((err) => console.error(err));
