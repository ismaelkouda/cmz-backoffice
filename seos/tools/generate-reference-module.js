#!/usr/bin/env node
/**
 * SEOS — Generateur du module de reference "resources".
 *
 * REECRIT INTEGRALEMENT (Experience 035, SEOS-Assumptions-Register.md) pour coller au
 * module de reference reel administrative-infrastructure (entite "infrastructure") tel
 * qu'il est aujourd'hui, apres verification fichier par fichier — pas par supposition ni
 * par recopie de l'ancienne version de ce generateur, qui datait d'avant plusieurs
 * corrections de cette session (Experience 008/012/027/028/029/032/033/034) et
 * perpetuait donc des bugs deja corriges dans le module de reference lui-meme.
 *
 * Corrections apportees par rapport a l'ancienne version de ce generateur :
 *   1. domain/repositories/{ENTITY}/{ENTITY}[-find-one|-select].repository.ts en
 *      convention point (Experience 029/v14), plus l'ancienne convention tiret.
 *   2. defer() sur TOUTE methode de use-case dont le VO/validateur appele peut lever une
 *      exception synchrone : create/update/delete/execute(filtre)/find-one. L'ancien
 *      generateur ne deferait que create/update — execute() et delete() ne l'etaient
 *      pas alors que leurs VO valident et peuvent throw (meme bug qu'Experience 008/012,
 *      simplement jamais corrige dans le generateur lui-meme).
 *   3. delete ET find-one-filter ont desormais un vrai Contract/ValidateContract/
 *      Validator (assertion function, GenericRequiredError sur uniqId manquant),
 *      comme le fait reellement infrastructure — l'ancien generateur traitait delete
 *      comme un VO identite pur ("uniqId deja garanti par le type"), ce qui est faux
 *      pour le module de reference reel.
 *   4. Entity/Mapper/Dto de select alignes sur la forme reelle : interface Props dediee
 *      (domain/interfaces/{ENTITY}/{ENTITY}-select-props.interface.ts, core depuis v14),
 *      mapper @Injectable etendant ArrayResponseMapper (pas une fonction nue), DTO de
 *      reponse enveloppe dans SimpleResponseDto<T[]> (pas un tableau nu, incompatible
 *      avec ArrayResponseMapper.mapFromDto qui attend un ArrayResponseDto<T>).
 *   5. Retours de create/update/delete en MessageResponseDto (pas SimpleResponseDto<void>)
 *      — c'est le type reellement utilise par InfrastructureRepository/UseCase/Facade.
 *   6. Mappers principal et find-one en classe @Injectable etendant PaginatedMapper /
 *      SimpleResponseMapper, avec cache d'entites + entity.with() (referentialite pour
 *      Angular change detection) ; mapper select SANS cache (aligne sur la simplification
 *      recente d'infrastructure-select.mapper.ts, qui a retire un cache jamais purge —
 *      Experience 033/034 : ce cache etait un risque de fuite memoire latent dans un
 *      service singleton, sa suppression est une correction, pas une regression).
 *   7. Sources API (api.ts) injectent SETTINGS_API_URL (@core/config/config.tokens) et
 *      utilisent un fichier d'endpoints dedie ({module}.endpoints.ts) + buildHttpParams/
 *      buildHttpPayload (@shared/domain/utils), au lieu d'une URL de base en dur.
 *   8. DI providers nommes {entity}Providers / {entity}SelectProviders /
 *      {entity}FindOneProviders (Provider[] type), pas provide{Entity}.
 *   9. Facade principale alignee sur le modele reel : signaux d'etat d'action
 *      (_actionState/_actionSuccess/_actionError), suivi memoire (hasInitialized,
 *      lastFetchTimestamp, resetMemory(), getMemoryStatus()), et
 *      handleObservableWithFeedback (@shared/application/services/facade.utils) pour
 *      les mutations avec cle i18n de succes (COMMON.SUCCESS.{CREATE|UPDATE|DELETE}).
 *
 * Perimetre explicite : la couche presentation (formulaires/listes/routes) reste
 * volontairement generique — le module reel a des besoins metier propres a
 * "infrastructure" (selecteur de type, geolocalisation, tooltips de permission, sous-
 * route d'historique) qui ne generalisent pas a une entite de reference neutre. Ce qui
 * est reproduit fidelement, c'est l'architecture (domain/application/infrastructure),
 * source des bugs reels trouves cette session — pas chaque enrichissement UI specifique.
 *
 * Entite de reference : "resources" (name, code, description) — nom neutre choisi pour
 * ne pas entrer en collision avec une entite metier reelle.
 */
import fs from 'fs';
import path from 'path';

const ROOT = process.argv[2];
if (!ROOT) {
    console.error('Usage: node generate-reference-module.js <dossier-destination>');
    process.exit(1);
}

const E = 'resources'; // slug pluriel kebab
const Cap = 'Resources'; // PascalCase pour les classes
const MODULE = 'seos-reference'; // nom du module (page) — non branche dans les routes de l'app
const MODULE_UPPER = 'SEOS_REFERENCE';
const ENTITY_UPPER = 'RESOURCES';

function w(relPath, content) {
    const abs = path.join(ROOT, relPath);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, content.trimStart());
}

const BASE = `@pages/${MODULE}`;

// Operations avec un vrai Contract/ValidateContract/Validator (assertion function,
// GenericRequiredError par champ manquant) — verifie sur infrastructure : create, update,
// delete, find-one-filter suivent toutes ce modele (pas seulement create/update comme le
// supposait l'ancienne version de ce generateur).
const crudOps = [
    { kind: 'create', fields: ['code', 'name', 'description'] },
    { kind: 'update', fields: ['uniqId', 'code', 'name', 'description'] },
];

// ---------------------------------------------------------------------
// DOMAIN — interfaces (props)
// ---------------------------------------------------------------------

w(`domain/interfaces/${E}/${E}-props.interface.ts`, `
export interface ${Cap}Props {
    uniqId: string;
    code: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}
`);

w(`domain/interfaces/${E}/${E}-find-one-props.interface.ts`, `
export interface ${Cap}FindOneProps {
    uniqId: string;
    code: string;
    name: string;
    description: string;
    updatedAt: string;
}
`);

// select-props.interface.ts : promu au coeur canonique en v14 (Experience 032), sur la
// base du module de reference lui-meme (infrastructure ET infrastructure-type), pas d'un
// comptage d'usage ailleurs dans l'app (n=2 fichiers a l'epoque de la promotion).
w(`domain/interfaces/${E}/${E}-select-props.interface.ts`, `
export interface ${Cap}SelectProps {
    label: string;
    value: string;
}
`);

// ---------------------------------------------------------------------
// DOMAIN — entities
// ---------------------------------------------------------------------

w(`domain/entities/${E}/${E}.entity.ts`, `
import { ${Cap}Props } from '${BASE}/domain/interfaces/${E}/${E}-props.interface';

export class ${Cap}Entity {
    constructor(private readonly props: ${Cap}Props) {}

    get uniqId(): string {
        return this.props.uniqId;
    }
    get code(): string {
        return this.props.code;
    }
    get name(): string {
        return this.props.name;
    }
    get description(): string {
        return this.props.description;
    }
    get createdAt(): string {
        return this.props.createdAt;
    }
    get updatedAt(): string {
        return this.props.updatedAt;
    }

    public with(props: ${Cap}Props): ${Cap}Entity {
        if (
            this.updatedAt === props.updatedAt &&
            this.uniqId === props.uniqId
        ) {
            return this;
        }
        return new ${Cap}Entity(props);
    }
}
`);

w(`domain/entities/${E}/${E}-find-one.entity.ts`, `
import { ${Cap}FindOneProps } from '${BASE}/domain/interfaces/${E}/${E}-find-one-props.interface';

export class ${Cap}FindOneEntity {
    constructor(private readonly props: ${Cap}FindOneProps) {}

    get uniqId(): string {
        return this.props.uniqId;
    }
    get code(): string {
        return this.props.code;
    }
    get name(): string {
        return this.props.name;
    }
    get description(): string {
        return this.props.description;
    }
    get updatedAt(): string {
        return this.props.updatedAt;
    }

    public with(props: ${Cap}FindOneProps): ${Cap}FindOneEntity {
        if (
            this.updatedAt === props.updatedAt &&
            this.uniqId === props.uniqId
        ) {
            return this;
        }
        return new ${Cap}FindOneEntity(props);
    }
}
`);

