import { Middleware } from 'koa'

interface Params {
  index: number
  type: string
  name: string
  controller: string
  propertyKey: string
}

interface RouteDefinition {
  method: string
  path: string
  handler: Function
  controller: string
  propertyKey: string
  middlewares: Middleware[]
}

class MetadataStorage {
  private static _instance: MetadataStorage
  public routes: RouteDefinition[]
  public prefixes: Map<string, string>
  private params: Params[]

  private constructor() {
    this.routes = []
    this.prefixes = new Map()
    this.params = []
  }

  static get instance(): MetadataStorage {
    if (!this._instance) {
      this._instance = new MetadataStorage()
    }
    return this._instance
  }

  addRoute(
    method: string,
    path: string,
    propertyKey: string,
    handler: Function,
    controller: string
  ) {
    this.routes.push({ method, path, handler, propertyKey, controller, middlewares: [] })
  }

  addParam(
    controller: string,
    propertyKey: string,
    paramName: string,
    type: string,
    index: number
  ): void {
    this.params.push({ controller, propertyKey, index, type, name: paramName })
  }

  getParamsForControllerAndAction(controller: string, propertyKey: string): Params[] {
    return this.params.filter(
      (param) => param.controller === controller && param.propertyKey === propertyKey
    )
  }

  addMiddlewares(controllerName: string, methodName: string, middlewares: Middleware[]) {
    const route = this.routes.find(
      (route) => route.controller === controllerName && route.handler.name === methodName
    )
    if (route) {
      route.middlewares = route.middlewares.concat(middlewares)
    }
  }

  addPrefix(controllerName: string, prefix: string) {
    this.prefixes.set(controllerName, prefix)
  }
}

export default MetadataStorage
