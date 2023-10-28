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

export type SendAccountMailChangeOptions = SendOptions & {
  username: string
  token: string
  ttl: number
}

export type SendAccountSafeBoxCodeRecoveryOptions = SendOptions & {
  username: string
  safeBoxCode: string
}

export type SendAccountDeleteCodeRecoveryOptions = SendOptions & {
  username: string
  deleteCode: string
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
  sendAccountMailChange(options: SendAccountMailChangeOptions): Promise<any>
  sendAccountSafeBoxCodeRecovery(options: SendAccountSafeBoxCodeRecoveryOptions): Promise<any>
  sendAccountDeleteCodeRecovery(options: SendAccountDeleteCodeRecoveryOptions): Promise<any>
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

    this.log("sendAccountUsernameRecovery", options)

    const i18nClient = Container.get(InternationalizationClientToken)
  
    const templateMjmlFilename = 'emails/account-username-recovery.mjml'
    const templateTextFilename = 'emails/account-username-recovery.txt'
    const templateData = { username, localeCode }

    return this.send({
      ...sendOptions,
      subject: i18nClient.translate('LabelAccountUsernameRecovery', { username, localeCode }),
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

    this.log("sendAccountPasswordRecovery", options)

    const i18nClient = Container.get(InternationalizationClientToken)
  
    const templateMjmlFilename = 'emails/account-password-recovery.mjml'
    const templateTextFilename = 'emails/account-password-recovery.txt'

    const url = `${this.options.serverUrl}/forgot-password/${token}`
    const duration = Math.ceil(ttl / 3600)

    const templateData = { url, duration, username, localeCode }

    return this.send({
      ...sendOptions,
      subject: i18nClient.translate('LabelAccountPasswordRecovery', { localeCode }),
      templateMjmlFilename,
      templateTextFilename,
      templateData
    })
  }

  async sendAccountMailChange(options: SendAccountMailChangeOptions) {
    const { 
      token,
      ttl, 
      username,
      localeCode, 
      ...sendOptions
    } = options

    this.log("sendAccountMailChange", options)

    const i18nClient = Container.get(InternationalizationClientToken)
  
    const templateMjmlFilename = 'emails/account-mail-change.mjml'
    const templateTextFilename = 'emails/account-mail-change.txt'

    const url = `${this.options.serverUrl}/confirm-mail/${token}`
    const duration = Math.ceil(ttl / 3600)

    const templateData = { url, duration, username, localeCode }

    return this.send({
      ...sendOptions,
      subject: i18nClient.translate('LabelAccountMailChange', { localeCode }),
      templateMjmlFilename,
      templateTextFilename,
      templateData
    })
  }

  async sendAccountSafeBoxCodeRecovery(options: SendAccountSafeBoxCodeRecoveryOptions) {
    const { 
      safeBoxCode,
      username,
      localeCode, 
      ...sendOptions
    } = options

    this.log("sendAccountSafeBoxCodeRecovery", options)

    const i18nClient = Container.get(InternationalizationClientToken)
  
    const templateMjmlFilename = 'emails/account-safebox-code-recovery.mjml'
    const templateTextFilename = 'emails/account-safebox-code-recovery.txt'

    const templateData = { safeBoxCode, username, localeCode }

    return this.send({
      ...sendOptions,
      subject: i18nClient.translate('LabelAccountSafeBoxCodeRecovery', { localeCode }),
      templateMjmlFilename,
      templateTextFilename,
      templateData
    })
  }

  async sendAccountDeleteCodeRecovery(options: SendAccountDeleteCodeRecoveryOptions) {
    const { 
      deleteCode,
      username,
      localeCode, 
      ...sendOptions
    } = options

    this.log("sendAccountDeleteCodeRecovery", options)

    const i18nClient = Container.get(InternationalizationClientToken)
  
    const templateMjmlFilename = 'emails/account-delete-code-recovery.mjml'
    const templateTextFilename = 'emails/account-delete-code-recovery.txt'

    const templateData = { deleteCode, username, localeCode }

    return this.send({
      ...sendOptions,
      subject: i18nClient.translate('LabelAccountDeleteCodeRecovery', { localeCode }),
      templateMjmlFilename,
      templateTextFilename,
      templateData
    })
  }

}