// select.entity.ts : classe simple sur Props dediee, PAS de .with() — verifie sur
// infrastructure-select.entity.ts (simplifie recemment, Experience 033/034) : un
// facade de select n'a pas besoin de referentialite d'update in-place, juste d'un objet
// {label, value} immuable.
w(`domain/entities/${E}/${E}-select.entity.ts`, `
import { ${Cap}SelectProps } from '${BASE}/domain/interfaces/${E}/${E}-select-props.interface';

export class ${Cap}SelectEntity {
    constructor(private readonly props: ${Cap}SelectProps) {}

    get label(): string {
        return this.props.label;
    }

    get value(): string {
        return this.props.value;
    }
}
`);

// filter "entity" : fonction (jamais une classe, Experience 007/010), conservee
// uniquement parce qu'elle porte une vraie regle metier au-dela du passthrough — modele
// exact d'infrastructureFilterEntity : defaut endDate = aujourd'hui si startDate est
// fourni sans endDate.
w(`domain/entities/${E}/${E}-filter.entity.ts`, `
import { ${Cap}FilterContract } from '${BASE}/domain/contracts/${E}/${E}-filter.contract';

export function ${E}FilterEntity(
    contract: ${Cap}FilterContract
): ${Cap}FilterContract {
    const endDateRule =
        contract.startDate && !contract.endDate ? new Date() : contract.endDate;
    return {
        ...contract,
        endDate: endDateRule,
    };
}
`);

// ---------------------------------------------------------------------
// DOMAIN — contracts / validate-contracts / validators / value-objects
// ---------------------------------------------------------------------

w(`domain/contracts/${E}/${E}-filter.contract.ts`, `
export interface ${Cap}FilterContract {
    search?: string;
    startDate?: Date;
    endDate?: Date;
}
`);

w(`domain/validators/${E}/${E}-filter.validator.ts`, `
import { ${Cap}FilterContract } from '${BASE}/domain/contracts/${E}/${E}-filter.contract';
import { DateRangeInvalidError } from '@shared/domain/errors/validation/date-range-invalid.error';

export function validate${Cap}Filter(
    contract: ${Cap}FilterContract
): asserts contract is ${Cap}FilterContract {
    if (
        contract &&
        contract.startDate &&
        contract.endDate &&
        contract.startDate.getTime() > contract.endDate.getTime()
    ) {
        throw new DateRangeInvalidError();
    }
}
`);

w(`domain/value-objects/${E}/${E}-filter.vo.ts`, `
import { ${Cap}FilterContract } from '${BASE}/domain/contracts/${E}/${E}-filter.contract';
import { validate${Cap}Filter } from '${BASE}/domain/validators/${E}/${E}-filter.validator';

export function ${E}FilterVo(
    contract: ${Cap}FilterContract
): ${Cap}FilterContract {
    validate${Cap}Filter(contract);
    return contract;
}
`);

// find-one-filter : Contract (optionnel) / ValidateContract (strict) / Validator reels —
// verifie sur infrastructure-find-one-filter.{contract,validate-contract,validator}.ts :
// ce n'est PAS un simple wrapper de type comme le supposait l'ancienne version de ce
// generateur (classe ${Cap}FindOneFilterVo sans validation). uniqId est requis et sa
// validation peut lever GenericRequiredError, donc find-one.execute() doit etre sous
// defer() (voir use-case plus bas).
w(`domain/contracts/${E}/${E}-find-one-filter.contract.ts`, `
export interface ${Cap}FindOneFilterContract {
    uniqId?: string;
}
`);
w(`domain/contracts/${E}/${E}-find-one-filter.validate-contract.ts`, `
export interface ${Cap}FindOneFilterValidateContract {
    uniqId: string;
}
`);
w(`domain/validators/${E}/${E}-find-one-filter.validator.ts`, `
import { ${Cap}FindOneFilterContract } from '${BASE}/domain/contracts/${E}/${E}-find-one-filter.contract';
import { ${Cap}FindOneFilterValidateContract } from '${BASE}/domain/contracts/${E}/${E}-find-one-filter.validate-contract';
import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';

export function validate${Cap}FindOneFilter(
    contract: ${Cap}FindOneFilterContract
): asserts contract is ${Cap}FindOneFilterValidateContract {
    if (!contract.uniqId) {
        throw new GenericRequiredError(
            '${MODULE_UPPER}.${ENTITY_UPPER}.FORM.ERROR.FIND_ONE.UNIQ_ID_REQUIRE'
        );
    }
}
`);
w(`domain/value-objects/${E}/${E}-find-one-filter.vo.ts`, `
import { ${Cap}FindOneFilterContract } from '${BASE}/domain/contracts/${E}/${E}-find-one-filter.contract';
import { ${Cap}FindOneFilterValidateContract } from '${BASE}/domain/contracts/${E}/${E}-find-one-filter.validate-contract';
import { validate${Cap}FindOneFilter } from '${BASE}/domain/validators/${E}/${E}-find-one-filter.validator';

export function ${E}FindOneFilterVo(
    contract: ${Cap}FindOneFilterContract
): ${Cap}FindOneFilterValidateContract {
    validate${Cap}FindOneFilter(contract);
    return contract;
}
`);

// delete : Contract (optionnel) / ValidateContract (strict) / Validator reels — verifie
// sur infrastructure-delete.{contract,validate-contract,validator}.ts. L'ancienne version
// de ce generateur traitait delete comme un VO identite pur ("uniqId deja garanti par le
// type au niveau du Dto") : faux pour le module de reference reel, ou uniqId est
// explicitement re-valide au niveau domaine (defense en profondeur, independante du Dto
// applicatif) et peut donc lever GenericRequiredError — d'ou defer() requis aussi ici.
w(`domain/contracts/${E}/${E}-delete.contract.ts`, `
export interface ${Cap}DeleteContract {
    uniqId?: string;
}
`);
w(`domain/contracts/${E}/${E}-delete.validate-contract.ts`, `
export interface ${Cap}DeleteValidateContract {
    uniqId: string;
}
`);
w(`domain/validators/${E}/${E}-delete.validator.ts`, `
import { ${Cap}DeleteContract } from '${BASE}/domain/contracts/${E}/${E}-delete.contract';
import { ${Cap}DeleteValidateContract } from '${BASE}/domain/contracts/${E}/${E}-delete.validate-contract';
import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';

export function validate${Cap}Delete(
    contract: ${Cap}DeleteContract
): asserts contract is ${Cap}DeleteValidateContract {
    if (!contract.uniqId) {
        throw new GenericRequiredError(
            '${MODULE_UPPER}.${ENTITY_UPPER}.FORM.ERROR.DELETE.UNIQ_ID_REQUIRE'
        );
    }
}
`);
w(`domain/value-objects/${E}/${E}-delete.vo.ts`, `
import { ${Cap}DeleteContract } from '${BASE}/domain/contracts/${E}/${E}-delete.contract';
import { ${Cap}DeleteValidateContract } from '${BASE}/domain/contracts/${E}/${E}-delete.validate-contract';
import { validate${Cap}Delete } from '${BASE}/domain/validators/${E}/${E}-delete.validator';

export function ${E}DeleteVo(
    contract: ${Cap}DeleteContract
): ${Cap}DeleteValidateContract {
    validate${Cap}Delete(contract);
    return contract;
}
`);

