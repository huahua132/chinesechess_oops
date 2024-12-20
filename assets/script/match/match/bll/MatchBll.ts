import { ecs } from "db://oops-framework/libs/ecs/ECS";

/** 业务输入参数 */
@ecs.register('MatchBll')
export class MatchBllComp extends ecs.Comp {
    /** 业务层组件移除时，重置所有数据为默认值 */
    reset() {
        
    }
}

/** 业务逻辑处理对象 */
@ecs.register('MatchSys')
export class MatchBllSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(MatchBllComp);
    }

    entityEnter(e: ecs.Entity): void {
        // 注：自定义业务逻辑

        e.remove(MatchBllComp);
    }
}