import { ecs } from "db://oops-framework/libs/ecs/ECS";
import { smc } from "../../../common/SingletonModuleComp";
import { BoardEntity } from "../BoardEntity";
import { chinese_chess_game } from "../../../../../protos-js/proto.js";
import { ModuleUtil } from "../../../../../extensions/oops-plugin-framework/assets/module/common/ModuleUtil";
import {oops} from "db://oops-framework/core/Oops"
import { BoardViewComp } from "../view/BoardViewComp";
import { PosEntity } from "../../pos/PosEntity";
import { PosViewComp } from "../../pos/view/PosViewComp";
import { ChessViewComp } from "../../chess/view/ChessViewComp";
import { ChessEntity } from "../../chess/ChessEntity";
import {GAME_STATE } from "../../enum/GAME_STATE"
import { UIID } from "../../../common/enum/UIConfig";

/** 业务输入参数 */
@ecs.register('BoardBll')
export class BoardBllComp extends ecs.Comp {
    /** 业务层组件移除时，重置所有数据为默认值 */
    tableId : string = "";              //桌子ID
    posMap: PosEntity[][] = [];         //棋盘位置映射
    chessPosMap : any[][] = [];         //位置上有没有棋子
    chessList : ChessEntity[] = [];     //棋子列表
    chessMap : any = {};                //棋子映射

    addTime : number = 0;               //过去时间
    reset() {
        this.tableId = "";
        this.posMap = [];
        this.chessPosMap = [];
        this.chessList = [];
        this.chessMap = {};
    }
}

/** 业务逻辑处理对象 */
@ecs.register('BoardSys')
export class BoardBllSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem, ecs.ISystemUpdate, ecs.ISystemFirstUpdate {
    filter(): ecs.IMatcher {
        return ecs.allOf(BoardBllComp, BoardViewComp);
    }

    entityEnter(entity: BoardEntity): void {
        console.log("entityEnter BoardBll >>> ", entity);
        entity.BoardBllSys = this;

        let initPos = entity.BoardView.getInitPos();
        let posP = entity.BoardView.getPosList();
        let x = initPos.x;
        let y = initPos.y;
        let offset = 58.3;
        //创建点位实例
        for (let row = 1; row <= 10; row++) {
            let ry = y - ((row - 1) * offset);
            let cp = [];
            for (let col = 1; col <= 9; col++) {
                let rx = x + ((col - 1) * offset)
                if (!entity.BoardBll.posMap[row]) {
                    entity.BoardBll.posMap[row] = [];
                }
                if (!entity.BoardBll.posMap[row][col]) {
                    let posEntity = ecs.getEntity<PosEntity>(PosEntity);
                    ModuleUtil.addView(posEntity, PosViewComp, posP, "gui/game/pos");
                    entity.BoardBll.posMap[row][col] = posEntity;
                    posEntity.PosView.setPos(rx, ry);
                    posEntity.PosBll.row = row;
                    posEntity.PosBll.col = col;
                    entity.addChild(posEntity);
                }

                cp.push(null);
            }
            entity.BoardBll.chessPosMap.push(cp);
        }

        //创建棋子实例
        for (let i = 0; i < 32; i++) {
            let chessEntity = ecs.getEntity<ChessEntity>(ChessEntity);
            ModuleUtil.addView(chessEntity, ChessViewComp, posP, "gui/game/chess");
            entity.addChild(chessEntity);
            entity.BoardBll.chessList.push(chessEntity);
        }

        smc.net.GetNode("game").RegPushHandle("chinese_chess_game", "gameStateRes", (msgBody: chinese_chess_game.IgameStateRes) => {
            console.log("收到游戏状态 >>> ", msgBody)
            this.execGameState(entity, msgBody);
        })

        smc.net.GetNode("game").RegPushHandle("chinese_chess_game", "moveRes", (msgBody: chinese_chess_game.ImoveRes) => {
            console.log("收到游戏移动 >>> ", msgBody)
        })

        smc.net.GetNode("game").RegPushHandle("chinese_chess_game", "nextDoing", (msgBody: chinese_chess_game.InextDoing) => {
            console.log("收到接下来谁操作 >>> ", msgBody)
        })
    }

    execGameState(entity: BoardEntity, msgBody: chinese_chess_game.IgameStateRes) {
        console.log("execGameState >>> ", entity, msgBody)
        entity.BoardModel.state = msgBody.state!;
        entity.BoardModel.playerList = msgBody.playerList!;
        for(let i = 0; i < msgBody.playerList!.length; i++) {
            let player = msgBody.playerList![i];
            if (player.playerId == smc.hall.HallModel.PlayerId) {
                entity.BoardModel.selfPlayer = player;
            } else {
                entity.BoardModel.rivalPlayer = player;
            }
        }
        entity.BoardModel.nextDoing = msgBody.nextDoing!;

        entity.BoardView.showPlayerInfo();

        entity.BoardBll.chessMap = {};

        let chessList = msgBody.chessList!;
        entity.BoardModel.chessList = chessList;
        for (let i = 0; i < chessList.length; i++) {
            let chess = chessList[i];
            let chessEntity = entity.BoardBll.chessList[i];
            let posEntity = entity.BoardBll.posMap[chess.row!][chess.col!];
            chessEntity.ChessSys.setChessType(chessEntity, chess.chessType!);
            chessEntity.ChessSys.setId(chessEntity, chess.chessId!);
            if (chessEntity.ChessSys.getTeamType(chessEntity) == entity.BoardModel.selfPlayer!.teamType) {
                chessEntity.ChessSys.setIsSelf(chessEntity, true);
            } else {
                chessEntity.ChessSys.setIsSelf(chessEntity, false);
            }
            chessEntity.ChessSys.setPos(chessEntity, posEntity);
            entity.BoardBll.chessPosMap[chess.row! - 1][chess.col! - 1] = chessEntity;
            entity.BoardBll.chessMap[chess.chessId!] = chessEntity;
        }
    }

    getGameState(entity: BoardEntity) {
        smc.net.GetNode("game").Req("chinese_chess_game", "gameStateReq", {playerId : smc.hall.HallModel.PlayerId})
        .then(body => {
            if (body.isErr) {
                oops.gui.toast("获取游戏状态失败")
                console.log("获取游戏状态失败 >>> ", body)
            } else {
                console.log("获取游戏状态成功 >>> ", body)
                this.execGameState(entity, body.msgBody);
            }
        }).catch(body => {
            oops.gui.toast("获取游戏状态失败")
            console.log("获取游戏状态失败 >>> ", body)
        })
    }

    firstUpdate(entity: BoardEntity): void {
        let loginRsp = smc.net.GetLoginRsp("game");
        console.log("firstUpdate BoardBll >>> ", entity, loginRsp);
        let gameNet = smc.net.GetNode("game");
        gameNet.Req("game_hall", "JoinReq", {tableId : entity.BoardBll.tableId})
        .then(body => {
            this.getGameState(entity);
        })
        .catch(body => {
            oops.gui.toast("进入桌子失败")
            console.log("进入桌子失败 >>> ", body)
        })
    }

    update(entity: BoardEntity) {
        if (entity.BoardModel.state == GAME_STATE.playing) {
            entity.BoardBll.addTime += this.dt;
            if (entity.BoardModel.nextDoing.playerId == entity.BoardModel.selfPlayer!.playerId) {
                entity.BoardView.showSelfRemainTime();
            } else {
                entity.BoardView.showRivalRemainTime();
            }
        }
    }
}