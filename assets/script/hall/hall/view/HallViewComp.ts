import { Label } from "cc";
import { _decorator } from "cc";
import { ecs } from "db://oops-framework/libs/ecs/ECS";
import { CCComp } from "db://oops-framework/module/common/CCComp";
import {HallEntity} from "../Hall"
import {oops} from "db://oops-framework/core/Oops"

const { ccclass, property } = _decorator;

/** 视图层对象 */
@ccclass('HallViewComp')
@ecs.register('HallView', false)
export class HallViewComp extends CCComp {
    /** 视图层逻辑代码分离演示 */
    start() {
        const entity = this.ent as HallEntity;
        entity.HallView = this;
        this.setButton();
        this.nodeTreeInfoLite();
        this.RefreshPlayerInfo();

        this.getNode("matching")!.active = false;
    }

    //显示匹配中
    ShowMatching() {
        const entity = this.ent as HallEntity;
        let matching = this.getNode("matching");
        matching!.active = true;
        matching!.getComponent(Label)!.string = "匹配中 " + Math.floor(entity.HallBll.MatchTime) + ' S';

        this.getNode("matchBtn")!.getComponentInChildren(Label)!.string = "取消匹配"
    }

    //取消显示匹配中
    CancelMatching() {
        this.getNode("matching")!.active = false;
        this.getNode("matchBtn")!.getComponentInChildren(Label)!.string = "开始匹配"
    }

    //刷新玩家信息
    RefreshPlayerInfo() {
        const entity = this.ent as HallEntity;
        this.getNode("playerId")!.getComponent(Label)!.string = entity.HallModel.PlayerId.toString();
        this.getNode("nickName")!.getComponent(Label)!.string = entity.HallModel.NickName;
        this.getNode("rank")!.getComponent(Label)!.string = entity.HallModel.RankScore.toString();
    }

    /* 按钮事件*/
    //游戏记录
    gameRecordBtn() {
        console.log("gameRecordBtn >>> ")
    }

    //邮件
    emailBtn() {
        console.log("emailBtn >>> ")
    }

    //匹配按钮
    matchBtn() {
        console.log("matchBtn >>> ")
        const entity = this.ent as HallEntity;
        if (entity.HallBll.MatchingReqing) {
            if (entity.HallBll.IsStartMatch) {
                oops.gui.toast("请求匹配中");
            } else {
                oops.gui.toast("取消匹配中");
            }
            return;
        }
        //取消匹配
        if (entity.HallBll.IsStartMatch) {
            entity.HallBll.IsStartMatch = false;
        } else {
            //开始匹配
            entity.HallBll.IsStartMatch = true;
        }
        entity.HallBll.IsMatchBtn = true;
    }

    /** 视图对象通过 ecs.Entity.remove(HallViewComp) 删除组件是触发组件处理自定义释放逻辑 */
    reset() {
        this.node.destroy();
    }
}