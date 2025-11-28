export interface MessagingRequestDto {
    page: string;
    limit?: string;
    tenant_code?: string;
    sujet?: string;
    statut?: string;
    envoye_par?: string;
    date_debut?: string;
    date_fin?: string;
}
