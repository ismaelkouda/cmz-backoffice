import { Injectable, NgZone, inject } from '@angular/core';
import { Observable } from 'rxjs';

export type GeolocationPermissionState = 'granted' | 'denied' | 'prompt';

export interface GeolocationPosition {
    lat: number;
    lng: number;
}

export enum GeolocationErrorType {
    PERMISSION_DENIED = 'PERMISSION_DENIED',
    POSITION_UNAVAILABLE = 'POSITION_UNAVAILABLE',
    TIMEOUT = 'TIMEOUT',
    BROWSER_NOT_SUPPORTED = 'BROWSER_NOT_SUPPORTED',
    UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface GeolocationError {
    type: GeolocationErrorType;
    message: string;
    originalError?: GeolocationPositionError | Error;
}

@Injectable({
    providedIn: 'root',
})
export class GeolocationService {
    private readonly ngZone = inject(NgZone);

    private hasGeolocationPosition(): boolean {
        return 'geolocation' in navigator;
    }

    private hasGeolocationPermission(): boolean {
        return 'permissions' in navigator;
    }

    private readonly positionOptions: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
    };

    public getPermissionState(): Observable<GeolocationPermissionState> {
        return new Observable((observer) => {
            if (!this.hasGeolocationPermission()) {
                observer.next('prompt');
                observer.complete();
                return;
            }

            navigator.permissions
                .query({ name: 'geolocation' as PermissionName })
                .then((result) => {
                    observer.next(result.state as GeolocationPermissionState);
                    observer.complete();
                })
                .catch(() => {
                    observer.next('prompt');
                    observer.complete();
                });
        });
    }

    public getCurrentPosition(
        options?: PositionOptions
    ): Observable<GeolocationPosition> {
        return new Observable<GeolocationPosition>((observer) => {
            if (!this.hasGeolocationPosition()) {
                observer.error(
                    this.createError(
                        GeolocationErrorType.BROWSER_NOT_SUPPORTED,
                        'Geolocation is not supported by this browser'
                    )
                );
                return;
            }
            const success = (position: globalThis.GeolocationPosition) => {
                this.ngZone.run(() => {
                    observer.next({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                    observer.complete();
                });
            };

            const error = (err: GeolocationPositionError) => {
                this.ngZone.run(() => {
                    observer.error(this.mapError(err));
                });
            };

            navigator.geolocation.getCurrentPosition(success, error, {
                ...this.positionOptions,
                ...options,
            });
        });
    }

    private mapError(error: GeolocationPositionError): GeolocationError {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                return this.createError(
                    GeolocationErrorType.PERMISSION_DENIED,
                    'Permission denied',
                    error
                );

            case error.POSITION_UNAVAILABLE:
                return this.createError(
                    GeolocationErrorType.POSITION_UNAVAILABLE,
                    'Position unavailable',
                    error
                );

            case error.TIMEOUT:
                return this.createError(
                    GeolocationErrorType.TIMEOUT,
                    'Geolocation timeout',
                    error
                );

            default:
                return this.createError(
                    GeolocationErrorType.UNKNOWN_ERROR,
                    'Unknown geolocation error',
                    error
                );
        }
    }

    public getErrorMessage(error: GeolocationError): string {
        switch (error.type) {
            case GeolocationErrorType.PERMISSION_DENIED:
                return 'Location permission denied. Please enable location access in your browser settings.';
            case GeolocationErrorType.POSITION_UNAVAILABLE:
                return 'Unable to determine your location. Please check your device GPS.';
            case GeolocationErrorType.TIMEOUT:
                return 'Location request timed out. Please try again.';
            case GeolocationErrorType.BROWSER_NOT_SUPPORTED:
                return 'Geolocation is not supported by your browser.';
            default:
                return (
                    error.message ||
                    'An error occurred while getting your location.'
                );
        }
    }

    private createError(
        type: GeolocationErrorType,
        message: string,
        originalError?: GeolocationPositionError | Error
    ): GeolocationError {
        return {
            type,
            message,
            originalError,
        };
    }
}
