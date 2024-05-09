import { Context } from 'koa'
import { Controller, Get, Post, Body, Param, Query, Ctx } from '../../src'

@Controller()
export class HelloWorldController {
  @Get('/')
  async helloWorld(@Query('name') name: string) {
    return {
      hello: `world: ${name}`
    }
  }

  @Post('/hello/:id')
  async helloWorldPost(@Body('name') name: string, @Param('id') id: string, @Ctx() ctx: Context) {
    ctx.body = { hello: name, id }
  }
}
