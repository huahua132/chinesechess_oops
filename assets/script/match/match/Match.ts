import { ecs } from "db://oops-framework/libs/ecs/ECS";

/** Match 模块 */
@ecs.register('Match')
export class Match extends ecs.Entity {
    /** ---------- 数据层 ---------- */
    // MatchModel!: MatchModelComp;

    /** ---------- 业务层 ---------- */
    // MatchBll!: MatchBllComp;

    /** ---------- 视图层 ---------- */
    // MatchView!: MatchViewComp;

    /** 初始添加的数据层组件 */
    protected init() {
        // this.addComponents<ecs.Comp>();
    }
}