// create / update : Contract (champs optionnels) / ValidateContract (champs stricts) /
// Validator (assertion function, un throw GenericRequiredError par champ requis) / VO
// (fonction, retour explicite champ par champ — modele infrastructureCreateVo/
// infrastructureUpdateVo).
for (const { kind, fields } of crudOps) {
    const Kind = kind[0].toUpperCase() + kind.slice(1);
    const required = fields.filter((f) => f !== 'uniqId');

    w(`domain/contracts/${E}/${E}-${kind}.contract.ts`, `
export interface ${Cap}${Kind}Contract {
    ${kind === 'update' ? 'uniqId: string;\n    ' : ''}${required
        .map((f) => `${f}?: string;`)
        .join('\n    ')}
}
`);
    w(`domain/contracts/${E}/${E}-${kind}.validate-contract.ts`, `
export interface ${Cap}${Kind}ValidateContract {
    ${kind === 'update' ? 'uniqId: string;\n    ' : ''}${required
        .map((f) => `${f}: string;`)
        .join('\n    ')}
}
`);
    w(`domain/validators/${E}/${E}-${kind}.validator.ts`, `
import { ${Cap}${Kind}Contract } from '${BASE}/domain/contracts/${E}/${E}-${kind}.contract';
import { ${Cap}${Kind}ValidateContract } from '${BASE}/domain/contracts/${E}/${E}-${kind}.validate-contract';
import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';

export function validate${Cap}${Kind}(
    contract: ${Cap}${Kind}Contract
): asserts contract is ${Cap}${Kind}ValidateContract {
${(kind === 'update' ? ['uniqId', ...required] : required)
    .map(
        (f) => `    if (!contract.${f}) {
        throw new GenericRequiredError(
            '${MODULE_UPPER}.${ENTITY_UPPER}.FORM.ERROR.${kind.toUpperCase()}.${f.toUpperCase()}_REQUIRE'
        );
    }`
    )
    .join('\n')}
}
`);
    w(`domain/value-objects/${E}/${E}-${kind}.vo.ts`, `
import { ${Cap}${Kind}Contract } from '${BASE}/domain/contracts/${E}/${E}-${kind}.contract';
import { ${Cap}${Kind}ValidateContract } from '${BASE}/domain/contracts/${E}/${E}-${kind}.validate-contract';
import { validate${Cap}${Kind} } from '${BASE}/domain/validators/${E}/${E}-${kind}.validator';

export function ${E}${Kind}Vo(
    contract: ${Cap}${Kind}Contract
): ${Cap}${Kind}ValidateContract {
    validate${Cap}${Kind}(contract);
    return {
        ${kind === 'update' ? 'uniqId: contract.uniqId,\n        ' : ''}${required
        .map((f) => `${f}: contract.${f}`)
        .join(',\n        ')}
    };
}
`);

    w(`application/dto/${E}/${E}-${kind}.dto.ts`, `
export interface ${Cap}${Kind}Dto {
    ${kind === 'update' ? 'uniqId: string;\n    ' : ''}${required
        .map((f) => `${f}?: string;`)
        .join('\n    ')}
}
`);
}

w(`application/dto/${E}/${E}-delete.dto.ts`, `
export interface ${Cap}DeleteDto {
    uniqId: string;
}
`);
w(`application/dto/${E}/${E}-filter.dto.ts`, `
export interface ${Cap}FilterDto {
    search?: string;
    startDate?: Date;
    endDate?: Date;
}
`);
w(`application/dto/${E}/${E}-find-one-filter.dto.ts`, `
export interface ${Cap}FindOneFilterDto {
    uniqId: string;
}
`);

// domain/validators : partage a l'echelle du module (1 fichier, pas par entite).
w(`domain/validators/form-validators.ts`, `
import { AbstractControl, ValidationErrors } from '@angular/forms';

export function requiredTrimmed(control: AbstractControl): ValidationErrors | null {
    const value = (control.value ?? '').toString().trim();
    return value.length > 0 ? null : { required: true };
}
`);

// presentation/store : controles de formulaire (interfaces pures, separees de l'etat
// reactif qui vit sous presentation/store/{ENTITY}/{ENTITY}-{filter,form}.store.ts).
w(`domain/controls/${E}/${E}-filter.control.ts`, `
import { FormControl } from '@angular/forms';

export interface ${Cap}FilterControl {
    search: FormControl<string | null>;
    startDate: FormControl<string | null>;
    endDate: FormControl<string | null>;
}
`);
w(`domain/controls/${E}/${E}-form.control.ts`, `
import { FormControl } from '@angular/forms';

export interface ${Cap}FormControl {
    code: FormControl<string | null>;
    name: FormControl<string | null>;
    description: FormControl<string | null>;
}
`);

// ---------------------------------------------------------------------
// DOMAIN — repositories (abstraits, convention POINT — Experience 029/v14)
// ---------------------------------------------------------------------

w(`domain/repositories/${E}/${E}.repository.ts`, `
import { Injectable } from '@angular/core';
import { ${Cap}CreateValidateContract } from '${BASE}/domain/contracts/${E}/${E}-create.validate-contract';
import { ${Cap}DeleteValidateContract } from '${BASE}/domain/contracts/${E}/${E}-delete.validate-contract';
import { ${Cap}FilterContract } from '${BASE}/domain/contracts/${E}/${E}-filter.contract';
import { ${Cap}UpdateValidateContract } from '${BASE}/domain/contracts/${E}/${E}-update.validate-contract';
import { ${Cap}Entity } from '${BASE}/domain/entities/${E}/${E}.entity';
import {
    MessageResponseDto,
    Paginate,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export abstract class ${Cap}Repository {
    abstract execute(
        contract: ${Cap}FilterContract,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<${Cap}Entity>>;
    abstract create(
        contract: ${Cap}CreateValidateContract
    ): Observable<MessageResponseDto>;
    abstract update(
        contract: ${Cap}UpdateValidateContract
    ): Observable<MessageResponseDto>;
    abstract delete(
        contract: ${Cap}DeleteValidateContract
    ): Observable<MessageResponseDto>;
}
`);

w(`domain/repositories/${E}/${E}-find-one.repository.ts`, `
import { ${Cap}FindOneEntity } from '${BASE}/domain/entities/${E}/${E}-find-one.entity';
import { ${Cap}FindOneFilterValidateContract } from '${BASE}/domain/contracts/${E}/${E}-find-one-filter.validate-contract';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export abstract class ${Cap}FindOneRepository {
    abstract execute(
        filter: ${Cap}FindOneFilterValidateContract,
        options?: FetchOptions
    ): Observable<${Cap}FindOneEntity>;
}
`);

w(`domain/repositories/${E}/${E}-select.repository.ts`, `
import { ${Cap}SelectEntity } from '${BASE}/domain/entities/${E}/${E}-select.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export abstract class ${Cap}SelectRepository {
    abstract readAll(
        options?: FetchOptions
    ): Observable<${Cap}SelectEntity[]>;
}
`);

// ---------------------------------------------------------------------
// APPLICATION — commands / commands-mappers / commands-bus / commands-handlers
// ---------------------------------------------------------------------

for (const { kind, fields } of [
    ...crudOps,
    { kind: 'delete', fields: ['uniqId'] },
]) {
    const Kind = kind[0].toUpperCase() + kind.slice(1);
    w(`application/commands/${E}/${E}-${kind}.command.ts`, `
export class ${Cap}${Kind}Command {
    constructor(
        ${fields
            .map(
                (f) =>
                    `public readonly ${f}: ${f === 'uniqId' ? 'string' : 'string | undefined'}`
            )
            .join(',\n        ')}
    ) {}
}
`);

    w(`application/commands-mappers/${E}/${E}-${kind}.mapper.ts`, `
import { ${Cap}${Kind}Command } from '${BASE}/application/commands/${E}/${E}-${kind}.command';
import { ${Cap}${Kind}Contract } from '${BASE}/domain/contracts/${E}/${E}-${kind}.contract';

export function ${E}${Kind}CommandMapper(command: ${Cap}${Kind}Command): ${Cap}${Kind}Contract {
    return {
        ${fields.map((f) => `${f}: command.${f}`).join(',\n        ')}
    };
}
`);

    w(`application/commands-bus/${E}/${E}-${kind}.bus.ts`, `
import { Injectable, inject } from '@angular/core';
import { ${Cap}${Kind}Command } from '${BASE}/application/commands/${E}/${E}-${kind}.command';
import { ${Cap}${Kind}Handler } from '${BASE}/application/commands-handlers/${E}/${E}-${kind}.handler';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ${Cap}${Kind}Bus {
    private readonly ${kind}Handler = inject(${Cap}${Kind}Handler);

    dispatch<T>(command: T): Observable<MessageResponseDto> {
        if (command instanceof ${Cap}${Kind}Command) {
            return this.${kind}Handler.execute(command);
        }
        throw new Error('No handler found for command');
    }
}
`);

    w(`application/commands-handlers/${E}/${E}-${kind}.handler.ts`, `
import { inject, Injectable } from '@angular/core';
import { ${E}${Kind}CommandMapper } from '${BASE}/application/commands-mappers/${E}/${E}-${kind}.mapper';
import { ${Cap}${Kind}Command } from '${BASE}/application/commands/${E}/${E}-${kind}.command';
import { ${Cap}UseCase } from '${BASE}/application/use-cases/${E}/${E}.use-case';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ${Cap}${Kind}Handler {
    private readonly useCase = inject(${Cap}UseCase);

    execute(command: ${Cap}${Kind}Command): Observable<MessageResponseDto> {
        return this.useCase.${kind}(${E}${Kind}CommandMapper(command));
    }
}
`);
}

// ---------------------------------------------------------------------
// APPLICATION — queries / queries-mappers / queries-bus / queries-handlers
// ---------------------------------------------------------------------

w(`application/queries/${E}/${E}.query.ts`, `
export class ${Cap}Query {
    constructor(
        public readonly search?: string,
        public readonly startDate?: Date,
        public readonly endDate?: Date
    ) {}
}
`);
w(`application/queries/${E}/${E}-find-one.query.ts`, `
export class ${Cap}FindOneQuery {
    constructor(public readonly uniqId: string) {}
}
`);

