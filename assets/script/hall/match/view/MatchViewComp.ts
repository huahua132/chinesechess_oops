import { _decorator } from "cc";
import { ecs } from "db://oops-framework/libs/ecs/ECS";
import { CCComp } from "db://oops-framework/module/common/CCComp";
import { MatchEntity } from "../Match";

const { ccclass, property } = _decorator;

/** 视图层对象 */
@ccclass('MatchViewComp')
@ecs.register('MatchView', false)
export class MatchViewComp extends CCComp {
    /** 视图层逻辑代码分离演示 */
    start() {
        const entity = this.ent as MatchEntity;
        entity.MatchView = this;
    }

    //显示倒计时
    ShowRemainTime() {
        
    }

    /** 视图对象通过 ecs.Entity.remove(MatchViewComp) 删除组件是触发组件处理自定义释放逻辑 */
    reset() {
        this.node.destroy();
    }
}