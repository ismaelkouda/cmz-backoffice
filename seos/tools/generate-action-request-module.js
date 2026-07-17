#!/usr/bin/env node
/**
 * SEOS — Generateur du module de reference "action-request" (Experience 050).
 *
 * Pendant de seos/tools/generate-reference-module.js (pattern crud-entity), pour le
 * second pattern extrait cette session : seos/patterns/action-request.pattern.json,
 * lui-meme extrait par lecture directe, fichier par fichier, des 3 operations reelles
 * du module authentication (login, forgot-password, reset-password) apres leur refonte.
 *
 * Genere un module synthetique a UNE seule operation ("sample-action", sous le module
 * "seos-reference-action"), fidele a la structure reelle de LOGIN (l'operation la plus
 * simple des 3 : deux champs requis, aucune validation croisee, aucun parametre d'URL) —
 * champs renommes de facon generique (identifier/secret au lieu de email/password) pour
 * ne pas laisser croire que ce module synthetique EST de l'authentification. La reponse
 * est simplifiee a { message: string } : les champs user/token de LoginResponseEntity
 * sont specifiques au besoin metier "login", pas au pattern action-request lui-meme
 * (le pattern n'exige qu'une Entity+Props+Mapper de reponse, pas des champs precis).
 *
 * Non branche dans les routes de l'app (meme discipline que seos-reference/resources
 * pour crud-entity) : le fichier ${MODULE}.routes.ts est genere mais jamais importe
 * dans src/shared/routes/routes.ts ni ailleurs. Perimetre explicite : verification
 * structurelle (fichiers presents, compile, style) — pas le contenu semantique.
 *
 * Usage :
 *   node seos/tools/generate-action-request-module.js           (genere le module)
 *   node seos/tools/generate-action-request-module.js --clean    (supprime le module)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..', '..');
const PAGES_ROOT = path.join(REPO_ROOT, 'src', 'presentation', 'pages');

const MODULE = 'seos-reference-action';
const OPERATION = 'sample-action';

const MODULE_ROOT = path.join(PAGES_ROOT, MODULE);

function pascalCase(kebab) {
    return kebab
        .split('-')
        .map((s) => s[0].toUpperCase() + s.slice(1))
        .join('');
}

const OpCap = pascalCase(OPERATION); // SampleAction
const ModuleCap = pascalCase(MODULE); // SeosReferenceAction
const OP_UPPER = OPERATION.replace(/-/g, '_').toUpperCase(); // SAMPLE_ACTION
const MODULE_UPPER = MODULE.replace(/-/g, '_').toUpperCase(); // SEOS_REFERENCE_ACTION

function write(relPath, content) {
    const abs = path.join(MODULE_ROOT, relPath);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, content, 'utf8');
}

function clean() {
    if (fs.existsSync(MODULE_ROOT)) {
        fs.rmSync(MODULE_ROOT, { recursive: true, force: true });
        console.log(`Supprime : ${path.relative(REPO_ROOT, MODULE_ROOT)}`);
    } else {
        console.log('Rien a supprimer (module absent).');
    }
}

function generate() {
    if (fs.existsSync(MODULE_ROOT)) {
        fs.rmSync(MODULE_ROOT, { recursive: true, force: true });
    }

    // ---------------------------------------------------------------
    // Fichiers racine de module
    // ---------------------------------------------------------------
    write(
        `${MODULE}.routes.ts`,
        `import { Routes } from '@angular/router';
import { ${OP_UPPER}_ROUTE } from '@presentation/pages/${MODULE}/presentation/features/${OPERATION}/${OPERATION}-routes.constant';

export const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: ${OP_UPPER}_ROUTE,
                loadComponent: () =>
                    import('./presentation/features/${OPERATION}/${OPERATION}.component').then(
                        (m) => m.${OpCap}Component
                    ),
            },
            {
                path: '',
                redirectTo: ${OP_UPPER}_ROUTE,
                pathMatch: 'full',
            },
        ],
    },
];
`
    );

    write(
        `di/${MODULE}.providers.ts`,
        `import { Provider } from '@angular/core';
import { ${OpCap.replace(/^./, (c) => c.toLowerCase())}Providers } from '@presentation/pages/${MODULE}/di/${OPERATION}/${OPERATION}.providers';

export const provide${ModuleCap} = (): Provider[] => [
    ...${OpCap.replace(/^./, (c) => c.toLowerCase())}Providers,
];
`
    );

    write(
        `infrastructure/api/${MODULE}.endpoints.ts`,
        `export const ${MODULE_UPPER}_ENDPOINTS = {
    ${OP_UPPER}: '${OPERATION}',
} as const;
`
    );

    // ---------------------------------------------------------------
    // domain/contracts
    // ---------------------------------------------------------------
    write(
        `domain/contracts/${OPERATION}/${OPERATION}-request.contract.ts`,
        `export interface ${OpCap}RequestContract {
    identifier?: string;
    secret?: string;
}
`
    );

    write(
        `domain/contracts/${OPERATION}/${OPERATION}-request.validate-contract.ts`,
        `export interface ${OpCap}RequestValidateContract {
    identifier: string;
    secret: string;
}
`
    );

    // ---------------------------------------------------------------
    // domain/validators
    // ---------------------------------------------------------------
    write(
        `domain/validators/${OPERATION}/${OPERATION}-request.validator.ts`,
        `import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';
import { ${OpCap}RequestContract } from '@presentation/pages/${MODULE}/domain/contracts/${OPERATION}/${OPERATION}-request.contract';
import { ${OpCap}RequestValidateContract } from '@presentation/pages/${MODULE}/domain/contracts/${OPERATION}/${OPERATION}-request.validate-contract';

export function validate${OpCap}Request(
    contract: ${OpCap}RequestContract
): asserts contract is ${OpCap}RequestValidateContract {
    if (!contract.identifier?.trim()) {
        throw new GenericRequiredError('${MODULE_UPPER}.FORM.IDENTIFIER.REQUIRED');
    }
    if (!contract.secret) {
        throw new GenericRequiredError('${MODULE_UPPER}.FORM.SECRET.REQUIRED');
    }
}
`
    );

    // ---------------------------------------------------------------
    // domain/value-objects
    // ---------------------------------------------------------------
    write(
        `domain/value-objects/${OPERATION}/${OPERATION}-request.vo.ts`,
        `import { ${OpCap}RequestContract } from '@presentation/pages/${MODULE}/domain/contracts/${OPERATION}/${OPERATION}-request.contract';
import { ${OpCap}RequestValidateContract } from '@presentation/pages/${MODULE}/domain/contracts/${OPERATION}/${OPERATION}-request.validate-contract';
import { validate${OpCap}Request } from '@presentation/pages/${MODULE}/domain/validators/${OPERATION}/${OPERATION}-request.validator';

export function ${OPERATION.replace(/-([a-z])/g, (_, c) => c.toUpperCase())}RequestVo(
    contract: ${OpCap}RequestContract
): ${OpCap}RequestValidateContract {
    validate${OpCap}Request(contract);
    return {
        identifier: contract.identifier.trim(),
        secret: contract.secret,
    };
}
`
    );

    // ---------------------------------------------------------------
    // domain/repositories
    // ---------------------------------------------------------------
    write(
        `domain/repositories/${OPERATION}/${OPERATION}.repository.ts`,
        `import { ${OpCap}RequestValidateContract } from '@presentation/pages/${MODULE}/domain/contracts/${OPERATION}/${OPERATION}-request.validate-contract';
import { ${OpCap}ResponseEntity } from '@presentation/pages/${MODULE}/domain/entities/${OPERATION}/${OPERATION}-response.entity';
import { Observable } from 'rxjs';

export abstract class ${OpCap}Repository {
    abstract execute(
        validContract: ${OpCap}RequestValidateContract
    ): Observable<${OpCap}ResponseEntity>;
}
`
    );

    // ---------------------------------------------------------------
    // domain/entities + domain/interfaces (reponse)
    // ---------------------------------------------------------------
    write(
        `domain/interfaces/${OPERATION}/${OPERATION}-props.interface.ts`,
        `export interface ${OpCap}Props {
    readonly message?: string;
}
`
    );

    write(
        `domain/entities/${OPERATION}/${OPERATION}-response.entity.ts`,
        `import { ${OpCap}Props } from '@presentation/pages/${MODULE}/domain/interfaces/${OPERATION}/${OPERATION}-props.interface';

export class ${OpCap}ResponseEntity implements ${OpCap}Props {
    constructor(public readonly props: ${OpCap}Props) {}

    get message(): string | undefined {
        return this.props.message;
    }
}
`
    );

    // ---------------------------------------------------------------
    // application/dto, commands, commands-mappers, commands-handlers, commands-bus
    // ---------------------------------------------------------------
    write(
        `application/dto/${OPERATION}/${OPERATION}-request.dto.ts`,
        `export interface ${OpCap}RequestDto {
    readonly identifier: string;
    readonly secret: string;
}
`
    );

    write(
        `application/commands/${OPERATION}/${OPERATION}-request.command.ts`,
        `export class ${OpCap}RequestCommand {
    constructor(
        public readonly identifier: string | undefined,
        public readonly secret: string | undefined
    ) {}
}
`
    );

    write(
        `application/commands-mappers/${OPERATION}/${OPERATION}-request.mapper.ts`,
        `import { ${OpCap}RequestCommand } from '@presentation/pages/${MODULE}/application/commands/${OPERATION}/${OPERATION}-request.command';
import { ${OpCap}RequestContract } from '@presentation/pages/${MODULE}/domain/contracts/${OPERATION}/${OPERATION}-request.contract';

export function ${OPERATION.replace(/-([a-z])/g, (_, c) => c.toUpperCase())}RequestCommandMapper(
    command: ${OpCap}RequestCommand
): ${OpCap}RequestContract {
    return {
        identifier: command.identifier,
        secret: command.secret,
    };
}
`
    );

    write(
        `application/commands-handlers/${OPERATION}/${OPERATION}-request.handler.ts`,
        `import { ${OPERATION.replace(/-([a-z])/g, (_, c) => c.toUpperCase())}RequestCommandMapper } from '@presentation/pages/${MODULE}/application/commands-mappers/${OPERATION}/${OPERATION}-request.mapper';
import { Injectable, inject } from '@angular/core';
import { ${OpCap}ResponseEntity } from '@presentation/pages/${MODULE}/domain/entities/${OPERATION}/${OPERATION}-response.entity';
import { ${OpCap}RequestCommand } from '@presentation/pages/${MODULE}/application/commands/${OPERATION}/${OPERATION}-request.command';
import { ${OpCap}UseCase } from '@presentation/pages/${MODULE}/application/use-cases/${OPERATION}/${OPERATION}.use-case';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ${OpCap}RequestHandler {
    private readonly useCase = inject(${OpCap}UseCase);

    execute(command: ${OpCap}RequestCommand): Observable<${OpCap}ResponseEntity> {
        return this.useCase.execute(${OPERATION.replace(/-([a-z])/g, (_, c) => c.toUpperCase())}RequestCommandMapper(command));
    }
}
`
    );

    write(
        `application/commands-bus/${OPERATION}/${OPERATION}-request.bus.ts`,
        `import { Injectable, inject } from '@angular/core';
import { ${OpCap}ResponseEntity } from '@presentation/pages/${MODULE}/domain/entities/${OPERATION}/${OPERATION}-response.entity';
import { ${OpCap}RequestCommand } from '@presentation/pages/${MODULE}/application/commands/${OPERATION}/${OPERATION}-request.command';
import { ${OpCap}RequestHandler } from '@presentation/pages/${MODULE}/application/commands-handlers/${OPERATION}/${OPERATION}-request.handler';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ${OpCap}RequestBus {
    private readonly handler = inject(${OpCap}RequestHandler);

    dispatch<T>(command: T): Observable<${OpCap}ResponseEntity> {
        if (command instanceof ${OpCap}RequestCommand) {
            return this.handler.execute(command);
        }
        throw new Error('No handler found for command');
    }
}
`
    );

    // ---------------------------------------------------------------
    // application/use-cases
    // ---------------------------------------------------------------
    write(
        `application/use-cases/${OPERATION}/${OPERATION}.use-case.ts`,
        `import { Injectable, inject } from '@angular/core';
import { ${OpCap}ResponseEntity } from '@presentation/pages/${MODULE}/domain/entities/${OPERATION}/${OPERATION}-response.entity';
import { ${OpCap}Repository } from '@presentation/pages/${MODULE}/domain/repositories/${OPERATION}/${OPERATION}.repository';
import { ${OPERATION.replace(/-([a-z])/g, (_, c) => c.toUpperCase())}RequestVo } from '@presentation/pages/${MODULE}/domain/value-objects/${OPERATION}/${OPERATION}-request.vo';
import { defer, Observable } from 'rxjs';
import { ${OpCap}RequestContract } from '@presentation/pages/${MODULE}/domain/contracts/${OPERATION}/${OPERATION}-request.contract';

@Injectable({ providedIn: 'root' })
export class ${OpCap}UseCase {
    private readonly repository = inject(${OpCap}Repository);

    execute(contract: ${OpCap}RequestContract): Observable<${OpCap}ResponseEntity> {
        return defer(() =>
            this.repository.execute(${OPERATION.replace(/-([a-z])/g, (_, c) => c.toUpperCase())}RequestVo(contract))
        );
    }
}
`
    );

    // ---------------------------------------------------------------
    // application/services (facade)
    // ---------------------------------------------------------------
    write(
        `application/services/${OPERATION}/${OPERATION}.facade.ts`,
        `import { Injectable, inject } from '@angular/core';
import { ${OpCap}ResponseEntity } from '@presentation/pages/${MODULE}/domain/entities/${OPERATION}/${OPERATION}-response.entity';
import { ${OpCap}RequestDto } from '@presentation/pages/${MODULE}/application/dto/${OPERATION}/${OPERATION}-request.dto';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { ${OpCap}RequestBus } from '@presentation/pages/${MODULE}/application/commands-bus/${OPERATION}/${OPERATION}-request.bus';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { ${OpCap}RequestCommand } from '@presentation/pages/${MODULE}/application/commands/${OPERATION}/${OPERATION}-request.command';

@Injectable({ providedIn: 'root' })
export class ${OpCap}Facade extends ObjectBaseFacade<
    ${OpCap}ResponseEntity,
    ${OpCap}RequestDto
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(${OpCap}RequestBus);

    execute(dto: ${OpCap}RequestDto): void {
        const command = new ${OpCap}RequestCommand(dto.identifier, dto.secret);
        const fetch$ = this.bus.dispatch(command);
        this.fetch(dto, fetch$, this.ui);
    }
}
`
    );

    // ---------------------------------------------------------------
    // infrastructure/api/dto (request + response)
    // ---------------------------------------------------------------
    write(
        `infrastructure/api/dto/${OPERATION}/${OPERATION}-request-api.dto.ts`,
        `export interface ${OpCap}RequestApiDto {
    identifier: string;
    secret: string;
}
`
    );

    write(
        `infrastructure/api/dto/${OPERATION}/${OPERATION}-response-api.dto.ts`,
        `import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface ${OpCap}ResponseApiDto {
    readonly message?: string;
}

export type ${OpCap}ResponseDto = SimpleResponseDto<${OpCap}ResponseApiDto>;
`
    );

    // ---------------------------------------------------------------
    // infrastructure/data/mappers (request + response)
    // ---------------------------------------------------------------
    write(
        `infrastructure/data/mappers/${OPERATION}/${OPERATION}-request.mapper.ts`,
        `import { ${OpCap}RequestValidateContract } from '@presentation/pages/${MODULE}/domain/contracts/${OPERATION}/${OPERATION}-request.validate-contract';
import { ${OpCap}RequestApiDto } from '@presentation/pages/${MODULE}/infrastructure/api/dto/${OPERATION}/${OPERATION}-request-api.dto';

export function ${OPERATION.replace(/-([a-z])/g, (_, c) => c.toUpperCase())}RequestMapper(
    validContract: ${OpCap}RequestValidateContract
): ${OpCap}RequestApiDto {
    return {
        identifier: validContract.identifier,
        secret: validContract.secret,
    };
}
`
    );

    write(
        `infrastructure/data/mappers/${OPERATION}/${OPERATION}-response.mapper.ts`,
        `import { Injectable } from '@angular/core';
import { ${OpCap}ResponseApiDto } from '@presentation/pages/${MODULE}/infrastructure/api/dto/${OPERATION}/${OPERATION}-response-api.dto';
import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
import { ${OpCap}ResponseEntity } from '@presentation/pages/${MODULE}/domain/entities/${OPERATION}/${OPERATION}-response.entity';

@Injectable({ providedIn: 'root' })
export class ${OpCap}ResponseMapper extends SimpleResponseMapper<
    ${OpCap}ResponseEntity,
    ${OpCap}ResponseApiDto
> {
    protected mapItemFromDto(dto: ${OpCap}ResponseApiDto): ${OpCap}ResponseEntity {
        return new ${OpCap}ResponseEntity({ message: dto.message });
    }
}
`
    );

    // ---------------------------------------------------------------
    // infrastructure/data/repositories + sources
    // ---------------------------------------------------------------
    write(
        `infrastructure/data/repositories/${OPERATION}/${OPERATION}.repository.impl.ts`,
        `import { Injectable, inject } from '@angular/core';
import { ${OpCap}ResponseDto } from '@presentation/pages/${MODULE}/infrastructure/api/dto/${OPERATION}/${OPERATION}-response-api.dto';
import { ${OpCap}ResponseMapper } from '@presentation/pages/${MODULE}/infrastructure/data/mappers/${OPERATION}/${OPERATION}-response.mapper';
import { ${OpCap}Api } from '@presentation/pages/${MODULE}/infrastructure/data/sources/${OPERATION}/${OPERATION}.api';
import { ${OpCap}RequestValidateContract } from '@presentation/pages/${MODULE}/domain/contracts/${OPERATION}/${OPERATION}-request.validate-contract';
import { ${OpCap}Repository } from '@presentation/pages/${MODULE}/domain/repositories/${OPERATION}/${OPERATION}.repository';
import { ${OpCap}ResponseEntity } from '@presentation/pages/${MODULE}/domain/entities/${OPERATION}/${OPERATION}-response.entity';
import { ${OPERATION.replace(/-([a-z])/g, (_, c) => c.toUpperCase())}RequestMapper } from '@presentation/pages/${MODULE}/infrastructure/data/mappers/${OPERATION}/${OPERATION}-request.mapper';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ${OpCap}RepositoryImpl implements ${OpCap}Repository {
    private readonly api = inject(${OpCap}Api);
    private readonly mapper = inject(${OpCap}ResponseMapper);

    execute(
        validContract: ${OpCap}RequestValidateContract
    ): Observable<${OpCap}ResponseEntity> {
        const dto = ${OPERATION.replace(/-([a-z])/g, (_, c) => c.toUpperCase())}RequestMapper(validContract);
        return this.api
            .execute(dto)
            .pipe(
                map((response: ${OpCap}ResponseDto) =>
                    this.mapper.mapFromDto(response)
                )
            );
    }
}
`
    );

    write(
        `infrastructure/data/sources/${OPERATION}/${OPERATION}.api.ts`,
        `import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AUTH_API_URL } from '@core/config/config.tokens';
import { ${MODULE_UPPER}_ENDPOINTS } from '@presentation/pages/${MODULE}/infrastructure/api/${MODULE}.endpoints';
import { ${OpCap}RequestApiDto } from '@presentation/pages/${MODULE}/infrastructure/api/dto/${OPERATION}/${OPERATION}-request-api.dto';
import { ${OpCap}ResponseDto } from '@presentation/pages/${MODULE}/infrastructure/api/dto/${OPERATION}/${OPERATION}-response-api.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ${OpCap}Api {
    private readonly http = inject(HttpClient);
    private readonly baseUrl: string = inject(AUTH_API_URL);

    execute(dto: ${OpCap}RequestApiDto): Observable<${OpCap}ResponseDto> {
        const url = \`\${this.baseUrl}\${${MODULE_UPPER}_ENDPOINTS.${OP_UPPER}}\`;
        return this.http.post<${OpCap}ResponseDto>(url, dto);
    }
}
`
    );

    // ---------------------------------------------------------------
    // di/{OPERATION}
    // ---------------------------------------------------------------
    write(
        `di/${OPERATION}/${OPERATION}.providers.ts`,
        `import { Provider } from '@angular/core';
import { ${OpCap}RepositoryImpl } from '@presentation/pages/${MODULE}/infrastructure/data/repositories/${OPERATION}/${OPERATION}.repository.impl';
import { ${OpCap}Repository } from '@presentation/pages/${MODULE}/domain/repositories/${OPERATION}/${OPERATION}.repository';

export const ${OPERATION.replace(/-([a-z])/g, (_, c) => c.toUpperCase())}Providers: Provider[] = [
    {
        provide: ${OpCap}Repository,
        useClass: ${OpCap}RepositoryImpl,
    },
];
`
    );

    // ---------------------------------------------------------------
    // presentation/constants
    // ---------------------------------------------------------------
    write(
        `presentation/constants/${OPERATION}/${OPERATION}-form-keys.constant.ts`,
        `export const ${OP_UPPER}_FORM_KEYS = {
    IDENTIFIER: 'identifier',
    SECRET: 'secret',
} as const;
`
    );

    write(
        `presentation/constants/${OPERATION}/${OPERATION}-form-error-messages.constant.ts`,
        `import { ${OP_UPPER}_FORM_KEYS } from '@presentation/pages/${MODULE}/presentation/constants/${OPERATION}/${OPERATION}-form-keys.constant';

export const ${OP_UPPER}_FORM_ERROR_MESSAGES = {
    [${OP_UPPER}_FORM_KEYS.IDENTIFIER]: {
        required: '${MODULE_UPPER}.FORM.IDENTIFIER.REQUIRED',
    },
    [${OP_UPPER}_FORM_KEYS.SECRET]: {
        required: '${MODULE_UPPER}.FORM.SECRET.REQUIRED',
    },
} as const;
`
    );

    write(
        `presentation/features/${OPERATION}/${OPERATION}-routes.constant.ts`,
        `export const ${OP_UPPER}_ROUTE = '${OPERATION}' as const;
`
    );

    // presentation/constants/form-validators.constants.ts — fichier RACINE du module
    // (pas sous presentation/constants/${OPERATION}/), meme convention que crud-entity :
    // simple re-export de COMMON_FORM_VALIDATORS. Pas de cle composee ici (identifier/
    // secret sont generiques, contrairement au vrai module authentication ou PASSWORD
    // est une cle specifique justifiee par un besoin metier reel) — voir Experience 053.
    write(
        `presentation/constants/form-validators.constants.ts`,
        `import { COMMON_FORM_VALIDATORS } from '@shared/presentation/constants/form-validators.constants';

export const FormValidators = COMMON_FORM_VALIDATORS;
`
    );

    // ---------------------------------------------------------------
    // presentation/store
    // ---------------------------------------------------------------
    write(
        `presentation/store/${OPERATION}/${OPERATION}-form.control.ts`,
        `import { FormControl } from '@angular/forms';
import { ${OP_UPPER}_FORM_KEYS } from '@presentation/pages/${MODULE}/presentation/constants/${OPERATION}/${OPERATION}-form-keys.constant';

export interface ${OpCap}FormControl {
    [${OP_UPPER}_FORM_KEYS.IDENTIFIER]: FormControl<string>;
    [${OP_UPPER}_FORM_KEYS.SECRET]: FormControl<string>;
}
`
    );

    write(
        `presentation/store/${OPERATION}/${OPERATION}-form.value.ts`,
        `import { ${OP_UPPER}_FORM_KEYS } from '@presentation/pages/${MODULE}/presentation/constants/${OPERATION}/${OPERATION}-form-keys.constant';

export interface ${OpCap}FormValue {
    [${OP_UPPER}_FORM_KEYS.IDENTIFIER]: string;
    [${OP_UPPER}_FORM_KEYS.SECRET]: string;
}
`
    );

    write(
        `presentation/store/${OPERATION}/${OPERATION}.store.ts`,
        `import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ${OpCap}Facade } from '@presentation/pages/${MODULE}/application/services/${OPERATION}/${OPERATION}.facade';
import { ${OpCap}FormControl } from '@presentation/pages/${MODULE}/presentation/store/${OPERATION}/${OPERATION}-form.control';
import { ${OpCap}FormValue } from '@presentation/pages/${MODULE}/presentation/store/${OPERATION}/${OPERATION}-form.value';
import { ${OP_UPPER}_FORM_ERROR_MESSAGES } from '@presentation/pages/${MODULE}/presentation/constants/${OPERATION}/${OPERATION}-form-error-messages.constant';
import { ${OP_UPPER}_FORM_KEYS } from '@presentation/pages/${MODULE}/presentation/constants/${OPERATION}/${OPERATION}-form-keys.constant';
import { FormValidators } from '@presentation/pages/${MODULE}/presentation/constants/form-validators.constants';
import { getControlError } from '@shared/presentation/helpers/form-errors.helper';
import { startWith } from 'rxjs';

@Injectable()
export class ${OpCap}Store {
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(${OpCap}Facade);

    public readonly loading = this.facade.loading;
    public readonly error = this.facade.error;
    public readonly session = this.facade.items;
    public readonly VALIDATION = FormValidators;

    public readonly form: FormGroup<${OpCap}FormControl> =
        this.fb.nonNullable.group({
            [${OP_UPPER}_FORM_KEYS.IDENTIFIER]: ['', [Validators.required]],
            [${OP_UPPER}_FORM_KEYS.SECRET]: ['', [Validators.required]],
        });

    private readonly status = toSignal(
        this.form.statusChanges.pipe(startWith(this.form.status)),
        { initialValue: this.form.status }
    );
    public readonly isValid = computed(() => this.status() === 'VALID');

    private get value(): ${OpCap}FormValue {
        return this.form.getRawValue();
    }

    public submit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        this.facade.execute(this.value);
    }

    public isFieldInvalid(field: keyof ${OpCap}FormControl): boolean {
        const control = this.form.controls[field];
        return control.invalid && control.touched;
    }

    public isFieldValid(field: keyof ${OpCap}FormControl): boolean {
        const control = this.form.controls[field];
        return control.valid && control.touched;
    }

    public isFieldTouched(field: keyof ${OpCap}FormControl): boolean {
        const control = this.form.controls[field];
        return control.touched;
    }

    public getFieldError(field: keyof ${OpCap}FormControl): string | null {
        return getControlError(
            this.form.controls[field],
            ${OP_UPPER}_FORM_ERROR_MESSAGES[field]
        );
    }
}
`
    );

    // ---------------------------------------------------------------
    // presentation/features
    // ---------------------------------------------------------------
    write(
        `presentation/features/${OPERATION}/${OPERATION}.component.ts`,
        `import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ${OpCap}Store } from '@presentation/pages/${MODULE}/presentation/store/${OPERATION}/${OPERATION}.store';
import { ${OP_UPPER}_FORM_KEYS } from '@presentation/pages/${MODULE}/presentation/constants/${OPERATION}/${OPERATION}-form-keys.constant';

@Component({
    selector: 'app-${OPERATION}',
    standalone: true,
    templateUrl: './${OPERATION}.component.html',
    styleUrls: ['./${OPERATION}.component.scss'],
    providers: [${OpCap}Store],
    imports: [ReactiveFormsModule, TranslateModule],
})
export class ${OpCap}Component {
    protected readonly store = inject(${OpCap}Store);
    protected readonly KEYS = ${OP_UPPER}_FORM_KEYS;

    protected onSubmit(): void {
        this.store.submit();
    }
}
`
    );

    write(
        `presentation/features/${OPERATION}/${OPERATION}.component.html`,
        `<form [formGroup]="store.form" (ngSubmit)="onSubmit()">
    <input type="text" [formControlName]="KEYS.IDENTIFIER" />
    <input type="password" [formControlName]="KEYS.SECRET" />
    <button type="submit" [disabled]="store.loading()">Submit</button>
</form>
`
    );

    write(`presentation/features/${OPERATION}/${OPERATION}.component.scss`, '');

    console.log(`Genere : ${path.relative(REPO_ROOT, MODULE_ROOT)} (operation "${OPERATION}")`);
}

const args = process.argv.slice(2);
if (args.includes('--clean')) {
    clean();
} else {
    generate();
}
