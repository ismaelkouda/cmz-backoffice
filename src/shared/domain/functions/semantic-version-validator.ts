import { AbstractControl, ValidatorFn } from '@angular/forms';

export function semanticVersionValidator(): ValidatorFn {
    return (control: AbstractControl): Record<string, any> | null => {
        if (!control.value) {
            return null;
        }

        const value = control.value.toString().trim();

        const semanticVersionPattern =
            /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;

        const simpleVersionPattern = /^\d+(\.\d+){0,2}$/;

        if (semanticVersionPattern.test(value)) {
            const match = value.match(semanticVersionPattern);
            const major = Number.parseInt(match[1], 10);
            const minor = Number.parseInt(match[2], 10);
            const patch = Number.parseInt(match[3], 10);

            if (major < 0 || minor < 0 || patch < 0) {
                return {
                    semanticVersion:
                        'Les numéros de version doivent être positifs',
                };
            }

            if (match[4]) {
                const preRelease = match[4];
                const preReleasePattern = /^[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*$/;
                if (!preReleasePattern.test(preRelease)) {
                    return {
                        semanticVersion: 'Format de pré-release invalide',
                    };
                }
            }

            if (match[5]) {
                const buildMetadata = match[5];
                const buildPattern = /^[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*$/;
                if (!buildPattern.test(buildMetadata)) {
                    return {
                        semanticVersion:
                            'Format de métadonnées de build invalide',
                    };
                }
            }

            return null;
        }

        if (simpleVersionPattern.test(value)) {
            const parts = value
                .split('.')
                .map((part: any) => Number.parseInt(part, 10));
            for (const part of parts) {
                if (part < 0 || Number.isNaN(part)) {
                    return {
                        semanticVersion:
                            'Chaque partie de la version doit être un nombre positif',
                    };
                }
            }
            if (parts.length > 3) {
                return {
                    semanticVersion:
                        'Maximum 3 parties autorisées (MAJOR.MINOR.PATCH)',
                };
            }
            return null;
        }
        return {
            semanticVersion:
                'Format de version invalide. Utilisez le format: MAJOR.MINOR.PATCH (ex: 1.0.0)',
        };
    };
}
