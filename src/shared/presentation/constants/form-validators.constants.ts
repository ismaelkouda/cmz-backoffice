/**
 * Regles de validation de formulaire (regex + longueurs) partagees entre modules.
 *
 * Extrait suite a une duplication identique constatee (memes cles NAME/DESCRIPTION/
 * FIRST_NAME/LAST_NAME/EMAIL/PHONE, memes patterns/longueurs) dans au moins 7 fichiers
 * `domain/validators/form-validators.ts` a travers le depot (administrative-infrastructure,
 * settings-security — copie strictement identique octet pour octet —, team-organization,
 * administrative-boundary, content-management, communication, shared/components/management).
 * Certains de ces modules ajoutent des cles propres (CODE, REPORT_ID, SUBJECT, CONTENT,
 * MESSAGE...) : ce fichier centralise uniquement le socle commun, chaque module composant
 * ensuite ses cles specifiques par-dessus (`{ ...COMMON_FORM_VALIDATORS, CODE: {...} }`).
 *
 * Note de nommage/emplacement (deux corrections successives, pas une seule) :
 * 1. Ce fichier vivait a l'origine sous `domain/validators/form-validators.ts` dans
 * administrative-infrastructure, au meme niveau que les Validator du domaine
 * (assertion functions Contract -> ValidateContract). Ce n'est pas un Validator au
 * sens de ce projet (pas de fonction, pas de throw, pas de ValidateContract) — d'ou
 * un premier renommage/deplacement vers `domain/constants/` (Experience 046).
 * 2. Verification plus poussee (Experience 047) : meme un `domain/constants/`, le
 * contenu reste un jugement de couche errone. Ces regles (regex/longueurs) ne sont
 * consommees NULLE PART par la couche domain reelle (`domain/validators/*.validator.ts`,
 * qui ne verifie que la presence des champs, jamais un pattern/une longueur) — leurs
 * seuls consommateurs reels, verifies par grep, sont `presentation/store/*.store.ts`
 * et `presentation/features/*.component.ts`, ou elles alimentent directement
 * `Validators.pattern`/`Validators.minLength`/`Validators.maxLength` d'Angular
 * Reactive Forms. C'est une contrainte de couche presentation (comment un champ doit
 * se comporter dans un formulaire), pas un invariant de domaine (une regle qui doit
 * tenir vrai independamment de l'UI). Le module `authentication` confirme deja cette
 * convention dans le code reel : `presentation/constants/{feature}/{feature}-form
 * -error-messages.constant.ts`. Deplace en consequence vers `presentation/constants/`
 * (ici, cote shared ; et cote module reel vers `presentation/constants/` egalement).
 * check-semantics.js (regle 4, qui compare Validators.required aux Validator du
 * domaine) n'a toujours rien a verifier ici, pour la meme raison qu'avant.
 */
export const COMMON_FORM_VALIDATORS = {
    NAME: {
        MIN: 3,
        MAX: 100,
        PATTERN: /^[a-zA-Z0-9À-ÿ\s\-!?.,;:'"()&%$€£@#+*/=°§]{3,}$/,
    },
    DESCRIPTION: {
        MIN: 10,
        MAX: 250,
        PATTERN: /^[a-zA-Z0-9À-ÿ\s\-!?.,;:'"()&%$€£@#+*/=°§]{10,}$/,
    },
    FIRST_NAME: {
        MIN: 2,
        MAX: 50,
        PATTERN: /^[a-zA-ZÀ-ÿ\s\-']{2,}$/,
    },
    LAST_NAME: {
        MIN: 2,
        MAX: 50,
        PATTERN: /^[a-zA-ZÀ-ÿ\s\-']{2,}$/,
    },
    EMAIL: {
        MIN: 5,
        MAX: 100,
        PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    PHONE: {
        MIN: 9,
        MAX: 14,
        PATTERN: /^\d{2}-\d{2}-\d{2}-\d{2}-\d{2}$/,
    },
};
