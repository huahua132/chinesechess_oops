import { ecs } from "db://oops-framework/libs/ecs/ECS";

/** Chess 模块 */
@ecs.register('Chess')
export class Chess extends ecs.Entity {
    /** ---------- 数据层 ---------- */
    // ChessModel!: ChessModelComp;

    /** ---------- 业务层 ---------- */
    // ChessBll!: ChessBllComp;

    /** ---------- 视图层 ---------- */
    // ChessView!: ChessViewComp;

    /** 初始添加的数据层组件 */
    protected init() {
        // this.addComponents<ecs.Comp>();
    }
}