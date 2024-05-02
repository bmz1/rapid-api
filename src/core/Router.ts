import Container from 'typedi'
import { PREFIX, ROUTE } from '../utils/constants'
import { FastifyInstance } from 'fastify'
import { Class, Constructable } from '../utils/types'

export class Router {
  static registerRoutes<T>(fastify: FastifyInstance, controller: Constructable<T>): void {
    const instance = Container.get(controller)
    const prefix = Reflect.getMetadata(PREFIX, controller)
    if (prefix === undefined) {
      throw new Error('No prefix defined for controller')
    }

    const prototype = Object.getPrototypeOf(instance)
    const methods = Object.getOwnPropertyNames(prototype).filter((methodName) => {
      if (methodName !== 'constructor' && typeof prototype[methodName] === 'function') {
        return Reflect.hasMetadata(ROUTE, prototype, methodName)
      }
      return false
    })

    methods.forEach((methodName: string) => {
      const metadata = Reflect.getMetadata(ROUTE, prototype, methodName)
      if (metadata) {
        if (metadata) {
          const { method, path } = metadata
          const fullPath = `${prefix}${path}`
          // @ts-expect-error todo fix
          fastify[method.toLowerCase()](fullPath, (request, reply) => {
            // @ts-ignore
            instance[methodName as keyof T](request, reply)
          })
        }
      }
    })
  }
}
