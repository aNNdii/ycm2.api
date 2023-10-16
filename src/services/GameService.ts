import { Token } from "../infrastructures/Container";

import { Service, IService, ServiceOptions } from "./Service";

export const GameServiceToken = new Token<IGameService>("GameServiceToken")

export type GameServiceOptions = ServiceOptions & {}

export type IGameService = IService & {}

export class GameService extends Service<GameServiceOptions> implements IGameService {}