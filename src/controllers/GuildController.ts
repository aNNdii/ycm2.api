import Container, { Token } from "../infrastructures/Container";

import { HttpStatusCode } from "../interfaces/HttpStatusCode";
import { ErrorMessage } from "../interfaces/ErrorMessage";
import { EntityFilterMethod } from "../interfaces/Entity";

import { PaginationOptions } from "../services/PaginationService";
import { GuildServiceToken } from "../services/GuildService";

import { IHttpRouterContext } from "../entities/HttpRouterContext";
import HttpRouterError from "../entities/HttpRouterError";

import { IGuildMessage } from "../entities/GuildMessage";
import { IGuild } from "../entities/Guild";

import Controller, { IController } from "./Controller";

export const GuildControllerToken = new Token<IGuildController>("GuildController")

export type GuildOptions = PaginationOptions & {
  id: number[]
}

export type GuildMessageOptions = PaginationOptions & {
  guildId: number[]
}

export type IGuildController = IController & {
  getGuilds(options: GuildOptions, context: IHttpRouterContext): Promise<IGuild[]>
  getGuildById(id: number, context: IHttpRouterContext): Promise<IGuild>
  getGuildByHashId(hashId: string, context: IHttpRouterContext): Promise<IGuild>

  getGuildMessages(options: GuildMessageOptions, context: IHttpRouterContext): Promise<IGuildMessage[]>
}

export default class GuildController extends Controller implements IGuildController {

  getGuilds(options: GuildOptions, context: IHttpRouterContext) {
    this.log("getGuilds", options)

    const { id } = options

    const guildService = Container.get(GuildServiceToken)
    const paginationOptions = guildService.getGuildPaginationOptions(options)

    return context.dataLoaderService.getGuilds({
      ...paginationOptions,
      id: id ? [EntityFilterMethod.IN, id] : undefined
    })
  }

  async getGuildById(id: number, context: IHttpRouterContext) {
    this.log("getGuildById", { id })

    const [guild] = await context.dataLoaderService.getGuildsById(id)
    if (!guild) throw new HttpRouterError(HttpStatusCode.NOT_FOUND, ErrorMessage.GUILD_NOT_FOUND)

    return guild
  }

  async getGuildByHashId(hashId: string, context: IHttpRouterContext) {
    this.log("getGuildByHashId", { hashId })

    const guildService = Container.get(GuildServiceToken)
    const [id] = guildService.deobfuscateGuildId(hashId)

    return this.getGuildById(id, context)
  }


  getGuildMessages(options: GuildMessageOptions, context: IHttpRouterContext) {
    this.log("getGuildMessages", options)

    const { guildId } = options

    const guildService = Container.get(GuildServiceToken)
    const paginationOptions = guildService.getGuildMessagePaginationOptions(options)

    return context.dataLoaderService.getGuildMessages({
      ...paginationOptions,
      guildId: guildId ? [EntityFilterMethod.IN, guildId] : undefined
    })
  }

}