import { _decorator } from "cc";
import { ecs } from "db://oops-framework/libs/ecs/ECS";
import { CCComp } from "db://oops-framework/module/common/CCComp";
import { BoardEntity } from "../BoardEntity"

const { ccclass, property } = _decorator;

/** 视图层对象 */
@ccclass('BoardViewComp')
@ecs.register('BoardView', false)
export class BoardViewComp extends CCComp {
    /** 视图层逻辑代码分离演示 */
    start() {
        const entity = this.ent as BoardEntity;         // ecs.Entity 可转为当前模块的具体实体对象
        entity.BoardView = this;                        // 绑定视图层组件
        this.setButton();
        this.nodeTreeInfoLite();
    }

    // 获取初始位置
    getInitPos() {
        
    }

    /** 视图对象通过 ecs.Entity.remove(BoardViewComp) 删除组件是触发组件处理自定义释放逻辑 */
    reset() {
        this.node.destroy();
    }
}