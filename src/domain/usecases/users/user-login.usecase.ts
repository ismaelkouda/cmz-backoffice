import { UseCase } from './../../../base/use-case';
import { Observable } from 'rxjs';
import { UserModel } from '../../models/user.model';
import { UserRepository } from '../../repositories/user.repository';

export class UserLoginUseCase implements UseCase<{ email: string; password: string }, UserModel> {

    constructor(private userRepository: UserRepository) { }

    execute(param: { email: string, password: string }): Observable<UserModel> {
        return this.userRepository.login(param);
    }

}