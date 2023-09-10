import { InternationalizationClientToken } from "../infrastructures/InternationalizationClient";
import { SmtpClientSendOptions, SmtpClientToken } from "../infrastructures/SmtpClient";
import { TemplateEngineToken } from "../infrastructures/TemplateEngine";
import Container, { Token } from "../infrastructures/Container";

import Service, { IService, ServiceOptions } from "./Service";

export const MailServiceToken = new Token<IMailService>("MailService")

export type SendOptions = SmtpClientSendOptions & {
  templateTextFilename?: string
  templateHtmlFilename?: string
  templateData?: any
}

export type SendAuthenticationSecretOptions = SmtpClientSendOptions & {
  secret: string | number
  localeCode?: string
}

export type SendAuthenticationVerificationOptions = SmtpClientSendOptions & {
  token: string
  localeCode?: string
}

export type SendAuthenticationWelcomeOptions = SmtpClientSendOptions & {
  localeCode?: string
}

export type MailServiceOptions = ServiceOptions & {
  companyName: string
  companyLogo: string
  companyAddress: string
  httpClientHost: string
  from: string
}

export type IMailService = IService & {
  send(options: SendOptions): Promise<any>
}

export default class MailService extends Service<MailServiceOptions> implements IMailService {

  async send(options: SendOptions) {
    const {
      from = this.options.from,

      templateTextFilename = "emails/template.txt",
      templateHtmlFilename = "emails/template.html",
      templateData = {},
    } = options

    const templateEngine = Container.get(TemplateEngineToken)
    const smtpClient = Container.get(SmtpClientToken)

    const currentYear = new Date().getFullYear()

    const textContentPromise = templateEngine.renderFile(templateTextFilename, {
      currentYear: currentYear,
      companyName: this.options.companyName,
      ...templateData
    })
    
    const htmlContentPromise = templateEngine.renderFile(templateHtmlFilename, {
      currentYear: currentYear,
      companyName: this.options.companyName,
      companyLogo: this.options.companyLogo,
      ...templateData
    })

    const textContent = await textContentPromise
    const htmlContent = await htmlContentPromise

    return smtpClient.send({
      ...options,
      text: textContent,
      html: htmlContent,
      from,
    })
  }

}