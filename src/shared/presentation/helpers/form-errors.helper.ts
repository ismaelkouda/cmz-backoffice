import { FormControl } from '@angular/forms';

/**
 * Resout le message d'erreur a afficher pour un FormControl donne, a partir d'une table
 * de messages par cle d'erreur Angular (required, email, minlength, mismatch, ...).
 *
 * Extrait vers shared (aucune logique specifique a un module) : ce helper vivait a
 * l'origine sous `presentation/pages/authentication/presentation/helpers/
 * authentication-form-errors.helper.ts`, consomme par les 3 stores de authentication
 * (login, forgot-password, reset-password). Un second module, `shared/components/header/
 * elements/my-account` (stores password-change/profile-update/two-factor), tentait deja
 * de le reutiliser directement depuis authentication (`import { getControlError } from
 * '@presentation/pages/authentication/...'`, ligne commentee, code non branche a ce jour)
 * — signe concret d'un besoin reel au-dela du seul module authentication, pas seulement
 * hypothetique. Fonction pure, zero dependance a un module metier (FormControl + table de
 * messages -> string | null), meme raisonnement que l'extraction de
 * COMMON_FORM_VALIDATORS (@shared/presentation/constants/form-validators.constants.ts).
 *
 * Chaque module consommateur conserve un point d'import local qui re-exporte celui-ci
 * (meme convention que form-validators.constants.ts), pas un import direct vers shared,
 * pour garder la possibilite d'une composition/override locale future sans casser les
 * imports existants.
 *
 * @param control - Le FormControl Angular a inspecter (touched + errors).
 * @param messages - Table de messages par cle d'erreur Angular (required, email, ...).
 * @returns Le message correspondant a la premiere erreur active, ou null si le controle
 * n'a pas ete touche ou n'a aucune erreur.
 */
export function getControlError(
    control: FormControl,
    messages: Record<string, string>
): string | null {
    if (!control.touched || !control.errors) {
        return null;
    }

    const errorKey = Object.keys(control.errors)[0];

    return messages[errorKey] ?? null;
}
