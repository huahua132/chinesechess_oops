import { ecs } from "db://oops-framework/libs/ecs/ECS";
import { smc } from "../../../common/SingletonModuleComp"
import {hallserver_player, hallserver_match} from "../../../../../protos-js/proto"
import {HallEntity} from "../Hall"
import {HallModelComp} from "../model/HallModelComp"

@ecs.register('HallBll')
export class HallBllComp extends ecs.Comp {
    reset() {
    }
}

/** 业务逻辑处理对象 */
@ecs.register('HallSys')
export class HallSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem, ecs.ISystemUpdate {
    filter(): ecs.IMatcher {
        return ecs.allOf(HallBllComp, HallModelComp);
    }

    entityEnter(entity: HallEntity): void {
        // 注：自定义业务逻辑

        //收到玩家信息
        smc.net.GetNode("hall").RegPushHandle("hallserver_player", "PlayerInfoNotice", (msgBody: hallserver_player.IPlayerInfoNotice)=> {
            entity.HallModel.NickName = msgBody.nickname!;
            entity.HallModel.RankScore = msgBody.rankScore!;

            if (entity.HallView) {
                entity.HallView.RefreshPlayerInfo();
            }
        })

        //收到匹配结果
        smc.net.GetNode("hall").RegPushHandle("hallserver_match", "MatchGameNotice", (msgbody: hallserver_match.IMatchGameNotice)=> {

        })
    }

    update(entity: HallEntity) {
        //console.log("dt >>> ", this.dt);
    }
}