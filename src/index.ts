import 'reflect-metadata'
import Fastify, { FastifyInstance } from 'fastify'
import { Router } from './core/Router'
import { BaseConfig, ConfigService } from './services/ConfigService'
import Container from 'typedi'
import { Constructable, Task } from './utils/types'


export class Application<T> {
  private fastify: FastifyInstance
  private configService: ConfigService<any>
  private tasks: Task[] = []

  constructor() {
    this.fastify = Fastify({ logger: true })
    this.configService = Container.get(ConfigService)
  }

  public withControllers(controllers: Array<Constructable>): Application<T> {
    controllers.forEach((controller) => {
      Router.registerRoutes(this.fastify, controller)
    })

    return this
  }

  public withTasks(tasks?: Task[]): Application<T> {
    if (!tasks) {
      return this
    }
    for (const task of tasks) {
      this.tasks.push(task)
    }
    return this
  }

  public withConfig<T extends BaseConfig>(config: T): Application<T> {
    this.configService.merge(config)
    return this
  }

  public withShutdownTasks(tasks: Task[]): Application<T> {
    if (!tasks) {
      return this
    }
    const shutdown = async () => {
      for (const task of tasks) {
        await task()
      }
    }

    process.on('SIGINT', async () => {
      await shutdown()
      process.exit(0)
    })

    process.on('SIGTERM', async () => {
      await shutdown()
      process.exit(0)
    })

    return this
  }

  public async start(port: number = 3000): Promise<void> {
    try {
      await Promise.all(this.tasks.map((task) => task()))
      await this.fastify.listen({ port })
    } catch (err) {
      this.fastify.log.error(err)
      process.exit(1)
    }
  }
}

export * from './decorators/Controller'
export { Service } from 'typedi'