w(`application/queries-bus/${E}/${E}.bus.ts`, `
import { Injectable, inject } from '@angular/core';
import { ${Cap}Query } from '${BASE}/application/queries/${E}/${E}.query';
import { ${Cap}Handler } from '${BASE}/application/queries-handlers/${E}/${E}.handler';
import { ${Cap}Entity } from '${BASE}/domain/entities/${E}/${E}.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ${Cap}Bus {
    private readonly handler = inject(${Cap}Handler);

    dispatch<T>(
        query: T,
        page: string,
        options: FetchOptions = {}
    ): Observable<Paginate<${Cap}Entity>> {
        if (query instanceof ${Cap}Query) {
            return this.handler.execute(query, page, options);
        }
        throw new Error('No handler found for query');
    }
}
`);

w(`application/queries-bus/${E}/${E}-find-one.bus.ts`, `
import { Injectable, inject } from '@angular/core';
import { ${Cap}FindOneQuery } from '${BASE}/application/queries/${E}/${E}-find-one.query';
import { ${Cap}FindOneHandler } from '${BASE}/application/queries-handlers/${E}/${E}-find-one.handler';
import { ${Cap}FindOneEntity } from '${BASE}/domain/entities/${E}/${E}-find-one.entity';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ${Cap}FindOneBus {
    private readonly handler = inject(${Cap}FindOneHandler);

    dispatch(command: ${Cap}FindOneQuery): Observable<${Cap}FindOneEntity> {
        return this.handler.execute(command);
    }
}
`);

w(`application/queries-mappers/${E}/${E}.mapper.ts`, `
import { ${Cap}Query } from '${BASE}/application/queries/${E}/${E}.query';
import { ${Cap}FilterContract } from '${BASE}/domain/contracts/${E}/${E}-filter.contract';

export function ${E}QueryMapper(query: ${Cap}Query): ${Cap}FilterContract {
    return {
        search: query.search ?? undefined,
        startDate: query.startDate ?? undefined,
        endDate: query.endDate ?? undefined,
    };
}
`);

w(`application/queries-mappers/${E}/${E}-find-one.mapper.ts`, `
import { ${Cap}FindOneQuery } from '${BASE}/application/queries/${E}/${E}-find-one.query';
import { ${Cap}FindOneFilterContract } from '${BASE}/domain/contracts/${E}/${E}-find-one-filter.contract';

export function ${E}FindOneQueryMapper(query: ${Cap}FindOneQuery): ${Cap}FindOneFilterContract {
    return { uniqId: query.uniqId };
}
`);

w(`application/queries-handlers/${E}/${E}.handler.ts`, `
import { inject, Injectable } from '@angular/core';
import { ${E}QueryMapper } from '${BASE}/application/queries-mappers/${E}/${E}.mapper';
import { ${Cap}Query } from '${BASE}/application/queries/${E}/${E}.query';
import { ${Cap}UseCase } from '${BASE}/application/use-cases/${E}/${E}.use-case';
import { ${Cap}Entity } from '${BASE}/domain/entities/${E}/${E}.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ${Cap}Handler {
    private readonly useCase = inject(${Cap}UseCase);

    execute(
        query: ${Cap}Query,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<${Cap}Entity>> {
        return this.useCase.execute(${E}QueryMapper(query), page, options);
    }
}
`);

w(`application/queries-handlers/${E}/${E}-find-one.handler.ts`, `
import { inject, Injectable } from '@angular/core';
import { ${E}FindOneQueryMapper } from '${BASE}/application/queries-mappers/${E}/${E}-find-one.mapper';
import { ${Cap}FindOneQuery } from '${BASE}/application/queries/${E}/${E}-find-one.query';
import { ${Cap}FindOneUseCase } from '${BASE}/application/use-cases/${E}/${E}-find-one.use-case';
import { ${Cap}FindOneEntity } from '${BASE}/domain/entities/${E}/${E}-find-one.entity';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ${Cap}FindOneHandler {
    private readonly useCase = inject(${Cap}FindOneUseCase);

    execute(query: ${Cap}FindOneQuery): Observable<${Cap}FindOneEntity> {
        return this.useCase.execute(${E}FindOneQueryMapper(query));
    }
}
`);

// ---------------------------------------------------------------------
// APPLICATION — use-cases (main / find-one / select)
// ---------------------------------------------------------------------

// defer() sur TOUTE methode dont le VO/validateur appele peut lever une exception
// synchrone : create, update, delete, execute (filtre, chaine VO -> Entity), find-one.
// Corrige par rapport a l'ancienne version de ce generateur, qui ne deferait que
// create/update alors qu'execute()/delete() valident aussi et peuvent throw (meme classe
// de bug qu'Experience 008/012/027/028/029, jamais corrigee dans le generateur lui-meme
// jusqu'a cette reecriture).
w(`application/use-cases/${E}/${E}.use-case.ts`, `
import { Injectable, inject } from '@angular/core';
import { ${Cap}CreateContract } from '${BASE}/domain/contracts/${E}/${E}-create.contract';
import { ${Cap}DeleteContract } from '${BASE}/domain/contracts/${E}/${E}-delete.contract';
import { ${Cap}UpdateContract } from '${BASE}/domain/contracts/${E}/${E}-update.contract';
import { ${E}FilterEntity } from '${BASE}/domain/entities/${E}/${E}-filter.entity';
import { ${Cap}Entity } from '${BASE}/domain/entities/${E}/${E}.entity';
import { ${Cap}FilterContract } from '${BASE}/domain/contracts/${E}/${E}-filter.contract';
import { ${Cap}Repository } from '${BASE}/domain/repositories/${E}/${E}.repository';
import { ${E}CreateVo } from '${BASE}/domain/value-objects/${E}/${E}-create.vo';
import { ${E}DeleteVo } from '${BASE}/domain/value-objects/${E}/${E}-delete.vo';
import { ${E}FilterVo } from '${BASE}/domain/value-objects/${E}/${E}-filter.vo';
import { ${E}UpdateVo } from '${BASE}/domain/value-objects/${E}/${E}-update.vo';
import {
    MessageResponseDto,
    Paginate,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable, defer } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ${Cap}UseCase {
    private readonly repository = inject(${Cap}Repository);

    execute(
        contract: ${Cap}FilterContract,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<${Cap}Entity>> {
        return defer(() => {
            const vo = ${E}FilterVo(contract);
            const entity = ${E}FilterEntity(vo);
            return this.repository.execute(entity, page, options);
        });
    }

    create(dto: ${Cap}CreateContract): Observable<MessageResponseDto> {
        return defer(() => this.repository.create(${E}CreateVo(dto)));
    }

    update(dto: ${Cap}UpdateContract): Observable<MessageResponseDto> {
        return defer(() => this.repository.update(${E}UpdateVo(dto)));
    }

    delete(dto: ${Cap}DeleteContract): Observable<MessageResponseDto> {
        return defer(() => this.repository.delete(${E}DeleteVo(dto)));
    }
}
`);

w(`application/use-cases/${E}/${E}-select.use-case.ts`, `
import { Injectable, inject } from '@angular/core';
import { ${Cap}SelectEntity } from '${BASE}/domain/entities/${E}/${E}-select.entity';
import { ${Cap}SelectRepository } from '${BASE}/domain/repositories/${E}/${E}-select.repository';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { defer, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ${Cap}SelectUseCase {
    private readonly repository = inject(${Cap}SelectRepository);

    readAll(options?: FetchOptions): Observable<${Cap}SelectEntity[]> {
        return defer(() => this.repository.readAll(options));
    }
}
`);

w(`application/use-cases/${E}/${E}-find-one.use-case.ts`, `
import { Injectable, inject } from '@angular/core';
import { ${Cap}FindOneFilterContract } from '${BASE}/domain/contracts/${E}/${E}-find-one-filter.contract';
import { ${Cap}FindOneEntity } from '${BASE}/domain/entities/${E}/${E}-find-one.entity';
import { ${Cap}FindOneRepository } from '${BASE}/domain/repositories/${E}/${E}-find-one.repository';
import { ${E}FindOneFilterVo } from '${BASE}/domain/value-objects/${E}/${E}-find-one-filter.vo';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { defer, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ${Cap}FindOneUseCase {
    private readonly repository = inject(${Cap}FindOneRepository);

    execute(
        contract: ${Cap}FindOneFilterContract,
        options?: FetchOptions
    ): Observable<${Cap}FindOneEntity> {
        return defer(() =>
            this.repository.execute(${E}FindOneFilterVo(contract), options)
        );
    }
}
`);

