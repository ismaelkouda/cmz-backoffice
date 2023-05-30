import { Mapper } from '../../../../base/mapper';
import { PatrimoineEntity } from './../entities/patrimoine-entity';
import { PatrimoineModel } from './../../../../domain/models/patrimoine.model';


export class PatrimoineImplementationRepositoryMapper extends Mapper<PatrimoineEntity, PatrimoineModel> {
    mapFrom(param: PatrimoineEntity): PatrimoineModel {
        return {
            data: param.data
        };
    }
    mapTo(param: PatrimoineModel): PatrimoineEntity {
        return {
            data: param.data
        }
    }
}