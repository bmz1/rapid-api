import { Context, Next } from 'koa'
import type Router from 'koa-router'
import MetadataStorage from './MetadataStorage'

export function applyRoutes(router: Router) {
  const { routes, prefixes } = MetadataStorage.instance

  routes.forEach((route) => {
    const fullPath = `${prefixes.get(route.controller) || ''}${route.path}`

    // @ts-ignore
    router[route.method](fullPath, async (ctx: Context, next: Next) => {
      const handlerParams = MetadataStorage.instance.getParamsForControllerAndAction(route.controller, route.propertyKey)
        .sort((a, b) => a.index - b.index)
        .map((param) => {
          switch (param.type) {
            case 'body':
              // @ts-ignore
              if (!param.name) return ctx.request.body[param.name]
              return ctx.request.body
            case 'param':
              if (param.name) return ctx.params[param.name]
              return ctx.params
            case 'state':
              if (param.name) return ctx.state[param.name]
              return ctx.state
            case 'query':
              if (param.name) return ctx.query[param.name]
              return ctx.query
            case 'header':
              return ctx.headers[param.name.toLowerCase()]
            case 'headers':
              return ctx.headers
            case 'ctx':
              return ctx
            default:
              return null
          }
        })

      const result = await route.handler(...handlerParams, ctx, next)
      if (result) {
        ctx.body = result
      }
    })
  })
}
