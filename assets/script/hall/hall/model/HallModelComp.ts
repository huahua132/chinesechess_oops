import { ecs } from "db://oops-framework/libs/ecs/ECS";

/** 数据层对象 */
@ecs.register('HallModel')
export class HallModelComp extends ecs.Comp {
    //玩家信息
    PlayerId: number = 0;       //玩家ID 
    NickName: string = "";      //玩家昵称
    RankScore: number = 0;      //玩家分数

    /** 数据层组件移除时，重置所有数据为默认值 */
    reset() {
        this.PlayerId = 0;
        this.NickName = "";
        this.RankScore = 0;
    }
}