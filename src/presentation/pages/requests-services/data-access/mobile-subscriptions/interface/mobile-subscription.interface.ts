import { Folder } from "../../../../../../shared/interfaces/folder";
import { Paginate } from "../../../../../../shared/interfaces/paginate";

export interface mobileSubscriptionsGlobalStatsInterface {
    pourcentage_cloture_acceptes: number;
    pourcentage_cloture_rejetes: number;
    pourcentage_finalisation_effectues: number;
    pourcentage_finalisation_en_attentes: number;
    pourcentage_soumission_recu: number;
    pourcentage_traitement_en_cours: number;
    pourcentage_traitement_termines: number;
    total_cloture_acceptes: number;
    total_cloture_rejetes: number;
    total_dossiers: number;
    total_finalisation_effectues: number;
    total_finalisation_en_attentes: number;
    total_soumission_recu: number;
    total_traitement_en_cours: number;
    total_traitement_termines: number;
    data: Paginate<Folder>;
}

export interface mobileSubscriptionsApiResponseInterface {
    error: boolean;
    message: string;
    data: Paginate<Folder>;
}
