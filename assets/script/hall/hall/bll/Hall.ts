import { ecs } from "db://oops-framework/libs/ecs/ECS";
import { smc } from "../../../common/SingletonModuleComp"
import {hallserver_player} from "../../../../../protos-js/proto"
import {HallEntity} from "../Hall"

@ecs.register('HallBll')
export class HallBllComp extends ecs.Comp {
    reset() {
    }
}

/** 业务逻辑处理对象 */
@ecs.register('HallSys')
export class HallSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(HallBllComp);
    }

    entityEnter(entity: HallEntity): void {
        // 注：自定义业务逻辑
        smc.net.GetNode("hall").RegPushHandle("hallserver_player", "PlayerInfoNotice", (msgBody: hallserver_player.IPlayerInfoNotice)=> {
            console.log("recv msg >>> ", msgBody);
            entity.HallModel.NickName = msgBody.nickname!;
            entity.HallModel.RankScore = msgBody.rankScore!;

            if (entity.HallView) {
                entity.HallView.RefreshPlayerInfo();
            }
        })

        entity.remove(HallBllComp);
    }
}