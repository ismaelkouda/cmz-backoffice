import { Injectable, inject } from '@angular/core';
import { DetailsTreatCommand } from '@pages/processing/application/commands/details/details-treat.command';
import { DetailsTreatHandler } from '@pages/processing/application/commands-handlers/details/details-treat.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DetailsTreatBus {
    private readonly createHandler = inject(DetailsTreatHandler);

    dispatch<T>(command: T): Observable<SimpleResponseDto<void>> {
        if (command instanceof DetailsTreatCommand) {
            return this.createHandler.execute(command);
        }

        throw new Error('No handler found for command');
    }
}