// ---------------------------------------------------------------------
// APPLICATION — services (facades), modele reel infrastructure.facade.ts
// ---------------------------------------------------------------------

w(`application/services/${E}/${E}.facade.ts`, `
import { inject, Injectable, signal } from '@angular/core';
import { ${Cap}CreateCommand } from '${BASE}/application/commands/${E}/${E}-create.command';
import { ${Cap}DeleteCommand } from '${BASE}/application/commands/${E}/${E}-delete.command';
import { ${Cap}UpdateCommand } from '${BASE}/application/commands/${E}/${E}-update.command';
import { ${Cap}CreateBus } from '${BASE}/application/commands-bus/${E}/${E}-create.bus';
import { ${Cap}DeleteBus } from '${BASE}/application/commands-bus/${E}/${E}-delete.bus';
import { ${Cap}UpdateBus } from '${BASE}/application/commands-bus/${E}/${E}-update.bus';
import { ${Cap}CreateDto } from '${BASE}/application/dto/${E}/${E}-create.dto';
import { ${Cap}DeleteDto } from '${BASE}/application/dto/${E}/${E}-delete.dto';
import { ${Cap}FilterDto } from '${BASE}/application/dto/${E}/${E}-filter.dto';
import { ${Cap}UpdateDto } from '${BASE}/application/dto/${E}/${E}-update.dto';
import { ${Cap}Query } from '${BASE}/application/queries/${E}/${E}.query';
import { ${Cap}Bus } from '${BASE}/application/queries-bus/${E}/${E}.bus';
import { ${Cap}Entity } from '${BASE}/domain/entities/${E}/${E}.entity';
import { BaseFacade } from '@shared/application/services/base-facade';
import { handleObservableWithFeedback } from '@shared/application/services/facade.utils';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ${Cap}Facade extends BaseFacade<${Cap}Entity, ${Cap}FilterDto> {
    private readonly uiFeedback = inject(UiFeedbackService);
    private readonly filterBus = inject(${Cap}Bus);
    private readonly createBus = inject(${Cap}CreateBus);
    private readonly updateBus = inject(${Cap}UpdateBus);
    private readonly deleteBus = inject(${Cap}DeleteBus);

    private readonly _actionState = signal<'idle' | 'loading'>('idle');
    readonly actionState = this._actionState.asReadonly();

    private readonly _actionSuccess = signal(0);
    readonly actionSuccess = this._actionSuccess.asReadonly();

    private readonly _actionError = signal<unknown | null>(null);
    readonly actionError = this._actionError.asReadonly();

    private hasInitialized = false;
    private lastFetchTimestamp = 0;

    readAll(
        filter: ${Cap}FilterDto = {},
        page: string = PAGINATION_CONST.DEFAULT_PAGE,
        options: FetchOptions = {}
    ): void {
        this.executeQuery(filter, page, options);
        this.hasInitialized = true;
    }

    refresh(): void {
        this.filterSubject.next(null);
        this.pageSubject.next(PAGINATION_CONST.DEFAULT_PAGE);
        this.executeQuery(null, this.pageSubject.getValue(), {
            forceRefresh: true,
        });
    }

    changePage(page: string): void {
        const filter = this.filterSubject.getValue();
        if (!filter) {
            return;
        }
        this.executeQuery(filter, page);
    }

    refreshWithLastFilterAndPage(): void {
        this.executeQuery(
            this.filterSubject.getValue(),
            this.pageSubject.getValue()
        );
    }

    private executeQuery(
        filter: ${Cap}FilterDto | null,
        page: string,
        options: FetchOptions = {}
    ): void {
        const query = this.buildQuery(filter ?? undefined);
        const fetch$ = this.filterBus.dispatch(query, page, options);
        this.fetchWithFilterAndPage(filter, page, fetch$, this.uiFeedback);
        this.lastFetchTimestamp = Date.now();
    }

    private buildQuery(filter?: ${Cap}FilterDto | null): ${Cap}Query {
        return new ${Cap}Query(filter?.search, filter?.startDate, filter?.endDate);
    }

    resetMemory(): void {
        this.hasInitialized = false;
        this.lastFetchTimestamp = 0;
        this.reset();
    }

    getMemoryStatus(): {
        hasInitialized: boolean;
        lastFetch: number;
        hasData: boolean;
    } {
        return {
            hasInitialized: this.hasInitialized,
            lastFetch: this.lastFetchTimestamp,
            hasData: this.itemsSubject.getValue() !== null,
        };
    }

    create(item: ${Cap}CreateDto): void {
        this._actionState.set('loading');
        const command = new ${Cap}CreateCommand(item?.code, item?.name, item?.description);
        this.handleActionWithRefresh(
            this.createBus.dispatch(command),
            'COMMON.SUCCESS.CREATE'
        )
            .pipe()
            .subscribe();
    }

    update(item: ${Cap}UpdateDto): void {
        this._actionState.set('loading');
        const command = new ${Cap}UpdateCommand(
            item?.uniqId,
            item?.code,
            item?.name,
            item?.description
        );
        this.handleActionWithRefresh(
            this.updateBus.dispatch(command),
            'COMMON.SUCCESS.UPDATE'
        )
            .pipe()
            .subscribe();
    }

    delete(item: ${Cap}DeleteDto): void {
        const command = new ${Cap}DeleteCommand(item.uniqId);
        this.handleActionWithRefresh(
            this.deleteBus.dispatch(command),
            'COMMON.SUCCESS.DELETE'
        ).subscribe();
    }

    private handleActionWithRefresh<T>(
        observable: Observable<T>,
        successKey: string
    ): Observable<T> {
        return handleObservableWithFeedback(
            observable,
            this.uiFeedback,
            successKey,
            () => this.refresh()
        );
    }
}
`);

w(`application/services/${E}/${E}-select.facade.ts`, `
import { inject, Injectable } from '@angular/core';
import { ${Cap}SelectUseCase } from '${BASE}/application/use-cases/${E}/${E}-select.use-case';
import { ${Cap}SelectEntity } from '${BASE}/domain/entities/${E}/${E}-select.entity';
import { ArrayBaseFacade } from '@shared/application/services/array-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class ${Cap}SelectFacade extends ArrayBaseFacade<${Cap}SelectEntity, void> {
    private readonly uiFeedback = inject(UiFeedbackService);
    private readonly useCase = inject(${Cap}SelectUseCase);

    readAll(options: FetchOptions = {}): void {
        this.fetchWithFilter(
            null,
            this.useCase.readAll.bind(this.useCase, options),
            this.uiFeedback
        );
    }
}
`);

w(`application/services/${E}/${E}-find-one.facade.ts`, `
import { inject, Injectable } from '@angular/core';
import { ${Cap}FindOneFilterDto } from '${BASE}/application/dto/${E}/${E}-find-one-filter.dto';
import { ${Cap}FindOneQuery } from '${BASE}/application/queries/${E}/${E}-find-one.query';
import { ${Cap}FindOneBus } from '${BASE}/application/queries-bus/${E}/${E}-find-one.bus';
import { ${Cap}FindOneEntity } from '${BASE}/domain/entities/${E}/${E}-find-one.entity';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';

@Injectable({
    providedIn: 'root',
})
export class ${Cap}FindOneFacade extends ObjectBaseFacade<${Cap}FindOneEntity, ${Cap}FindOneFilterDto> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(${Cap}FindOneBus);

    read(filter: ${Cap}FindOneFilterDto): void {
        const command = new ${Cap}FindOneQuery(filter.uniqId);
        const fetch$ = this.bus.dispatch(command);
        this.fetch(filter, fetch$, this.ui);
    }
}
`);

// ---------------------------------------------------------------------
// PRESENTATION — store (controles + etat reactif)
// ---------------------------------------------------------------------

