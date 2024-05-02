import { Application } from '../src'
import { HelloWorldController } from './controllers/HelloWorldController'

const app = new Application()
  .withControllers([HelloWorldController])
  .withTasks([
    async () => {
      console.log('Task 1')
      await new Promise((resolve) => setTimeout(resolve, 1000))
    },
    async () => {
      console.log('Task 2')
    }
  ])
  .withShutdownTasks([
    async () => {
      console.log('Shutdown Task 1')
    },
    async () => {
      console.log('Shutdown Task 2')
    }
  ])

app.start(3000)
