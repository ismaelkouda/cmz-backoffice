import { Mapper } from 'src/base/mapper';
import { UserModel } from 'src/domain/models/user.model';
import { UserEntity } from '../entities/user-entity';


export class UserImplementationRepositoryMapper extends Mapper<UserEntity, UserModel> {
    mapFrom(param: UserEntity): UserModel {
        return {
            id: param.id,
            email: param.email,
            nom: param.nom,
            prenoms: param.prenoms,
            token: param.token,
            data: param.data
        };
    }
    mapTo(param: UserModel): UserEntity {
        return {
            id: param.id,
            email: param.email,
            nom: param.nom,
            prenoms: param.prenoms,
            token: param.token,
            data: param.data
        }
    }
}