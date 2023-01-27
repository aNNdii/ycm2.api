import { BinaryToTextEncoding, createHash } from "crypto";
import nodeObjectHash from "node-object-hash";

import { Token } from "../infrastructures/Container";
import Service, { IService, ServiceOptions } from "./Service";

export const HashServiceToken = new Token<IHashService>("HashService")

export type HashServiceSha1Options = {
  encoding?: BinaryToTextEncoding
}

export type HashObjectOptions = {
  sort?: boolean
  coerce?: boolean
}

export type IHashService = IService & {
  hashObject(object: any, options?: HashObjectOptions): string
  sha1(value: string, options?: any): Buffer | string
  mysql41Password(value: string): string
}

export type HashServiceOptions = ServiceOptions & {}

export default class HashService extends Service<any> implements IHashService {

  hashObject(value: any, options?: HashObjectOptions) {
    const {
      sort = true,
      coerce = true
    } = options || {}

    return nodeObjectHash({ sort, coerce }).hash(value || {})
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