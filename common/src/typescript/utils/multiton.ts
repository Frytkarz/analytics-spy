export class Multiton<T> {
    private instances: { [id: string]: T } = {};

    public constructor(private initializers: { [id: string]: () => T }) {
    }

    public getInstance(id: string): T {
        let result = this.instances[id];
        if (result === undefined) {
            const initializer = this.initializers[id];
            if (initializer === undefined)
                throw new Error(`Could not find initializer for instance id='${id}'.`);
            result = this.instances[id] = initializer();
        }
        return result;
    }

    public getIds() {
        return Object.keys(this.initializers);
    }

    public forEach(task: (t: T) => boolean) {
        for (const id of this.getIds()) {
            if (task(this.getInstance(id))) {
                break;
            }
        }
    }

    public async forEachAsync(task: (t: T) => Promise<boolean>) {
        for (const id of this.getIds()) {
            const result = await task(this.getInstance(id));
            if (result) {
                break;
            }
        }
    }
}