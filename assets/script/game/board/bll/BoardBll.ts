import { ecs } from "db://oops-framework/libs/ecs/ECS";
import { smc } from "../../../common/SingletonModuleComp";
import { BoardEntity } from "../BoardEntity";
import { chinese_chess_game } from "../../../../../protos-js/proto.js";
import {oops} from "db://oops-framework/core/Oops"

/** 业务输入参数 */
@ecs.register('BoardBll')
export class BoardBllComp extends ecs.Comp {
    /** 业务层组件移除时，重置所有数据为默认值 */
    PosMap = [];            //棋盘位置映射
    chessPosMap = [];       //位置上有没有棋子
    reset() {
        this.PosMap = [];
        this.chessPosMap = [];
    }
}

/** 业务逻辑处理对象 */
@ecs.register('BoardSys')
export class BoardBllSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem, ecs.ISystemUpdate, ecs.ISystemFirstUpdate {
    filter(): ecs.IMatcher {
        return ecs.allOf(BoardBllComp);
    }

    entityEnter(entity: BoardEntity): void {
        console.log("entityEnter BoardBll >>> ", entity);
        entity.BoardBllSys = this;
        
        for (let row = 1; row <= 10; row++) {
            for (let col = 1; col <= 9; col++) {

            }
        }

        smc.net.GetNode("game").RegPushHandle("chinese_chess_game", "gameStateRes", (msgBody: chinese_chess_game.IgameStateRes) => {
            console.log("收到游戏状态 >>> ", msgBody)
        })

        smc.net.GetNode("game").RegPushHandle("chinese_chess_game", "moveRes", (msgBody: chinese_chess_game.ImoveRes) => {
            console.log("收到游戏移动 >>> ", msgBody)
        })

        smc.net.GetNode("game").RegPushHandle("chinese_chess_game", "nextDoing", (msgBody: chinese_chess_game.InextDoing) => {
            console.log("收到接下来谁操作 >>> ", msgBody)
        })
    }

    firstUpdate(entity: BoardEntity): void {
        console.log("firstUpdate BoardBll >>> ", entity);
        smc.net.GetNode("game").Req("chinese_chess_game", "gameStateReq", {playerId : smc.hall.HallModel.PlayerId})
        .then(body => {
            if (body.isErr) {
                oops.gui.toast("获取游戏状态失败")
            } else {

            }
        }).catch(body => {
            oops.gui.toast("获取游戏状态失败")
        })
    }

    update(entity: BoardEntity) {
        
    }
}