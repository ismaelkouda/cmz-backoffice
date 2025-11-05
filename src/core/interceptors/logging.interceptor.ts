import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { ConfigurationService } from '../services/configuration.service';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
    const configService = inject(ConfigurationService);
    const startTime = Date.now();

    return next(req).pipe(
        tap({
            next: (event) => {
                if (configService.isDevelopment) {
                    const duration = Date.now() - startTime;

                    console.group(`🌐 ${req.method} ${req.url}`);
                    console.log(`⏱️  Duration: ${duration}ms`);
                    console.log(`📤 Request:`, req.body);
                    console.log(`📥 Response:`, event);
                    console.log(`🏷️  Type: ${event.type}`);
                    console.groupEnd();
                }
            },
            error: (error) => {
                if (configService.isDevelopment) {
                    const duration = Date.now() - startTime;

                    console.group(`🚨 ${req.method} ${req.url}`);
                    console.log(`⏱️  Duration: ${duration}ms`);
                    console.log(`📤 Request:`, req.body);
                    console.log(`💥 Error:`, error);
                    console.log(`📋 Error Details:`, {
                        status: error.status,
                        message: error.message,
                        url: error.url,
                    });
                    console.groupEnd();
                }
            },
        })
    );
};
