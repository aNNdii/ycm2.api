import hashids from "hashids/cjs/hashids";

import Container, { Token } from "../infrastructures/Container";

import { HashServiceToken } from "./HashService";
import Service, { IService, ServiceOptions } from "./Service";

export const ObfuscationServiceToken = new Token<IObfuscationService>("ObfuscationService")

export type ObfuscationOptions = {
  salt?: string
  alphabet?: string
  minLength?: number
}

export type ObfuscationServiceOptions = ServiceOptions & ObfuscationOptions & {
  obfuscation?: boolean
}

export type IObfuscationService = IService & {
  obfuscate(value: any, options?: ObfuscationOptions): string
  deobfuscate(value: string | string[], options?: ObfuscationOptions): any[]
}

export default class ObfuscationService extends Service<ObfuscationServiceOptions> implements IObfuscationService {

  private readonly hashIds: { [key: string]: hashids } = {}

  private createHashId(options?: ObfuscationOptions) {
    const hashService = Container.get(HashServiceToken)

    const hash = hashService.hashObject(options)
    const { salt, minLength, alphabet } = options || {}

    this.hashIds[hash] = this.hashIds[hash] || new hashids(salt || this.options.salt, minLength || this.options.minLength, alphabet || this.options.alphabet)
    return this.hashIds[hash]
  }

  obfuscate(value: any, options?: ObfuscationOptions): string {
    if (!this.options.obfuscation) return value?.toString()

    return this.createHashId(options).encode(value)
  }

  deobfuscate(value: string | string[], options?: ObfuscationOptions): any[] {
    if (!this.options.obfuscation) return [value].flat().map(v => parseInt(v))
    
    const hashId = this.createHashId(options)
    return [value].flat().map(v => hashId.decode(v)).flat()  
  }


}