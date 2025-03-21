export interface SecondLevelInterface {
    id: number;
    uuid: string;
    niveau_un_uuid: string;
    code: string;
    nom: string;
}

export interface FirstLevelInterface {
    id: number;
    uuid: string;
    code: string;
    nom: string;
    niveaux_deux: Array<SecondLevelInterface>;
}

export interface ApiResponseFirstLevelInterface {
    error: boolean;
    message: string;
    data: Array<FirstLevelInterface>;
}
