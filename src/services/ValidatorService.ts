import { z } from "zod";

import { Token } from "../infrastructures/Container";

import { ErrorMessage } from "../interfaces/ErrorMessage";
import { HttpStatusCode } from "../interfaces/HttpStatusCode";

import { HttpRouterError }  from "../entities/HttpRouterError";

import { Service, ServiceOptions } from "./Service";

export const ValidatorServiceToken = new Token<IValidatorService>("Validator")

export type ValidateOptions = {
  code?: HttpStatusCode
  message?: ErrorMessage
}

export type ValidateStringOptions = ValidateOptions & {
  minLength?: number
  maxLength?: number
  pattern?: RegExp
}

export type ValidatorServiceOptions = ServiceOptions & {
}

export type IValidatorService = {
  isString(value: unknown, options?: ValidateStringOptions): void
  isEmail(value: unknown, options?: ValidateOptions): void
}

export class ValidatorService extends Service<ValidatorServiceOptions> implements IValidatorService {

  constructor(options: ValidatorServiceOptions) {
    super(options)
  }

  isString(value: unknown, options?: ValidateStringOptions) {
    const {
      code = HttpStatusCode.BAD_REQUEST,
      message = ErrorMessage.REQUEST_PARAMETERS_INVALID,

      minLength,
      maxLength,

      pattern
    } = options || {}

    let validator = z.string()

    if (minLength) validator = validator.min(minLength)
    if (maxLength) validator = validator.max(maxLength)
    if (pattern) validator = validator.regex(pattern)

    const { success } = validator.safeParse(value)
    if (!success) throw new HttpRouterError(code, message)
  }

  isEmail(value: unknown, options?: ValidateOptions) {
    const {
      code = HttpStatusCode.BAD_REQUEST,
      message = ErrorMessage.EMAIL_PARAMETER_INVALID,
    } = options || {}

    let validator = z.string().email()

    const { success } = validator.safeParse(value)
    if (!success) throw new HttpRouterError(code, message)
  }


}