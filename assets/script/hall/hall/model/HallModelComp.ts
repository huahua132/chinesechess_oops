import { ecs } from "db://oops-framework/libs/ecs/ECS";

/** 数据层对象 */
@ecs.register('HallModel')
export class HallModelComp extends ecs.Comp {
    PlayerId: number = 0;
    NickName: string = "";
    RankScore: number = 0;

    /** 数据层组件移除时，重置所有数据为默认值 */
    reset() {
        this.PlayerId = 0;
        this.NickName = "";
        this.RankScore = 0;
    }
}