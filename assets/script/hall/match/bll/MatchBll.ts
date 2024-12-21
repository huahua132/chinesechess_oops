import { ecs } from "db://oops-framework/libs/ecs/ECS";
import { smc } from "../../../common/SingletonModuleComp"
import { MatchEntity } from "../Match";
import { config } from "../../../../../extensions/oops-plugin-excel-to-json/src/main";

/** 业务输入参数 */
@ecs.register('MatchBll')
export class MatchBllComp extends ecs.Comp {
    /** 业务层组件移除时，重置所有数据为默认值 */
    RemainTime: number = 0;  //剩余时间
    SessionId : string = ""; //匹配的session_id
    GameId : number = 0;     //匹配的GameId
    reset() {
        this.RemainTime = 0;
        this.SessionId = "";
        this.GameId = 0;
    }
}

/** 业务逻辑处理对象 */
@ecs.register('MatchSys')
export class MatchBllSystem extends ecs.ComblockSystem implements ecs.ISystemUpdate {
    filter(): ecs.IMatcher {
        return ecs.allOf(MatchBllComp);
    }

    update(entity: MatchEntity) {
        console.log("matching >>>>", this.dt);
        if (entity.MatchBll.RemainTime <= 0) {
            entity.remove(MatchBllComp);
        }
        entity.MatchBll.RemainTime -= this.dt;

        if (entity.MatchView) {
            entity.MatchView.ShowRemainTime();
        }
    }
}