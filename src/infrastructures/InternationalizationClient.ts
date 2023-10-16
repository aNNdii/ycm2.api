import { i18n } from "i18next"

import { Token } from "./Container"
import { Logger } from "./Logger"

export const InternationalizationClientToken = new Token<IInternationalizationClient>("InternationalizationClient")

export type InternationalizationClientTranslateOptions = {
  localeCode?: string
  [key: string]: any
}

export type InternationalizationClientOptions = {
  i18n: i18n
}

export type IInternationalizationClient = {
  translate(key: string, options: InternationalizationClientTranslateOptions): string
}

export class InternationalizationClient extends Logger implements IInternationalizationClient {

  private i18n: i18n

  constructor(private options: InternationalizationClientOptions) {
    super()

    const { i18n } = options
    this.i18n = i18n
  }

  translate(key: string, options: InternationalizationClientTranslateOptions) {
    const { localeCode, ...values } = options || {}

    this.log("translate", { key, localeCode, values })

    return this.i18n.t(key, {
      lng: localeCode,
      ...values
    })
  }



}