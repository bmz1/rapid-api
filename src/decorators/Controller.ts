import MetadataStorage from '../core/MetadataStorage'

export function Controller(prefix: string = ''): ClassDecorator {
  return function (constructor: Function) {
    MetadataStorage.instance.addPrefix(constructor.name, prefix)
  }
}

export function Route(method: string, path: string): MethodDecorator {
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    MetadataStorage.instance.addRoute(
      method.toLowerCase(),
      path,
      propertyKey as string,
      descriptor.value,
      target.constructor.name
    )
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

export function Ctx(): ParameterDecorator {
  return function (target, propertyKey, parameterIndex) {
    MetadataStorage.instance.addParam(
      target.constructor.name,
      propertyKey as string,
      '',
      'ctx',
      parameterIndex
    )
  }
}

export function Param(paramName: string = ''): ParameterDecorator {
  return function (target, propertyKey, parameterIndex) {
    MetadataStorage.instance.addParam(
      target.constructor.name,
      propertyKey as string,
      paramName,
      'param',
      parameterIndex
    )
  }
}

export function Query(paramName: string = ''): ParameterDecorator {
  return function (target: Object, propertyKey, parameterIndex: number) {
    MetadataStorage.instance.addParam(
      target.constructor.name,
      propertyKey as string,
      paramName,
      'query',
      parameterIndex
    )
  }
}

export function Body(property: string = ''): ParameterDecorator {
  return function (target, propertyKey, parameterIndex) {

    MetadataStorage.instance.addParam(
      target.constructor.name,
      propertyKey as string,
      property,
      'body',
      parameterIndex
    )
  }
}
