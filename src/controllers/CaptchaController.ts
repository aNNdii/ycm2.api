import { Container, Token } from "../infrastructures/Container";

import { getEnumValues } from "../helpers/Enum";

import { HttpStatusCode } from "../interfaces/HttpStatusCode";
import { ErrorMessage } from "../interfaces/ErrorMessage";

import { CaptchaServiceToken, CaptchaType } from "../services/CaptchaService";

import { IHttpRouterContext } from "../entities/HttpRouterContext";
import { HttpRouterError } from "../entities/HttpRouterError";

import { Controller, IController } from "./Controller";

export const CaptchaControllerToken = new Token<ICaptchaController>("CaptchaController")

export type ICaptchaController = IController & {}

export class CaptchaController extends Controller implements ICaptchaController {

  init() {
    this.post('/captcha', this.handleCaptchaGetRequest.bind(this))
  }

  async handleCaptchaGetRequest(context: IHttpRouterContext) {
    let { type } = context.body;
    [type] = getEnumValues(CaptchaType, type)

    if (!type) throw new HttpRouterError(HttpStatusCode.BAD_REQUEST, ErrorMessage.CAPTCHA_TYPE_INVALID)

    const captchaService = Container.get(CaptchaServiceToken)

    const value = await captchaService.createCaptchaValue()

    const tokenPromise = captchaService.createCaptchaToken({ type, value })
    const imagePromise = captchaService.createCaptchaImage({ value })

    const token = await tokenPromise
    const image = await imagePromise

    const data = { token, image }

    context.setResponse({ data })
  }

}
