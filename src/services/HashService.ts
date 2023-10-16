import { BinaryToTextEncoding, createHash } from "crypto";

import { Token } from "../infrastructures/Container";

import { Service, IService, ServiceOptions } from "./Service";

export const HashServiceToken = new Token<IHashService>("HashService")

export type HashServiceSha1Options = {
  encoding?: BinaryToTextEncoding
}

export type IHashService = IService & {
  hashObject(object: any): string
  sha1(value: string, options?: any): Buffer | string
  mysql41Password(value: string): string
}

export type HashServiceOptions = ServiceOptions & {}

export class HashService extends Service<any> implements IHashService {

  hashObject(value: any) {
    return JSON.stringify(value)
  }

  sha1(value: string, options?: HashServiceSha1Options) {
    const { encoding } = options || {}

    // @ts-ignore
    return createHash('sha1').update(value).digest(encoding)
  }

  mysql41Password(value: string) {
    const buffer = this.sha1(value)
    const hex = this.sha1(buffer, { encoding: 'hex' })

    return `*${hex.toUpperCase()}`
  }

}