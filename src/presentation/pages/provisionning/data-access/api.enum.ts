export const enum EndPointUrl {
    GET_ALL_COMMANDES_SIM = 'patrimoine-sim/provisionning/commande_carte_sim',
    //Ligne Credit 
    GET_ALL_LIGNE_CREDIT = 'gestion-portefeuille/ligne-credit/all?page={page}',
    SAVE_PROVISION_CREDIT = 'gestion-portefeuille/ligne-credit/provisionner',
    CANCEL_CREDIT = 'gestion-portefeuille/ligne-credit/annuler-provisionning',
    STAT_CREDIT = 'gestion-portefeuille/ligne-credit/stat',
    GET_ALL_PORTEFEUILLE = 'gestion-portefeuille/all',


    //Commandes Produits
    GET_ALL_ACHATS = 'gestion-portefeuille/commande-produit/all?page={page}',
    SAVE_COMMANDE = 'gestion-portefeuille/commande-produit/commander',
    GENERATE_NUMERO_COMMANDE = 'gestion-portefeuille/commande-produit/generate_numero_commande',
    VALIDATE_COMMANDE_PROFORMAT = 'gestion-portefeuille/commande-produit/create_proforma',
    GET_ALL_SERVICES = 'gestion-portefeuille/commande-produit/all-produits',
    STAT_ACHAT = 'gestion-portefeuille/commande-produit/stat',

        //Commandes Produits
    GET_ALL_STOCKS = 'gestion-portefeuille/stock-produits/all?page={page}',
}
