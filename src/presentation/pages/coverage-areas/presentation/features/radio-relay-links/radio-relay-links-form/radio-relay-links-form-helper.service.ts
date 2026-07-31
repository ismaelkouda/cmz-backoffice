import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RadioRelayLinksFrequency } from '@pages/coverage-areas/domain/enums/radio-relay-links/radio-relay-links-frequency.enum';
import { COVERAGE_AREAS_ROUTE } from '@shared/routes/routes';
import { RADIO_RELAY_LINKS_ROUTE } from '@pages/coverage-areas/presentation/features/radio-relay-links/radio-relay-links-paths.constants';

@Injectable({
    providedIn: 'root',
})
export class RadioRelayLinksFormHelperService {
    private readonly router = inject(Router);

    navigateToRadioRelayLinksList(): void {
        this.router.navigate([
            COVERAGE_AREAS_ROUTE + '/' + RADIO_RELAY_LINKS_ROUTE,
        ]);
    }

    getSweetAlertTitle(isEditMode: boolean): string {
        return isEditMode
            ? 'COVERAGE_AREAS.RADIO_RELAY_LINKS.SWEET_ALERT.TITLE.EDIT'
            : 'COVERAGE_AREAS.RADIO_RELAY_LINKS.SWEET_ALERT.TITLE.CREATE';
    }

    getSweetAlertMessage(isEditMode: boolean): string {
        return isEditMode
            ? 'COVERAGE_AREAS.RADIO_RELAY_LINKS.SWEET_ALERT.MESSAGE.EDIT'
            : 'COVERAGE_AREAS.RADIO_RELAY_LINKS.SWEET_ALERT.MESSAGE.CREATE';
    }

    parseFrequency(
        frequency: RadioRelayLinksFrequency | string | undefined
    ): number | undefined {
        if (!frequency) {
            return undefined;
        }

        const numeric = parseInt(
            String(frequency).replace(/MHZ$/i, ''),
            10
        );

        return Number.isNaN(numeric) ? undefined : numeric;
    }

    formatFrequency(
        value: number | undefined
    ): RadioRelayLinksFrequency | undefined {
        if (value == null || Number.isNaN(value)) {
            return undefined;
        }

        return `${value}MHZ` as RadioRelayLinksFrequency;
    }
}
