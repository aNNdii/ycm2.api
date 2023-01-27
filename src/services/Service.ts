import Logger from "../infrastructures/Logger"

export type IService = {}

export type ServiceOptions = {}

export default class Service<T = ServiceOptions> extends Logger implements IService {

  constructor(protected options: T) {
    super()
  }

}