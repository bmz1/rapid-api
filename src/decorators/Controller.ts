import { PREFIX, ROUTE } from '../utils/constants'

export function Controller(prefix: string = ''): ClassDecorator {
  return function (constructor: Function) {
    Reflect.defineMetadata(PREFIX, prefix, constructor)
  }
}

function Route(method: string, path: string): MethodDecorator {
  return function (target: any, propertyKey: string | symbol) {
    Reflect.defineMetadata(ROUTE, { method, path }, target, propertyKey)
  }
}

export function Get(path: string) {
  return Route('GET', path)
}

export function Post(path: string) {
  return Route('POST', path)
}

export function Put(path: string) {
  return Route('PUT', path)
}

export function Delete(path: string) {
  return Route('DELETE', path)
}

export function Head(path: string) {
  return Route('HEAD', path)
}

export function Patch(path: string) {
  return Route('PATCH', path)
}

export function Options(path: string) {
  return Route('OPTIONS', path)
}
