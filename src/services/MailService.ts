import { InternationalizationClientToken } from "../infrastructures/InternationalizationClient";
import { SmtpClientSendOptions, SmtpClientToken } from "../infrastructures/SmtpClient";
import { TemplateEngineToken } from "../infrastructures/TemplateEngine";
import { Container, Token } from "../infrastructures/Container";

import { Service, IService, ServiceOptions } from "./Service";

export const MailServiceToken = new Token<IMailService>("MailService")

export type SendOptions = SmtpClientSendOptions & {
  templateTextFilename?: string
  templateMjmlFilename?: string
  templateData?: any

  localeCode?: string
}

export type SendAccountUsernameRecoveryOptions = SendOptions & {
  username: string
}

export type SendAccountPasswordRecoveryOptions = SendOptions & {
  username: string
  token: string
  ttl: number
}

export type MailServiceOptions = ServiceOptions & {
  from: string
  serverUrl: string
  serverName: string
  serverLogoUrl: string
}

export type IMailService = IService & {
  send(options: SendOptions): Promise<any>

  sendAccountUsernameRecovery(options: SendAccountUsernameRecoveryOptions): Promise<any>
  sendAccountPasswordRecovery(options: SendAccountPasswordRecoveryOptions): Promise<any>
}

export class MailService extends Service<MailServiceOptions> implements IMailService {

  async send(options: SendOptions) {
    const {
      from = this.options.from,

      templateMjmlFilename = "emails/template.mjml",
      templateTextFilename = "emails/template.txt",
      templateData = {},
    } = options

    this.log("send", { from, templateMjmlFilename, templateTextFilename, templateData })

    const templateEngine = Container.get(TemplateEngineToken)
    const smtpClient = Container.get(SmtpClientToken)

    const currentYear = new Date().getFullYear()

    const textContentPromise = templateEngine.renderFile(templateTextFilename, {
      currentYear: currentYear,
      serverName: this.options.serverName,
      ...templateData
    })
    
    const htmlContentPromise = templateEngine.renderMjmlFile(templateMjmlFilename, {
      currentYear: currentYear,
      serverName: this.options.serverName,
      serverLogoUrl: this.options.serverLogoUrl,
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

  async sendAccountUsernameRecovery(options: SendAccountUsernameRecoveryOptions) {
    const { 
      username,
      localeCode,
      ...sendOptions
    } = options

    this.log("sendAccountUsernameRecovery", { username, localeCode })

    const i18nClient = Container.get(InternationalizationClientToken)
  
    const templateMjmlFilename = 'emails/account-username-recovery.mjml'
    const templateTextFilename = 'emails/account-username-recovery.txt'
    const templateData = { username, localeCode }

    return this.send({
      ...sendOptions,
      subject: i18nClient.translate('LabelMailSubjectAccountRequestUsername', { localeCode }),
      templateMjmlFilename,
      templateTextFilename,
      templateData
    })
  }

  async sendAccountPasswordRecovery(options: SendAccountPasswordRecoveryOptions) {
    const { 
      token,
      ttl, 
      username,
      localeCode,
      ...sendOptions
    } = options

    this.log("sendAccountPasswordRecovery", { token, localeCode })

    const i18nClient = Container.get(InternationalizationClientToken)
  
    const templateMjmlFilename = 'emails/account-password-recovery.mjml'
    const templateTextFilename = 'emails/account-password-recovery.txt'

    const url = `${this.options.serverUrl}/forgot-password/${token}`
    const duration = Math.ceil(ttl / 3600)

    const templateData = { url, duration, username, localeCode }

    return this.send({
      ...sendOptions,
      subject: i18nClient.translate('LabelAccountPasswordReset', { localeCode }),
      templateMjmlFilename,
      templateTextFilename,
      templateData
    })
  }

}