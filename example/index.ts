import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import Router from 'koa-router'
import { Application } from '../src'
import './controllers/HelloWorldController'

const koa = new Koa()
const router = new Router()
koa.use(bodyParser())

const app = new Application(koa, router)
  .beforeServerInit([
    async () => {
      console.log('Task 1')
      await new Promise((resolve) => setTimeout(resolve, 1000))
    },
    async () => {
      console.log('Task 2')
    }
  ])
  .onServerClose([
    async () => {
      console.log('Shutdown Task 1')
    },
    async () => {
      console.log('Shutdown Task 2')
    }
  ])

app.start(3000)
