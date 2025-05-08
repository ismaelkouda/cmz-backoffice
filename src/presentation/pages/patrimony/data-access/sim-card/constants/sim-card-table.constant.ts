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
            },
            {
                field: 'niveau_deux_nom',
                header: 'Niveau deux',
                class: 'text-center',
            },
            {
                field: 'apn',
                header: 'APN',
                class: 'text-center',
            },
            {
                field: 'adresse_ip',
                header: 'Adresse IP',
                class: 'text-center',
            },
            // { field: 'niveau_trois_nom', header: 'Niveau trois', class: "text-center" },
            {
                field: 'msisdn',
                header: 'MSISDN',
                class: 'text-center',
            },
            {
                field: 'imsi',
                header: 'IMSI',
                class: 'text-center',
            },
            {
                field: 'statut',
                header: 'Statut',
                class: 'text-center',
            },
            ...(hasIdentification
                ? [
                      {
                          field: 'identification_fiabilite',
                          header: 'Identification',
                          class: 'text-center',
                      },
                  ]
                : []),
            {
                field: '',
                header: 'Actions',
                class: 'text-center',
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
            'identification_fiabilite',
        ],
    };
};
