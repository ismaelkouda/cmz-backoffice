import { BADGE_ETAT } from '../constants/badge-etat.contant';

export function getRapportCodeStyle(data: any): string {
    if (
        data?.etat_soumission === BADGE_ETAT.RECU &&
        (data?.etat_cloture !== BADGE_ETAT.REFUSE ||
            data?.etat_cloture !== BADGE_ETAT.REJETE)
    ) {
        return 'header-recu';
    } else if (data?.etat_soumission === BADGE_ETAT.ABANDONNE) {
        return 'header-abandonne';
    } else if (
        data?.etat_traitement === BADGE_ETAT.REJETE ||
        data?.etat_cloture === BADGE_ETAT.REFUSE
    ) {
        return 'header-rejete';
    } else if (
        data?.etat_traitement === BADGE_ETAT.PARTIEL ||
        data?.etat_traitement === BADGE_ETAT.CLOTURE
    ) {
        return 'header-partiel';
    } else {
        return 'header-default';
    }
}
