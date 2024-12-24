import { ecs } from "db://oops-framework/libs/ecs/ECS";

/** 数据层对象 */
@ecs.register('Board')
export class BoardModelComp extends ecs.Comp {

    /** 数据层组件移除时，重置所有数据为默认值 */
    reset() {
        
    }
}