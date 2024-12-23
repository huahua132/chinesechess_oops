import { ecs } from "db://oops-framework/libs/ecs/ECS";
import { smc } from "../../../common/SingletonModuleComp"
import {hallserver_player, hallserver_match} from "../../../../../protos-js/proto"
import {HallEntity} from "../Hall"
import {HallModelComp} from "../model/HallModelComp"
import {oops} from "db://oops-framework/core/Oops"
import { ModuleUtil } from "../../../../../extensions/oops-plugin-framework/assets/module/common/ModuleUtil";
import { MatchViewComp } from "../../match/view/MatchViewComp";
import { MatchBllComp } from "../../match/bll/MatchBll";
import { MatchEntity } from "../../match/Match";
import { UIID } from "../../../common/enum/UIConfig";
import { EVENT } from "../../../common/enum/EVENT";

let MATCH_STATE = {
    NOT_MATCHING : 0,
    MATCHING : 1,
    MATCHING_SUCC : 2,
}

@ecs.register('HallBll')
export class HallBllComp extends ecs.Comp {
    //匹配
    IsMatchBtn : boolean = false;        //是否点击了匹配按钮
    IsStartMatch : boolean = false;      //是否开始匹配
    MatchingReqing : boolean = false;    //匹配请求中 
    MatchTime : number = 0;              //匹配记时
    MatchState : number = 0;             //匹配状态  0没有匹配  1匹配中  2匹配成功
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
        let matchEntity = ecs.getEntity<MatchEntity>(MatchEntity);

        oops.message.on(EVENT.MATCH_TIME_OUT, this.onEventHandler, this);
        oops.message.on(EVENT.ACCEPT_MATCH, this.onEventHandler, this);
        oops.message.on(EVENT.CANCEL_MATCH, this.onEventHandler, this);

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
            console.log("收到匹配结果 >>> ", msgbody)
            matchEntity.addComponents<ecs.Comp>(MatchBllComp);
            ModuleUtil.addViewUi(matchEntity, MatchViewComp, UIID.Match);
            matchEntity.MatchBll.GameId = msgbody.gameId!;
            matchEntity.MatchBll.RemainTime = msgbody.remainTime!;
            matchEntity.MatchBll.SessionId = msgbody.sessionId!;
        })
    }

    //匹配超时
    onMatchTimeOut(args: any) {
        //再次请求匹配
        if (smc.hall.HallBll.MatchState == MATCH_STATE.MATCHING_SUCC) {
            setTimeout(()=>{
                smc.hall.HallBll.MatchState = MATCH_STATE.NOT_MATCHING;
                smc.hall.HallBll.IsMatchBtn = true;
            }, 1000); 
        } else {
            smc.hall.HallBll.IsStartMatch = false;
            smc.hall.HallBll.MatchState = MATCH_STATE.NOT_MATCHING;
        }
    }

    //同意匹配
    onAcceptMatch(args: any) {
        smc.hall.HallBll.MatchState = MATCH_STATE.MATCHING_SUCC;
    }

    //拒绝匹配
    onCancelMatch(args: any) {
        smc.hall.HallBll.IsStartMatch = false;
        smc.hall.HallBll.MatchState = MATCH_STATE.NOT_MATCHING;
    }

    onEventHandler(event: string, args: any) {
        switch (event) {
            case EVENT.MATCH_TIME_OUT:
                return this.onMatchTimeOut(args);
            case EVENT.ACCEPT_MATCH:
                return this.onAcceptMatch(args);
            case EVENT.CANCEL_MATCH:
                return this.onCancelMatch(args);
        }
    }

    update(entity: HallEntity) {
        //console.log("dt >>> ", this.dt);
        //开始匹配
        if (entity.HallBll.IsMatchBtn) {
            entity.HallBll.IsMatchBtn = false;
            if (entity.HallBll.IsStartMatch) {
                let req = {
                    gameId : 1,
                    playType : 10001,
                }
                entity.HallBll.MatchingReqing = true
                smc.net.GetNode("hall").Req("hallserver_match", "MatchGameReq", req)
                .then(body => { //服务端回复
                    if (body.isErr) {   //Error消息
                        oops.gui.toast("请求匹配失败 code=" + body.msgBody.code + "msg=" + body.msgBody.msg);
                        entity.HallBll.IsStartMatch = false;
                    } else {
                        oops.gui.toast("请求匹配成功");
                        entity.HallBll.MatchState = MATCH_STATE.MATCHING;
                        entity.HallBll.MatchTime = 0;
                    }
                })
                .catch(body => { //请求出错，超时，或者连接已关闭
                    oops.gui.toast("请求匹配失败 " + body.errmsg);
                    entity.HallBll.IsStartMatch = false;
                })
                .finally(()=>{
                    entity.HallBll.MatchingReqing = false
                })
            } else {
                //取消匹配
                let req = {
                    gameId : 1,
                    playType : 10001,
                }
                entity.HallBll.MatchingReqing = true
                smc.net.GetNode("hall").Req("hallserver_match", "CancelMatchGameReq", req)
                .then(body => { //服务端回复
                    if (body.isErr) {   //Error消息
                        oops.gui.toast("请求取消匹配失败 code=" + body.msgBody.code + "msg=" + body.msgBody.msg);
                        entity.HallBll.IsStartMatch = true;
                    } else {
                        oops.gui.toast("请求取消匹配成功");
                        entity.HallBll.MatchState = MATCH_STATE.NOT_MATCHING;
                    }
                })
                .catch(body => { //请求出错，超时，或者连接已关闭
                    oops.gui.toast("请求取消匹配失败 " + body.errmsg);
                    entity.HallBll.IsStartMatch = true;
                })
                .finally(()=>{
                    entity.HallBll.MatchingReqing = false
                })
            }
        }

        //匹配中
        if (entity.HallBll.MatchState == MATCH_STATE.MATCHING || entity.HallBll.MatchState == MATCH_STATE.MATCHING_SUCC) {
            entity.HallBll.MatchTime += this.dt;
            if (entity.HallView) {
                entity.HallView.ShowMatching();
            }
        } else {
            if (entity.HallView) {
                entity.HallView.CancelMatching();
            }
        }
    }
}