import { Environment } from "nunjucks"

import { InternationalizationClientToken } from "./InternationalizationClient"
import Container, { Token } from "./Container"
import Logger from "./Logger"

export const TemplateEngineToken = new Token<ITemplateEngine>("TemplateEngine")

export type TemplateEngineOptions = {
  templatePath: string
  nunjucks: Environment
}

export type ITemplateEngine = {
  render(template: string, data?: object): Promise<string>
  renderFile(filename: string, data?: object): Promise<string>
}

export default class TemplateEngine extends Logger implements ITemplateEngine {

  private nunjucks: Environment

  constructor(private options: TemplateEngineOptions) {
    super()
    this.nunjucks = this.initNunjucks(options.nunjucks)
  }

  async render(template: string, data?: object) {
    this.log("render", { template, data })

    return new Promise<string>((resolve, reject) => {
      this.nunjucks.renderString(
        template,
        data || {}, 
        (err, data) =>  err ? reject(err) : resolve(data || '')
      )
    })
  }
  
  async renderFile(filename: string, data?: object) {
    this.log("renderFile", { filename, data })

    return new Promise<string>((resolve, reject) => {
      this.nunjucks.render(
        `${this.options.templatePath}/${filename}`, 
        data || {}, 
        (err, data) => err ? reject(err) : resolve(data || '')
      )
    })
  }

  private initNunjucks(nunjucks: Environment) {
    const i18nClient = Container.get(InternationalizationClientToken)

    nunjucks = nunjucks.addGlobal('t', i18nClient.translate.bind(i18nClient))

    return nunjucks
  }

}