import { Environment } from "nunjucks"
import mjml2html from "mjml"

import { InternationalizationClientToken, InternationalizationClientTranslateOptions } from "./InternationalizationClient"
import { Container, Token } from "./Container"
import { Logger } from "./Logger"

export const TemplateEngineToken = new Token<ITemplateEngine>("TemplateEngine")

export type TemplateEngineData = {
  localeCode?: string
  [key: string]: any
}

export type TemplateEngineOptions = {
  templatePath: string
  nunjucks: Environment
}

export type ITemplateEngine = {
  render(template: string, data?: TemplateEngineData): Promise<string>
  renderFile(filename: string, data?: TemplateEngineData): Promise<string>

  renderMjmlFile(filename: string, data?: TemplateEngineData): Promise<string>
}

export class TemplateEngine extends Logger implements ITemplateEngine {

  private nunjucks: Environment

  constructor(private options: TemplateEngineOptions) {
    super()
    this.nunjucks = options.nunjucks
  }

  async render(template: string, data?: object) {
    this.log("render", { template, data })

    return new Promise<string>((resolve, reject) => {
      this.nunjucks.renderString(
        template,
        {
          ...this.getDefaultTemplateData(data),
          ...data
        }, 
        (err, data) =>  err ? reject(err) : resolve(data || '')
      )
    })
  }
  
  async renderFile(filename: string, data?: object) {
    this.log("renderFile", { filename, data })

    return new Promise<string>((resolve, reject) => {
      this.nunjucks.render(
        `${this.options.templatePath}/${filename}`, 
        {
          ...this.getDefaultTemplateData(data),
          ...data
        },
        (err, data) => err ? reject(err) : resolve(data || '')
      )
    })
  }

  async renderMjmlFile(filename: string, data?: object) {
    this.log("renderMjmlFile", { filename, data })

    const content = await this.renderFile(filename, data)
    const { html } = mjml2html(content)

    return html
  }

  private getDefaultTemplateData(data?: TemplateEngineData) {
    const { localeCode } = data || {}

    const i18nClient = Container.get(InternationalizationClientToken)

    const t = (key: string, data: InternationalizationClientTranslateOptions) => i18nClient.translate(key, { localeCode, ...data }) 

    return { t }
  }

}