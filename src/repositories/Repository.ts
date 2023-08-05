import Logger from "../infrastructures/Logger"

export type IRepository = {}

export type RepositoryOptions = {}

export default class Repository<T = RepositoryOptions> extends Logger implements IRepository {

  constructor(protected options?: T) {
    super()
  }

}