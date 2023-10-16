import { GraphQLError } from "graphql";

import { HttpStatusCode } from "../interfaces/HttpStatusCode";
import { ErrorMessage } from "../interfaces/ErrorMessage";

export class HttpRouterError extends GraphQLError {

  readonly code: HttpStatusCode | number = HttpStatusCode.INTERNAL_SERVER_ERROR

  constructor(code: HttpStatusCode | number, message?: ErrorMessage | string) {
    code = code || HttpStatusCode.INTERNAL_SERVER_ERROR
    message = message || HttpStatusCode[code]?.toLowerCase() || HttpStatusCode[HttpStatusCode.INTERNAL_SERVER_ERROR].toLowerCase()

    super(message, { extensions: { code } })
    this.code = code
  }

}
