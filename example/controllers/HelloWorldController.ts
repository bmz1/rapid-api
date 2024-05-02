import { FastifyReply, FastifyRequest } from 'fastify'
import { Controller, Get, Post, Service } from '../../src'
import { ConfigService } from '../../src/services/ConfigService'
import { Config } from '..'

@Service()
@Controller()
export class HelloWorldController {
  constructor(private configService: ConfigService<Config>) {}

  @Get('/')
  async helloWorld(request: FastifyRequest, reply: FastifyReply) {
    console.log({ secret: this.configService.get('secret') })
    reply.send({
      hello: 'world',
      port: this.configService.get('port'),
      secret: this.configService.get('secret')
    })
  }

  @Post('/hello')
  async helloWorldPost(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as { name: string }
    reply.send({ hello: body?.name })
  }
}
