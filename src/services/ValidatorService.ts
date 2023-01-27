import Ajv, { JSONSchemaType, Schema } from "ajv"

import { ErrorMessage } from "../interfaces/ErrorMessage";
import Container, { Token } from "../infrastructures/Container";
import { HttpStatusCode } from "../interfaces/HttpStatusCode";

import HttpRouterError from "../entities/HttpRouterError";

import { HashServiceToken } from "./HashService";
import Service, { ServiceOptions } from "./Service";

export const ValidatorServiceToken = new Token<IValidatorService>("Validator")

export type ValidateOptions = {
  code?: HttpStatusCode
  message?: ErrorMessage
}

export type ValidatorServiceOptions = ServiceOptions & {
  ajv: Ajv
}

export type IValidatorService = {
  validate<T extends any>(data: any, schema: Schema | JSONSchemaType<T>, options?: ValidateOptions): void
}

export default class ValidatorService extends Service<ValidatorServiceOptions> implements IValidatorService {

  private ajv: Ajv
  private validators: any

  constructor(options: ValidatorServiceOptions) {
    super(options)

    this.ajv = options.ajv
    this.validators = {}
  }

  validate<T extends any>(data: any, schema: Schema | JSONSchemaType<T>, options?: ValidateOptions) {
    const {
      code = HttpStatusCode.BAD_REQUEST,
      message = ErrorMessage.INVALID_REQUEST_PARAMETERS
    } = options || {}

    const validate = this.getSchema<T>(schema)

    if (!validate(data)) throw new HttpRouterError(code, message)
  }
  
  private getSchema<T extends any>(schema: Schema | JSONSchemaType<T>) {
    const hashService = Container.get(HashServiceToken)
    
    const hash = hashService.hashObject(schema)
    this.validators[hash] = this.validators[hash] || this.ajv.compile<T>(schema)

    return this.validators[hash]
  }

}