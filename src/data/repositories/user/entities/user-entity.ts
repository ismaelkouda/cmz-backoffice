import { GenericModel } from "src/domain/models/generic.model";

export interface UserEntity extends GenericModel {
    id: string;
    nom: string;
    prenoms: string;
    email: string;
    token: string;
}

