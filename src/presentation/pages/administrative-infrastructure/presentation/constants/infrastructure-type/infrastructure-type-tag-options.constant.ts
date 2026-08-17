/**
 * Options du champ "tag" du formulaire de type d'équipement (radio,
 * sélection unique, obligatoire). Les valeurs (`value`) sont celles
 * envoyées à l'API et doivent rester synchronisées avec le backend.
 */
export interface InfrastructureTypeTagOption {
    value: string;
    labelKey: string;
    /** Icône PrimeIcons illustrant la catégorie (rendu carte sélectionnable). */
    icon: string;
}

export const INFRASTRUCTURE_TYPE_TAG_OPTIONS: InfrastructureTypeTagOption[] = [
    {
        value: 'education',
        labelKey:
            'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE_TYPE.FORM.TAG_OPTIONS.EDUCATION',
        icon: 'pi-book',
    },
    {
        value: 'sante',
        labelKey:
            'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE_TYPE.FORM.TAG_OPTIONS.SANTE',
        icon: 'pi-heart',
    },
    {
        value: 'administration',
        labelKey:
            'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE_TYPE.FORM.TAG_OPTIONS.ADMINISTRATION',
        icon: 'pi-building',
    },
    {
        value: 'securite',
        labelKey:
            'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE_TYPE.FORM.TAG_OPTIONS.SECURITE',
        icon: 'pi-shield',
    },
    {
        value: 'autre',
        labelKey:
            'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE_TYPE.FORM.TAG_OPTIONS.AUTRE',
        icon: 'pi-tag',
    },
];
