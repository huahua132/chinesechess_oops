import { ecs } from "db://oops-framework/libs/ecs/ECS";
import { MatchBllComp } from "./bll/MatchBll";
import { MatchViewComp } from "./view/MatchViewComp";

/** Match 模块 */
@ecs.register('Match')
export class MatchEntity extends ecs.Entity {
    /** ---------- 数据层 ---------- */
    // MatchModel!: MatchModelComp;

    /** ---------- 业务层 ---------- */
     MatchBll!: MatchBllComp;

    /** ---------- 视图层 ---------- */
    MatchView!: MatchViewComp;

    /** 初始添加的数据层组件 */
    protected init() {
    }
}