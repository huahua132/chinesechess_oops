import { ecs } from "db://oops-framework/libs/ecs/ECS";

/** 数据层对象 */
@ecs.register('MatchModel')
export class MatchModelComp extends ecs.Comp {
    id: number = -1;

    /** 数据层组件移除时，重置所有数据为默认值 */
    reset() {
        this.id = -1;
    }
}