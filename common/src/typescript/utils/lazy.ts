export class Lazy<T> {
    private _value: T | undefined = undefined;
    private _isValueSet: boolean = false;

    public constructor(private factory: { (): T; }) { }

    public get value() {
        if (!this._isValueSet) {
            this._value = this.factory();
            this._isValueSet = true;
        }
        return this._value as T;
    }

    public get isValueSet() {
        return this._isValueSet;
    }
}