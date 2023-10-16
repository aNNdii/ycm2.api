import debug, { Debugger } from "debug"

export type ILogger = {
  log(data: any): void
}

export class Logger implements ILogger {

  protected logger: Debugger

  constructor(namespace?: string) {
    namespace = namespace || this.constructor.name
    this.logger = debug(`YCM2:${namespace}`)
  }

  log(event: string, data?: any) {
    this.logger("%o", {
      event,
      ...data,
      timestamp: new Date().toISOString(),
    })
  }

}