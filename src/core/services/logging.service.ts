import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class LoggingService {
    logError(message: string): void {
        // Implement logging to an external service, or at least log to the console
        console.error(message);
    }

    logInfo(message: string): void {
        // Could also log to an external monitoring service
        console.info(message);
    }
}
