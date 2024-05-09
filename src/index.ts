import 'reflect-metadata'
import Koa from 'koa'
import type Router from 'koa-router'
import { applyRoutes } from './core/Router'

export type Task = (() => Promise<void>)

export class Application<T> {
  private koa: Koa
  private router: Router
  private tasks: Task[] = []

  constructor(koa: Koa, router: Router) {
    this.koa = koa
    this.router = router
    applyRoutes(this.router)
    this.koa.use(router.routes())
    this.koa.use(router.allowedMethods())
  }

  public beforeServerInit(tasks?: Task[]): Application<T> {
    if (!tasks) {
      return this
    }
    for (const task of tasks) {
      this.tasks.push(task)
    }
    return this
  }

  public onServerClose(tasks: Task[]): Application<T> {
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
      this.koa.listen({ port })
    } catch (err) {
      console.error(err)
      process.exit(1)
    }
  }
}

export * from './decorators/Controller'
