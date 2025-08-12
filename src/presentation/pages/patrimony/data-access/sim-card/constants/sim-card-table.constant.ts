import { TableConfig } from '../../../../../../shared/services/table-export-excel-file.service';

export const getSimCardTable = (
    asAccessFeatureIdentification: boolean,
    firstLevelLabel: string | undefined,
    secondLevelLabel: string | undefined,
    thirdLevelLabel: string | undefined
): TableConfig => {
    const cols = [
        { field: '', header: '#', class: 'text-center' },
        {
            field: 'niveau_uns_nom',
            header: firstLevelLabel ?? 'Niveau un',
            class: 'text-center',
            width: '10rem',
        },
        {
            field: 'niveau_deux_nom',
            header: secondLevelLabel ?? 'Niveau deux',
            class: 'text-center',
            width: '10rem',
        },
        {
            field: 'apn',
            header: 'APN',
            class: 'text-center',
            width: '10rem',
        },
        {
            field: 'adresse_ip',
            header: 'Adresse IP',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: 'niveau_trois_nom',
            header: thirdLevelLabel ?? 'Niveau trois',
            class: 'text-center',
            width: '10rem',
        },
        {
            field: 'msisdn',
            header: 'MSISDN',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: 'imsi',
            header: 'IMSI',
            class: 'text-center',
            width: '10rem',
        },
        {
            field: 'statut',
            header: 'Statut',
            class: 'text-center',
            width: '6rem',
        },
    ];

    if (asAccessFeatureIdentification) {
        cols.push({
            field: 'identification_fiabilite',
            header: 'Identification',
            class: 'text-center',
            width: '8rem',
        });
    }

    cols.push({
        field: '',
        header: 'Actions',
        class: 'text-center',
        width: '16rem',
    });

    const globalFilterFields = [
        'niveau_uns_nom',
        'niveau_deux_nom',
        'apn',
        'adresse_ip',
        'niveau_trois_nom',
        'msisdn',
        'imsi',
        'statut',
    ];

    if (asAccessFeatureIdentification) {
        globalFilterFields.push('identification_fiabilite');
    }

    return {
        cols,
        globalFilterFields,
    };
};
