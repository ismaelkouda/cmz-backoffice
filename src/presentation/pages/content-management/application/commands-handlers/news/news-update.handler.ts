import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { NewsUpdateCommand } from '@presentation/pages/content-management/application/commands/news/news-update.command';
import { NewsUseCase } from '@presentation/pages/content-management/application/use-cases/news/news.use-case';

@Injectable({ providedIn: 'root' })
export class NewsUpdateHandler {
    constructor(private readonly useCase: NewsUseCase) {}

    execute(command: NewsUpdateCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.update({
            uniqId: command.uniqId,
            firstName: command.firstName,
            lastName: command.lastName,
            email: command.email,
            phone: command.phone,
            role: command.role,
        });
    }
}
