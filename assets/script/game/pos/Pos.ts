import { ecs } from "db://oops-framework/libs/ecs/ECS";

/** Pos 模块 */
@ecs.register('Pos')
export class Pos extends ecs.Entity {
    /** ---------- 数据层 ---------- */
    // PosModel!: PosModelComp;

    /** ---------- 业务层 ---------- */
    // PosBll!: PosBllComp;

    /** ---------- 视图层 ---------- */
    // PosView!: PosViewComp;

    /** 初始添加的数据层组件 */
    protected init() {
        // this.addComponents<ecs.Comp>();
    }
}