w(`presentation/store/${E}/${E}-filter.control.ts`, `
import { FormControl } from '@angular/forms';
import { ${Cap}FilterControl } from '${BASE}/domain/controls/${E}/${E}-filter.control';

export function createFilterControls(): ${Cap}FilterControl {
    return {
        search: new FormControl<string | null>(null),
        startDate: new FormControl<string | null>(null),
        endDate: new FormControl<string | null>(null),
    };
}
`);
w(`presentation/store/${E}/${E}-filter.store.ts`, `
import { Injectable, signal } from '@angular/core';
import { ${Cap}FilterDto } from '${BASE}/application/dto/${E}/${E}-filter.dto';

@Injectable({ providedIn: 'root' })
export class ${Cap}FilterStore {
    private readonly _filter = signal<${Cap}FilterDto | null>(null);
    readonly filter = this._filter.asReadonly();

    set(filter: ${Cap}FilterDto | null): void {
        this._filter.set(filter);
    }
}
`);
w(`presentation/store/${E}/${E}-form.control.ts`, `
import { FormControl } from '@angular/forms';
import { ${Cap}FormControl } from '${BASE}/domain/controls/${E}/${E}-form.control';

export function createFormControls(): ${Cap}FormControl {
    return {
        code: new FormControl<string | null>(null),
        name: new FormControl<string | null>(null),
        description: new FormControl<string | null>(null),
    };
}
`);
w(`presentation/store/${E}/${E}-form.store.ts`, `
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ${Cap}FormStore {
    private readonly _editingId = signal<string | null>(null);
    readonly editingId = this._editingId.asReadonly();

    startEdit(uniqId: string): void {
        this._editingId.set(uniqId);
    }

    stopEdit(): void {
        this._editingId.set(null);
    }
}
`);

// ---------------------------------------------------------------------
// DI providers — {entity}Providers (Provider[]), modele reel infrastructure.providers.ts
// ---------------------------------------------------------------------

w(`di/${E}/${E}.providers.ts`, `
import { Provider } from '@angular/core';
import { ${Cap}Repository } from '${BASE}/domain/repositories/${E}/${E}.repository';
import { ${Cap}RepositoryImpl } from '${BASE}/infrastructure/data/repositories/${E}/${E}.repository.impl';

export const ${E}Providers: Provider[] = [
    {
        provide: ${Cap}Repository,
        useClass: ${Cap}RepositoryImpl,
    },
];
`);
w(`di/${E}/${E}-select.providers.ts`, `
import { Provider } from '@angular/core';
import { ${Cap}SelectRepository } from '${BASE}/domain/repositories/${E}/${E}-select.repository';
import { ${Cap}SelectRepositoryImpl } from '${BASE}/infrastructure/data/repositories/${E}/${E}-select.repository.impl';

export const ${E}SelectProviders: Provider[] = [
    {
        provide: ${Cap}SelectRepository,
        useClass: ${Cap}SelectRepositoryImpl,
    },
];
`);
w(`di/${E}/${E}-find-one.providers.ts`, `
import { Provider } from '@angular/core';
import { ${Cap}FindOneRepository } from '${BASE}/domain/repositories/${E}/${E}-find-one.repository';
import { ${Cap}FindOneRepositoryImpl } from '${BASE}/infrastructure/data/repositories/${E}/${E}-find-one.repository.impl';

export const ${E}FindOneProviders: Provider[] = [
    {
        provide: ${Cap}FindOneRepository,
        useClass: ${Cap}FindOneRepositoryImpl,
    },
];
`);

// ---------------------------------------------------------------------
// INFRASTRUCTURE — api dto (reponses enveloppees dans SimpleResponseDto/
// PaginatedResponseDto — pas de tableau nu, incompatible avec ArrayResponseMapper)
// ---------------------------------------------------------------------

const apiKinds = ['create', 'update', 'delete', 'filter', 'find-one-filter'];
for (const kind of apiKinds) {
    const Kind = kind.replace(/(^|-)([a-z])/g, (_, __, c) => c.toUpperCase());
    w(`infrastructure/api/dto/${E}/${E}-${kind}-api.dto.ts`, `
export interface ${Cap}${Kind}ApiDto {
    ${kind === 'create' ? 'code: string;\n    name: string;\n    description: string;' : ''}
    ${kind === 'update' ? 'id: string;\n    code: string;\n    name: string;\n    description: string;' : ''}
    ${kind === 'delete' ? 'uniq_id: string;' : ''}
    ${kind === 'filter' ? 'search?: string;\n    start_date?: Date;\n    end_date?: Date;' : ''}
    ${kind === 'find-one-filter' ? 'id: string;' : ''}
}
`);
}

w(`infrastructure/api/dto/${E}/${E}-response-api.dto.ts`, `
import { PaginatedResponseDto } from '@shared/data/dto/simple-response.dto';

export interface ${Cap}ItemApiDto {
    id: string;
    code: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export type ${Cap}ResponseApiDto = PaginatedResponseDto<${Cap}ItemApiDto>;
`);

w(`infrastructure/api/dto/${E}/${E}-find-one-response-api.dto.ts`, `
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface ${Cap}FindOneItemApiDto {
    id: string;
    code: string;
    name: string;
    description: string;
    updated_at: string;
}

export type ${Cap}FindOneResponseApiDto = SimpleResponseDto<${Cap}FindOneItemApiDto>;
`);

// select-response-api.dto.ts : enveloppe dans SimpleResponseDto<T[]> — modele reel
// infrastructure-select-response-api.dto.ts (Experience 029/030), pas un tableau nu comme
// le faisait l'ancienne version de ce generateur (incompatible avec ArrayResponseMapper,
// qui attend un ArrayResponseDto<T> enveloppe).
w(`infrastructure/api/dto/${E}/${E}-select-response-api.dto.ts`, `
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface ${Cap}SelectItemApiDto {
    id: string;
    name: string;
}

export type ${Cap}SelectResponseApiDto = SimpleResponseDto<
    ${Cap}SelectItemApiDto[]
>;
`);

// ---------------------------------------------------------------------
// INFRASTRUCTURE — data/mappers (classes @Injectable, cache + .with() pour main/find-one,
// SANS cache pour select — Experience 033/034)
// ---------------------------------------------------------------------

for (const { kind } of crudOps) {
    const Kind = kind[0].toUpperCase() + kind.slice(1);
    w(`infrastructure/data/mappers/${E}/${E}-${kind}.mapper.ts`, `
import { ${Cap}${Kind}ValidateContract } from '${BASE}/domain/contracts/${E}/${E}-${kind}.validate-contract';
import { ${Cap}${Kind}ApiDto } from '${BASE}/infrastructure/api/dto/${E}/${E}-${kind}-api.dto';

export function ${E}${Kind}Mapper(contract: ${Cap}${Kind}ValidateContract): ${Cap}${Kind}ApiDto {
    return {
        ${kind === 'update' ? 'id: contract.uniqId,\n        ' : ''}code: contract.code,
        name: contract.name,
        description: contract.description,
    };
}
`);
}

w(`infrastructure/data/mappers/${E}/${E}-delete.mapper.ts`, `
import { ${Cap}DeleteValidateContract } from '${BASE}/domain/contracts/${E}/${E}-delete.validate-contract';
import { ${Cap}DeleteApiDto } from '${BASE}/infrastructure/api/dto/${E}/${E}-delete-api.dto';

export function ${E}DeleteMapper(contract: ${Cap}DeleteValidateContract): ${Cap}DeleteApiDto {
    return { uniq_id: contract.uniqId };
}
`);

w(`infrastructure/data/mappers/${E}/${E}-filter.mapper.ts`, `
import { ${Cap}FilterContract } from '${BASE}/domain/contracts/${E}/${E}-filter.contract';
import { ${Cap}FilterApiDto } from '${BASE}/infrastructure/api/dto/${E}/${E}-filter-api.dto';

export function ${E}FilterMapper(contract: ${Cap}FilterContract): ${Cap}FilterApiDto {
    const params: ${Cap}FilterApiDto = {};
    if (contract.search) {
        params.search = contract.search;
    }
    if (contract.startDate) {
        params.start_date = contract.startDate;
    }
    if (contract.endDate) {
        params.end_date = contract.endDate;
    }
    return params;
}
`);

w(`infrastructure/data/mappers/${E}/${E}-find-one-filter.mapper.ts`, `
import { ${Cap}FindOneFilterValidateContract } from '${BASE}/domain/contracts/${E}/${E}-find-one-filter.validate-contract';
import { ${Cap}FindOneFilterApiDto } from '${BASE}/infrastructure/api/dto/${E}/${E}-find-one-filter-api.dto';

export function ${E}FindOneFilterMapper(contract: ${Cap}FindOneFilterValidateContract): ${Cap}FindOneFilterApiDto {
    return { id: contract.uniqId };
}
`);

