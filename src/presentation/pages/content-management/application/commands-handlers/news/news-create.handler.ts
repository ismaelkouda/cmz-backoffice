import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { NewsCreateCommand } from '@presentation/pages/content-management/application/commands/news/news-create.command';
import { NewsUseCase } from '@presentation/pages/content-management/application/use-cases/news/news.use-case';

@Injectable({ providedIn: 'root' })
export class NewsCreateHandler {
    constructor(private readonly useCase: NewsUseCase) {}

    execute(command: NewsCreateCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.create({
            firstName: command.firstName,
            lastName: command.lastName,
            email: command.email,
            phone: command.phone,
            role: command.role,
        });
    }
}
