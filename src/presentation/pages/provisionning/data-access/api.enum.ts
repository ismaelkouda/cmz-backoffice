export const enum EndPointUrl {
    GET_ALL_COMMANDES_SIM = 'patrimoine-sim/provisionning/commande_carte_sim',


    //Ligne Credit 
    GET_ALL_LIGNE_CREDIT = 'gestion-portefeuille/ligne-credit/all?page={page}',
    SAVE_PROVISION_CREDIT = 'gestion-portefeuille/ligne-credit/provisionner',
    CANCEL_CREDIT = 'gestion-portefeuille/ligne-credit/annuler-provisionning',
    STAT_CREDIT = 'gestion-portefeuille/ligne-credit/stat',

    //Commandes Produits
    GET_ALL_ACHATS = 'gestion-portefeuille/commande-produit/all?page={page}',
    GENERATE_NUMERO_COMMANDE = 'gestion-portefeuille/commande-produit/generate_numero_commande',
    CREATE_COMMANDE_PROFORMAT = 'gestion-portefeuille/commande-produit/create_proforma',
    VALIDATE_COMMANDE_PROFORMAT = 'gestion-portefeuille/commande-produit/{id}/valider_proforma',
    GET_ALL_SERVICES = 'gestion-portefeuille/commande-produit/all_produits',
    STAT_ACHAT = 'gestion-portefeuille/commande-produit/stat',

}