w(`infrastructure/data/mappers/${E}/${E}.mapper.ts`, `
import { Injectable } from '@angular/core';
import { ${Cap}Entity } from '${BASE}/domain/entities/${E}/${E}.entity';
import { ${Cap}Props } from '${BASE}/domain/interfaces/${E}/${E}-props.interface';
import { ${Cap}ItemApiDto } from '${BASE}/infrastructure/api/dto/${E}/${E}-response-api.dto';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({
    providedIn: 'root',
})
export class ${Cap}Mapper extends PaginatedMapper<${Cap}Entity, ${Cap}ItemApiDto> {
    private readonly entityCache = new Map<string, ${Cap}Entity>();

    protected mapItemFromDto(dto: ${Cap}ItemApiDto): ${Cap}Entity {
        MapperUtils.validateDto(dto, { required: ['id'] });
        const props: ${Cap}Props = {
            uniqId: dto.id,
            code: dto.code,
            name: dto.name,
            description: dto.description,
            createdAt: dto.created_at,
            updatedAt: dto.updated_at,
        };

        const cacheKey = \`dto:\${dto.id}\`;
        const cached = this.entityCache.get(cacheKey);
        const entity = cached ? cached.with(props) : new ${Cap}Entity(props);
        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
`);

w(`infrastructure/data/mappers/${E}/${E}-find-one.mapper.ts`, `
import { Injectable } from '@angular/core';
import { ${Cap}FindOneEntity } from '${BASE}/domain/entities/${E}/${E}-find-one.entity';
import { ${Cap}FindOneProps } from '${BASE}/domain/interfaces/${E}/${E}-find-one-props.interface';
import { ${Cap}FindOneItemApiDto } from '${BASE}/infrastructure/api/dto/${E}/${E}-find-one-response-api.dto';
import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({
    providedIn: 'root',
})
export class ${Cap}FindOneMapper extends SimpleResponseMapper<${Cap}FindOneEntity, ${Cap}FindOneItemApiDto> {
    private readonly entityCache = new Map<string, ${Cap}FindOneEntity>();

    protected mapItemFromDto(dto: ${Cap}FindOneItemApiDto): ${Cap}FindOneEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });
        const props: ${Cap}FindOneProps = {
            uniqId: dto.id,
            code: dto.code,
            name: dto.name,
            description: dto.description,
            updatedAt: dto.updated_at,
        };

        const cacheKey = \`dto:\${dto.id}\`;
        const cached = this.entityCache.get(cacheKey);
        const entity = cached ? cached.with(props) : new ${Cap}FindOneEntity(props);
        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
`);

// select.mapper.ts : SANS cache d'entites — modele infrastructure-select.mapper.ts
// simplifie recemment (Experience 033/034) ; l'ancien cache etait un Map jamais purge
// dans un service singleton, un risque de fuite memoire latent, pas une optimisation
// necessaire pour un select (pas de besoin de referentialite d'update in-place).
w(`infrastructure/data/mappers/${E}/${E}-select.mapper.ts`, `
import { Injectable } from '@angular/core';
import { ${Cap}SelectEntity } from '${BASE}/domain/entities/${E}/${E}-select.entity';
import { ${Cap}SelectProps } from '${BASE}/domain/interfaces/${E}/${E}-select-props.interface';
import { ${Cap}SelectItemApiDto } from '${BASE}/infrastructure/api/dto/${E}/${E}-select-response-api.dto';
import { ArrayResponseMapper } from '@shared/data/mappers/base/array-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({
    providedIn: 'root',
})
export class ${Cap}SelectMapper extends ArrayResponseMapper<${Cap}SelectEntity, ${Cap}SelectItemApiDto> {
    protected mapItemFromDto(dto: ${Cap}SelectItemApiDto): ${Cap}SelectEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });
        const props: ${Cap}SelectProps = {
            label: dto.name,
            value: dto.id,
        };
        return new ${Cap}SelectEntity(props);
    }
}
`);

// ---------------------------------------------------------------------
// INFRASTRUCTURE — endpoints + data/sources (api), SETTINGS_API_URL injecte
// ---------------------------------------------------------------------

w(`infrastructure/api/${MODULE}.endpoints.ts`, `
export const ${MODULE_UPPER.replace(/-/g, '_')}_ENDPOINTS = {
    ${ENTITY_UPPER}: '${E}',
} as const;
`);

w(`infrastructure/data/sources/${E}/${E}.api.ts`, `
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { SETTINGS_API_URL } from '@core/config/config.tokens';
import { ${Cap}CreateApiDto } from '${BASE}/infrastructure/api/dto/${E}/${E}-create-api.dto';
import { ${Cap}DeleteApiDto } from '${BASE}/infrastructure/api/dto/${E}/${E}-delete-api.dto';
import { ${Cap}FilterApiDto } from '${BASE}/infrastructure/api/dto/${E}/${E}-filter-api.dto';
import { ${Cap}ResponseApiDto } from '${BASE}/infrastructure/api/dto/${E}/${E}-response-api.dto';
import { ${Cap}UpdateApiDto } from '${BASE}/infrastructure/api/dto/${E}/${E}-update-api.dto';
import { ${MODULE_UPPER.replace(/-/g, '_')}_ENDPOINTS } from '${BASE}/infrastructure/api/${MODULE}.endpoints';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { buildHttpPayload } from '@shared/domain/utils/build-http-payload.util';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ${Cap}Api {
    private readonly http = inject(HttpClient);
    private readonly baseUrl: string = inject(SETTINGS_API_URL);

    readAll(
        filter: ${Cap}FilterApiDto,
        page: string,
        options?: FetchOptions
    ): Observable<${Cap}ResponseApiDto> {
        const url = \`\${this.baseUrl}\${${MODULE_UPPER.replace(/-/g, '_')}_ENDPOINTS.${ENTITY_UPPER}}?page=\${page}\`;
        const params = buildHttpParams(filter);
        const context = new HttpContext().set(BYPASS_CACHE, options?.forceRefresh ?? false);
        return this.http.get<${Cap}ResponseApiDto>(url, { params, context });
    }

    create(apiDto: ${Cap}CreateApiDto): Observable<MessageResponseDto> {
        const url = \`\${this.baseUrl}\${${MODULE_UPPER.replace(/-/g, '_')}_ENDPOINTS.${ENTITY_UPPER}}/store\`;
        const payload = buildHttpPayload(apiDto, []);
        return this.http.post<MessageResponseDto>(url, payload);
    }

    update(apiDto: ${Cap}UpdateApiDto): Observable<MessageResponseDto> {
        const url = \`\${this.baseUrl}\${${MODULE_UPPER.replace(/-/g, '_')}_ENDPOINTS.${ENTITY_UPPER}}/\${apiDto.id}/update\`;
        const payload = buildHttpPayload(apiDto, ['id']);
        return this.http.post<MessageResponseDto>(url, payload);
    }

    delete(apiDto: ${Cap}DeleteApiDto): Observable<MessageResponseDto> {
        const url = \`\${this.baseUrl}\${${MODULE_UPPER.replace(/-/g, '_')}_ENDPOINTS.${ENTITY_UPPER}}/\${apiDto.uniq_id}/delete\`;
        return this.http.delete<MessageResponseDto>(url);
    }
}
`);

w(`infrastructure/data/sources/${E}/${E}-find-one.api.ts`, `
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { SETTINGS_API_URL } from '@core/config/config.tokens';
import { ${Cap}FindOneFilterApiDto } from '${BASE}/infrastructure/api/dto/${E}/${E}-find-one-filter-api.dto';
import { ${Cap}FindOneResponseApiDto } from '${BASE}/infrastructure/api/dto/${E}/${E}-find-one-response-api.dto';
import { ${MODULE_UPPER.replace(/-/g, '_')}_ENDPOINTS } from '${BASE}/infrastructure/api/${MODULE}.endpoints';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ${Cap}FindOneApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl: string = inject(SETTINGS_API_URL);

    execute(
        filter?: ${Cap}FindOneFilterApiDto,
        options?: FetchOptions
    ): Observable<${Cap}FindOneResponseApiDto> {
        const params = filter?.id ? \`/\${filter.id}\` : '';
        const url = \`\${this.baseUrl}\${${MODULE_UPPER.replace(/-/g, '_')}_ENDPOINTS.${ENTITY_UPPER}}\${params}\`;
        const context = new HttpContext().set(BYPASS_CACHE, options?.forceRefresh ?? false);
        return this.http.get<${Cap}FindOneResponseApiDto>(url, { context });
    }
}
`);

w(`infrastructure/data/sources/${E}/${E}-select.api.ts`, `
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { SETTINGS_API_URL } from '@core/config/config.tokens';
import { ${Cap}SelectResponseApiDto } from '${BASE}/infrastructure/api/dto/${E}/${E}-select-response-api.dto';
import { ${MODULE_UPPER.replace(/-/g, '_')}_ENDPOINTS } from '${BASE}/infrastructure/api/${MODULE}.endpoints';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ${Cap}SelectApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl: string = inject(SETTINGS_API_URL);

    readAll(options?: FetchOptions): Observable<${Cap}SelectResponseApiDto> {
        const url = \`\${this.baseUrl}\${${MODULE_UPPER.replace(/-/g, '_')}_ENDPOINTS.${ENTITY_UPPER}}\`;
        const context = new HttpContext().set(BYPASS_CACHE, options?.forceRefresh ?? false);
        return this.http.get<${Cap}SelectResponseApiDto>(url, { context });
    }
}
`);

