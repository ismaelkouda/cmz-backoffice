import { GenericModel } from './generic.model';

export interface UserModel extends GenericModel {
    id: string;
    nom: string;
    prenoms: string;
    email: string;
    username: string;
    token: string;
}