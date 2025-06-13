import { OperationTransaction } from '../../../../../../shared/enum/OperationTransaction.enum';
import { AsFeatureService } from '../../../../../../shared/services/as-feature.service';

export const simCardTableConstant = (asFeatureService: AsFeatureService) => {
    const hasIdentification = asFeatureService.hasFeature(
        OperationTransaction.IDENTIFICATION
    );

    return {
        cols: [
            { field: '', header: '#', class: 'text-center' },
            {
                field: 'niveau_uns_nom',
                header: 'Niveau un',
                class: 'text-center',
                width: '10rem',
            },
            {
                field: 'niveau_deux_nom',
                header: 'Niveau deux',
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
                header: 'Niveau trois',
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
            ...(hasIdentification
                ? [
                      {
                          field: 'identification_fiabilite',
                          header: 'Identification',
                          class: 'text-center',
                          width: '8rem',
                      },
                  ]
                : []),
            {
                field: '',
                header: 'Actions',
                class: 'text-center',
                width: '16rem',
            },
        ],
        globalFilterFields: [
            'niveau_uns_nom',
            'niveau_deux_nom',
            'apn',
            'adresse_ip',
            'niveau_trois_nom',
            'msisdn',
            'imsi',
            'statut',
            hasIdentification ? 'identification_fiabilite' : '',
        ],
    };
};