// ---------------------------------------------------------------------
// INFRASTRUCTURE — data/repositories (impl, convention POINT)
// ---------------------------------------------------------------------

w(`infrastructure/data/repositories/${E}/${E}.repository.impl.ts`, `
import { Injectable, inject } from '@angular/core';
import { ${Cap}CreateValidateContract } from '${BASE}/domain/contracts/${E}/${E}-create.validate-contract';
import { ${Cap}DeleteValidateContract } from '${BASE}/domain/contracts/${E}/${E}-delete.validate-contract';
import { ${Cap}FilterContract } from '${BASE}/domain/contracts/${E}/${E}-filter.contract';
import { ${Cap}UpdateValidateContract } from '${BASE}/domain/contracts/${E}/${E}-update.validate-contract';
import { ${Cap}Entity } from '${BASE}/domain/entities/${E}/${E}.entity';
import { ${Cap}Repository } from '${BASE}/domain/repositories/${E}/${E}.repository';
import { ${E}CreateMapper } from '${BASE}/infrastructure/data/mappers/${E}/${E}-create.mapper';
import { ${E}DeleteMapper } from '${BASE}/infrastructure/data/mappers/${E}/${E}-delete.mapper';
import { ${E}FilterMapper } from '${BASE}/infrastructure/data/mappers/${E}/${E}-filter.mapper';
import { ${E}UpdateMapper } from '${BASE}/infrastructure/data/mappers/${E}/${E}-update.mapper';
import { ${Cap}Mapper } from '${BASE}/infrastructure/data/mappers/${E}/${E}.mapper';
import { ${Cap}Api } from '${BASE}/infrastructure/data/sources/${E}/${E}.api';
import {
    MessageResponseDto,
    Paginate,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable, map } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ${Cap}RepositoryImpl implements ${Cap}Repository {
    private readonly api = inject(${Cap}Api);
    private readonly mapper = inject(${Cap}Mapper);

    execute(
        contract: ${Cap}FilterContract,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<${Cap}Entity>> {
        return this.api
            .readAll(${E}FilterMapper(contract), page, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    create(contract: ${Cap}CreateValidateContract): Observable<MessageResponseDto> {
        return this.api.create(${E}CreateMapper(contract));
    }

    update(contract: ${Cap}UpdateValidateContract): Observable<MessageResponseDto> {
        return this.api.update(${E}UpdateMapper(contract));
    }

    delete(contract: ${Cap}DeleteValidateContract): Observable<MessageResponseDto> {
        return this.api.delete(${E}DeleteMapper(contract));
    }
}
`);

w(`infrastructure/data/repositories/${E}/${E}-find-one.repository.impl.ts`, `
import { Injectable, inject } from '@angular/core';
import { ${Cap}FindOneFilterValidateContract } from '${BASE}/domain/contracts/${E}/${E}-find-one-filter.validate-contract';
import { ${Cap}FindOneEntity } from '${BASE}/domain/entities/${E}/${E}-find-one.entity';
import { ${Cap}FindOneRepository } from '${BASE}/domain/repositories/${E}/${E}-find-one.repository';
import { ${E}FindOneFilterMapper } from '${BASE}/infrastructure/data/mappers/${E}/${E}-find-one-filter.mapper';
import { ${Cap}FindOneMapper } from '${BASE}/infrastructure/data/mappers/${E}/${E}-find-one.mapper';
import { ${Cap}FindOneApi } from '${BASE}/infrastructure/data/sources/${E}/${E}-find-one.api';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable, map } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ${Cap}FindOneRepositoryImpl implements ${Cap}FindOneRepository {
    private readonly api = inject(${Cap}FindOneApi);
    private readonly mapper = inject(${Cap}FindOneMapper);

    execute(
        contract: ${Cap}FindOneFilterValidateContract,
        options?: FetchOptions
    ): Observable<${Cap}FindOneEntity> {
        const dto = ${E}FindOneFilterMapper(contract);
        return this.api.execute(dto, options).pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
`);

w(`infrastructure/data/repositories/${E}/${E}-select.repository.impl.ts`, `
import { Injectable, inject } from '@angular/core';
import { ${Cap}SelectEntity } from '${BASE}/domain/entities/${E}/${E}-select.entity';
import { ${Cap}SelectRepository } from '${BASE}/domain/repositories/${E}/${E}-select.repository';
import { ${Cap}SelectMapper } from '${BASE}/infrastructure/data/mappers/${E}/${E}-select.mapper';
import { ${Cap}SelectApi } from '${BASE}/infrastructure/data/sources/${E}/${E}-select.api';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable, map } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ${Cap}SelectRepositoryImpl implements ${Cap}SelectRepository {
    private readonly api = inject(${Cap}SelectApi);
    private readonly mapper = inject(${Cap}SelectMapper);

    readAll(options?: FetchOptions): Observable<${Cap}SelectEntity[]> {
        return this.api.readAll(options).pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
`);

// ---------------------------------------------------------------------
// PRESENTATION — adapters (vm-props/presenter), routes, composants (generique)
// ---------------------------------------------------------------------

w(`presentation/adapters/${E}/${E}-vm-props.interface.ts`, `
export interface ${Cap}VmProps {
    uniqId: string;
    code: string;
    name: string;
    description: string;
    updatedAt: string;
}
`);

w(`presentation/adapters/${E}/${E}-vm.presenter.ts`, `
import { ${Cap}Entity } from '${BASE}/domain/entities/${E}/${E}.entity';
import { ${Cap}VmProps } from '${BASE}/presentation/adapters/${E}/${E}-vm-props.interface';

export class ${Cap}Presenter {
    map(item: ${Cap}Entity): ${Cap}VmProps {
        return {
            uniqId: item.uniqId,
            code: item.code,
            name: item.name,
            description: item.description,
            updatedAt: item.updatedAt,
        };
    }
}
`);

w(`presentation/features/${E}/${E}-paths.constants.ts`, `
export const ${ENTITY_UPPER}_FORM = 'form';
export const ${ENTITY_UPPER}_LIST = 'list';
export const ${ENTITY_UPPER}_ROUTE = 'list';
`);

w(`presentation/features/${E}/${E}.routes.ts`, `
import { Routes } from '@angular/router';
import {
    ${ENTITY_UPPER}_FORM,
    ${ENTITY_UPPER}_LIST,
} from '${BASE}/presentation/features/${E}/${E}-paths.constants';

export const ${ENTITY_UPPER}_ROUTES: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: ${ENTITY_UPPER}_LIST,
    },
    {
        path: ${ENTITY_UPPER}_LIST,
        loadComponent: () =>
            import('${BASE}/presentation/features/${E}/${E}-list/${E}-list.component').then(
                (m) => m.${Cap}ListComponent
            ),
    },
    {
        path: ${ENTITY_UPPER}_FORM,
        loadComponent: () =>
            import('${BASE}/presentation/features/${E}/${E}-form/${E}-form.component').then(
                (m) => m.${Cap}FormComponent
            ),
    },
];
`);

w(`presentation/features/${E}/${E}-list/${E}-list.component.ts`, `
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ${Cap}Facade } from '${BASE}/application/services/${E}/${E}.facade';

@Component({
    selector: 'app-${E}-list',
    standalone: true,
    imports: [],
    template: '<div>${Cap} list — reference template SEOS</div>',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ${Cap}ListComponent implements OnInit {
    private readonly facade = inject(${Cap}Facade);

    ngOnInit(): void {
        this.facade.readAll({});
    }
}
`);

w(`presentation/features/${E}/${E}-form/${E}-form.component.ts`, `
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ${Cap}Facade } from '${BASE}/application/services/${E}/${E}.facade';

@Component({
    selector: 'app-${E}-form',
    standalone: true,
    imports: [],
    template: '<div>${Cap} form — reference template SEOS</div>',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ${Cap}FormComponent {
    private readonly facade = inject(${Cap}Facade);
}
`);

w(`presentation/features/${E}/${E}-page/${E}-page.component.ts`, `
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-${E}-page',
    standalone: true,
    imports: [RouterOutlet],
    template: '<router-outlet />',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ${Cap}PageComponent {
    protected readonly moduleName = '${E}';
}
`);

console.log('Reference module "resources" genere sous', ROOT);
