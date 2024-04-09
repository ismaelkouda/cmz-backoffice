export const LIST_TRAITEMENTS = [
    { code: 1, libele: 'traité' },
    { code: 2, libele: 'non-traité' },
    { code: 3, libele: 'en-traitement' },
];
export const LIST_OPERATIONS = [
    { code: 'maj-poste-distribution', libele: 'MAJ Poste Distribution' },
    { code: 'idn-poste-distribution', libele: 'IDN Poste Distribution' },
    { code: 'sync-config', libele: 'SYNC Config' },
    { code: 'sync-parametres-tcp-ip', libele: 'SYNC Parametres TCP/IP' },
    { code: 'cmd-licences-poste-distribution', libele: 'Commande de Licences' },
    { code: 'act-poste-distribution', libele: 'ACT Poste Distribution ' },
];
export const LIST_RAPPORT = [
    { code: 'syn-422', libele: 'SYN-422' },
    { code: 'ide-422', libele: 'IDE-422' },
    { code: 'maj-422', libele: 'MAJ-422' },
];
export const LIST_COLUMNS = [
    { prop: 'index' },
    { name: 'type_operation' },
    { name: 'date_heure' },
    { name: 'domaine_foncier' },
    { name: 'circonscription' },
    { name: 'demandeur' },
    { name: 'statut' },
];
export const LIST_CODE_RAPPORT = [
    { code: 1, libelle: 'MAJ-100' },
    { code: 2, libelle: 'MAJ-200' },
    { code: 3, libelle: 'MAJ-422' },
];
export const LIST_AFFECTE = [
    { name: 'affecté', code: 'affecte' },
    { name: 'auto-affecté', code: 'auto affecte' }
]