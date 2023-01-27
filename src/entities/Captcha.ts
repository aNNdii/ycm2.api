import Container from "../infrastructures/Container";

import { CaptchaServiceToken } from "../services/CaptchaService";

import Entity, { IEntity } from "./Entity";

export type CaptchaProperties = {
  value: any
}

export type ICaptcha = IEntity & {
  value: any
}

export default class Captcha extends Entity<CaptchaProperties> implements ICaptcha {

  get value() {
    return this.getProperty("value")
  }

}