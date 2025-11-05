import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './presentation/app.component';
import { appConfig } from './presentation/app.config';

try {

    globalThis.window?.addEventListener('error', (event) => {
        console.error('🚨 Global Error:', event.error);
    });
    
    globalThis.window?.addEventListener('unhandledrejection', (event) => {
        console.error('🚨 Unhandled Promise Rejection:', event.reason);
        event.preventDefault();
    });

    performance?.mark('app-bootstrap-start');

    bootstrapApplication(AppComponent, appConfig);

    performance?.mark('app-bootstrap-end');
    performance?.measure('app-bootstrap', 'app-bootstrap-start', 'app-bootstrap-end');
    
    const measure = performance?.getEntriesByName('app-bootstrap')[0];
    console.log(`🚀 Application bootstrapped in ${measure?.duration.toFixed(2)}ms`);
    console.log('🎉 Application successfully bootstrapped!');
    
} catch (error) {
    console.error('💥 Failed to bootstrap application:', error);
    displayBootstrapError(error);
}

function displayBootstrapError(error: any): void {
    const errorElement = document.createElement('div');
    errorElement.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        background: #dc3545;
        color: white;
        padding: 1rem;
        text-align: center;
        font-family: Arial, sans-serif;
        z-index: 9999;
    `;
    errorElement.innerHTML = `
        <strong>🚨 Application Error</strong>
        <p>Failed to load the application. Please refresh the page or contact support.</p>
        <small>Error: ${error.message}</small>
    `;
    document.body.appendChild(errorElement);
}