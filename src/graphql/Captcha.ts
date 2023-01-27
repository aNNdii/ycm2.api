import { GraphQLObjectType, GraphQLString } from "graphql";

import Container from "../infrastructures/Container";

import { CaptchaServiceToken } from "../services/CaptchaService";

import { ICaptcha } from "../entities/Captcha";


const GraphQLCaptcha = new GraphQLObjectType({
  name: 'Captcha',
  fields: () => ({
    token: {
      type: GraphQLString,
      resolve: (captcha: ICaptcha) => {
        const captchaService = Container.get(CaptchaServiceToken)
        return captchaService.createCaptchaToken(captcha.value)
      }
    },
    image: {
      type: GraphQLString,
      resolve: (captcha: ICaptcha) => {
        const captchaService = Container.get(CaptchaServiceToken)
        return captchaService.createCaptchaImage(captcha.value)
      }
    }
  })
})

export default GraphQLCaptcha