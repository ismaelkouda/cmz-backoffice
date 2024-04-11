import { UseCase } from './../../../base/use-case';
import { Observable } from 'rxjs';
import { PatrimoineRepository } from '../../repositories/patrimoine.repository';
import { PatrimoineModel } from 'src/domain/models/patrimoine.model';
import { GenericModel } from 'src/domain/models/generic.model';

export class GetAllPatrimoineUseCase implements UseCase<void, any> {

    constructor(private patrimoineRepository: PatrimoineRepository) { }

    execute(): Observable<GenericModel> {
        return this.patrimoineRepository.GetAllPatrimoine();
    }

}