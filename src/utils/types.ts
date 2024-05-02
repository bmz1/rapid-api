
export type Task = (() => Promise<void>)
export type Constructable<T = any> = new (...args: any[]) => T;
export type Class<T = any> = InstanceType<Constructable<T>>;
