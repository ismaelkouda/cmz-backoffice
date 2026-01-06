import { AbstractControl, ValidatorFn } from '@angular/forms';

export function semanticVersionValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        if (!control.value) {
            return null; // La validation required est séparée
        }

        const value = control.value.toString().trim();

        // Pattern pour semantic versioning (MAJOR.MINOR.PATCH)
        const semanticVersionPattern =
            /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;

        // Pattern pour versions simplifiées (1.0, 2, etc.)
        const simpleVersionPattern = /^\d+(\.\d+){0,2}$/;

        // Vérifier si c'est une version sémantique complète
        if (semanticVersionPattern.test(value)) {
            const match = value.match(semanticVersionPattern);
            const major = parseInt(match![1], 10);
            const minor = parseInt(match![2], 10);
            const patch = parseInt(match![3], 10);

            // Validation des valeurs
            if (major < 0 || minor < 0 || patch < 0) {
                return {
                    semanticVersion:
                        'Les numéros de version doivent être positifs',
                };
            }

            // Vérifier les pré-releases si présentes
            if (match![4]) {
                const preRelease = match![4];
                const preReleasePattern = /^[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*$/;
                if (!preReleasePattern.test(preRelease)) {
                    return {
                        semanticVersion: 'Format de pré-release invalide',
                    };
                }
            }

            // Vérifier les build metadata si présentes
            if (match![5]) {
                const buildMetadata = match![5];
                const buildPattern = /^[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*$/;
                if (!buildPattern.test(buildMetadata)) {
                    return {
                        semanticVersion:
                            'Format de métadonnées de build invalide',
                    };
                }
            }

            return null; // Version sémantique valide
        }

        // Vérifier si c'est une version simple
        if (simpleVersionPattern.test(value)) {
            // Séparer les parties
            const parts = value
                .split('.')
                .map((part: any) => parseInt(part, 10));

            // Vérifier chaque partie
            for (const part of parts) {
                if (part < 0 || isNaN(part)) {
                    return {
                        semanticVersion:
                            'Chaque partie de la version doit être un nombre positif',
                    };
                }
            }

            // Limiter le nombre de parties (max 3 pour MAJOR.MINOR.PATCH)
            if (parts.length > 3) {
                return {
                    semanticVersion:
                        'Maximum 3 parties autorisées (MAJOR.MINOR.PATCH)',
                };
            }

            return null; // Version simple valide
        }

        return {
            semanticVersion:
                'Format de version invalide. Utilisez le format: MAJOR.MINOR.PATCH (ex: 1.0.0)',
        };
    };
}
