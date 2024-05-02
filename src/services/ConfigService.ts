import { Service } from 'typedi'
import dotenv from 'dotenv'

export interface BaseConfig {
  port: number
  env: string
}

type ConfigKeys<T extends object> = keyof (T & BaseConfig);

@Service()
export class ConfigService<T extends { [key: string]: unknown }> {
  private config: T & BaseConfig
  constructor() {
    dotenv.config()
    this.config = {
      port: parseInt(process.env.PORT || '3000'),
      env: process.env.NODE_ENV || 'development',
    } as T & BaseConfig
  }

  get<K extends ConfigKeys<T>>(key: K): (T & BaseConfig)[K] {
    return this.config[key]
  }

  set<K extends ConfigKeys<T>>(key: K, value: (T & BaseConfig)[K]): void {
    this.config[key] = value
  }

  merge(config: Partial<T>): void {
    this.config = { ...this.config, ...config } as T & BaseConfig
  }

  isProduction(): boolean {
    return this.config.env === 'production'
  }
}
