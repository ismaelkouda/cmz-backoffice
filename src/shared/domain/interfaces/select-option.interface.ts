/**
 * Forme partagee d'une option de liste deroulante (select). Remplace des classes
 * "SelectEntity" par module (ex. InfrastructureSelectEntity, InfrastructureTypeSelectEntity)
 * qui n'etaient que des wrappers pass-through : constructeur + 2 getters recopiant
 * exactement les 2 champs de leurs Props, sans la moindre transformation ni regle
 * metier — exactement le profil qu'Experience 010 (design_decisions_v7) qualifie
 * d'Entity a eliminer au profit d'un type simple.
 */
export interface SelectOption {
    value: string;
    label: string;
}
