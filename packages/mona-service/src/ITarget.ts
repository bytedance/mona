import Builder from "./Builder";
import TargetContext from "./TargetContext";

export interface ITargetCallback {
  (ctx: TargetContext): Promise<void> | void
}

class ITarget {
  name: string;
  targetContext: TargetContext;
  private _fn: ITargetCallback;

  constructor(name: string, fn: ITargetCallback, builder: Builder) {
    this.name = name;
    this._fn = fn;
    this.targetContext = new TargetContext(name, builder)
  }

  runTarget() {
    this._fn.call(this, this.targetContext)
  }
}

export default ITarget;