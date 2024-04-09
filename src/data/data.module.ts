import { PatrimoineImplementationRepository } from './repositories/patrimoine/patrimoine-implementation.repository';
import { GetAllPatrimoineUseCase } from './../domain/usecases/patrimoine/get-all-patrimoine.usecase';
import { UserLoginUseCase } from './../domain/usecases/users/user-login.usecase';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { PatrimoineRepository } from '../domain/repositories/patrimoine.repository';

import { UserImplementationRepository } from './repositories/user/user-implementation.repository';


const userLoginUseCaseFactory = (userRepo: UserRepository) => new UserLoginUseCase(userRepo);
export const userLoginUseCaseProvider = {
    provide: UserLoginUseCase,
    useFactory: userLoginUseCaseFactory,
    deps: [UserRepository],
};

const getAllPatrimoineUseCaseFactory = (patrimoineRepo: PatrimoineRepository) => new GetAllPatrimoineUseCase(patrimoineRepo);
export const getAllPatrimoineUseCaseProvider = {
    provide: GetAllPatrimoineUseCase,
    useFactory: getAllPatrimoineUseCaseFactory,
    deps: [PatrimoineRepository],
};

@NgModule({
    providers: [
        userLoginUseCaseProvider,
        getAllPatrimoineUseCaseProvider,
        { provide: UserRepository, useClass: UserImplementationRepository },
        { provide: PatrimoineRepository, useClass: PatrimoineImplementationRepository },
    ],
    imports: [
        CommonModule,
        HttpClientModule,
    ],
})
export class DataModule { }