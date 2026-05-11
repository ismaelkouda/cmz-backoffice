import { Injectable } from '@angular/core';
import { DetailsApproveCommand } from '@pages/report-states/application/commands/details/details-approve.command';
import { DetailsUseCase } from '@pages/report-states/application/use-cases/details/details.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DetailsApproveHandler {
    constructor(private readonly useCase: DetailsUseCase) {}

    execute(
        command: DetailsApproveCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.approve({
            uniqId: command.uniqId,
            comment: command.comment,
            approvalType: command.approvalType,
            callbackType: command.callbackType,
            coordinates: command.coordinates,
            locationName: command.locationName,
            reportType: command.reportType,
            operators: command.operators,
            description: command.description,
            decision: command.decision,
            placeDescription: command.placeDescription,
            reason: command.reason,
            placePhoto: command.placePhoto,
        });
    }
}
