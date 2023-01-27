import Container from "../infrastructures/Container";

import { ErrorMessage } from "../interfaces/ErrorMessage";
import { HttpStatusCode } from "../interfaces/HttpStatusCode";

import HttpRouterError from "../entities/HttpRouterError";

import { ObfuscationOptions, ObfuscationServiceToken } from "./ObfuscationService";
import { PaginationColumnOptions, PaginationCustomColumnOptions, PaginationOptions, PaginationOptionsOptions, PaginationOrderColumnOptions, PaginationQueryOptions, PaginationQueryOrderOptions, PaginationServiceToken } from "./PaginationService";
import Service, { IService, ServiceOptions } from "./Service";

export type DeobfuscationOptions = ObfuscationOptions & {
  error: ErrorMessage
}

export type EntityOptions = ServiceOptions & {}

export type IEntityService = IService & {}

export default class EntityService<T> extends Service<T> implements IEntityService {

  protected obfuscateId(id: any, options: ObfuscationOptions) {
    const obfuscationService = Container.get(ObfuscationServiceToken)
    return obfuscationService.obfuscate(id, options)
  }

  protected deobfuscateId(hashId: string | string[], options: DeobfuscationOptions): number[] {
    const { error, ...obfuscationOptions } = options || {}

    const obfuscationService = Container.get(ObfuscationServiceToken)

    hashId = [hashId].flat()
    const id = obfuscationService.deobfuscate(hashId, obfuscationOptions)

    if (id.length !== hashId.length) throw new HttpRouterError(HttpStatusCode.BAD_REQUEST, error)

    return id
  }

  protected getPaginationOptions(params: any, options: PaginationOptionsOptions): PaginationOptions {
    const paginationService = Container.get(PaginationServiceToken)
    return paginationService.getPaginationOptions(params, options)
  }

  protected getPaginationQueryOptions(options: PaginationQueryOrderOptions): PaginationQueryOptions {
    const paginationService = Container.get(PaginationServiceToken)
    return paginationService.getPaginationQueryOptions(options)
  }

  protected getPaginationColumnOptions(options: PaginationColumnOptions): PaginationOrderColumnOptions {
    const paginationService = Container.get(PaginationServiceToken)
    return paginationService.getPaginationColumnOptions(options)
  }

  protected getPaginationCustomColumnOptions(options: PaginationCustomColumnOptions): PaginationOrderColumnOptions {
    const paginationService = Container.get(PaginationServiceToken)
    return paginationService.getPaginationCustomColumnOptions(options)
  }

}