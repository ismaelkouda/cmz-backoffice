/**
 * Options du champ "tag" du formulaire de type d'équipement (radio,
 * sélection unique, obligatoire). Les valeurs (`value`) sont celles
 * envoyées à l'API et doivent rester synchronisées avec le backend.
 */
export interface InfrastructureTypeTagOption {
    value: string;
    label: string;
    /** Icône PrimeIcons illustrant la catégorie (rendu carte sélectionnable). */
    icon: string;
}

export enum InfrastructureTypeTag {
    EDUCATION = 'education',
    SANTE = 'sante',
    ADMINISTRATION = 'administration',
    SECURITE = 'securite',
    AUTRE = 'autre',
}

export const INFRASTRUCTURE_TYPE_TAG_OPTIONS: InfrastructureTypeTagOption[] = [
    {
        value: 'education',
        label: 'Education',
        icon: 'pi-book',
    },
    {
        value: 'sante',
        label: 'Santé',
        icon: 'pi-heart',
    },
    {
        value: 'administration',
        label: 'Administration',
        icon: 'pi-building',
    },
    {
        value: 'securite',
        label: 'Sécurité',
        icon: 'pi-shield',
    },
    {
        value: 'autre',
        label: 'Autre',
        icon: 'pi-tag',
    },
];
