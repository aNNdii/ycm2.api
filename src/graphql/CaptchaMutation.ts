import Container from "../infrastructures/Container";

import { CaptchaServiceToken } from "../services/CaptchaService";

import { IGraphQLContext } from "../entities/GraphQLContext";

import GraphQLCaptcha from "./Captcha";


const GraphQLCaptchaMutation = {
  createCaptcha: {
    type: GraphQLCaptcha,
    resolve: (_: any, args: any, context: IGraphQLContext) => {
      const captchaService = Container.get(CaptchaServiceToken)
      return captchaService.createCaptcha()
    }
  }
}

export default GraphQLCaptchaMutation