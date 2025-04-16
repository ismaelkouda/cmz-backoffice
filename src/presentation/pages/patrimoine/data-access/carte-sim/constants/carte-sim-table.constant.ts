import { OperationTransaction } from "../../../../../../shared/enum/OperationTransaction.enum";
import { AsFeatureService } from "../../../../../../shared/services/as-feature.service";

export const carteSimTableConstant = (asFeatureService: AsFeatureService) => {
    const hasIdentification = asFeatureService.hasFeature(OperationTransaction.IDENTIFICATION);

    return {
        cols: [
            { field: '', header: '#', class: "text-center", width: "2rem" },
            { field: 'niveau_uns_nom', header: 'Niveau un' },
            { field: 'niveau_deux_nom', header: 'Niveau deux' },
            { field: 'apn', header: 'APN', class: "text-center", width: "6rem" },
            { field: 'adresse_ip', header: 'Adresse IP', class: "text-center", width: "12rem" },
            { field: 'niveau_trois_nom', header: 'Niveau trois' },
            { field: 'msisdn', header: 'MSISDN', class: "text-center", width: "6rem" },
            { field: 'imsi', header: 'IMSI', class: "text-center", width: "6rem" },
            { field: 'statut', header: 'Statut', class: "text-center", width: "6rem" },
            ...(hasIdentification ? [{ field: 'identification_fiabilite', header: 'Identification', class: "text-center", width: "6rem" }] : []),
            { field: '', header: 'Actions', class: "text-center", width: "20rem" }
        ],
        globalFilterFields: [
            'niveau_uns_nom', 'niveau_deux_nom', 'apn', 'adresse_ip', 'niveau_trois_nom', 
            'msisdn', 'imsi', 'statut', 'identification_fiabilite'
        ]
    };
};
