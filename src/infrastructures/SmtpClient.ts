import { Transporter, SendMailOptions } from "nodemailer"

import { Token } from "./Container"
import Logger from "./Logger"

export const SmtpClientToken = new Token<ISmtpClient>("SmtpClient")

export type SmtpClientSendOptions = SendMailOptions & {}

export type ISmtpClient = {
  send(options: SmtpClientSendOptions): Promise<any>
}

export type SmtpClientOptions = {
  transporter: Transporter
}

export default class SmtpClient extends Logger implements ISmtpClient {

  private transporter: Transporter

  constructor(options: SmtpClientOptions) {
    super()
    
    const { transporter } = options
    this.transporter = transporter
  }

  send(options: SmtpClientSendOptions) {
    this.log("send", options)
    return this.transporter.sendMail(options)
  }

}