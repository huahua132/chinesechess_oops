import { Label } from "cc";
import { _decorator } from "cc";
import { ecs } from "db://oops-framework/libs/ecs/ECS";
import { CCComp } from "db://oops-framework/module/common/CCComp";
import {HallEntity} from "../Hall"

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

    //开始匹配
    matchBtn() {
        console.log("matchBtn >>> ")
    }

    /** 视图对象通过 ecs.Entity.remove(HallViewComp) 删除组件是触发组件处理自定义释放逻辑 */
    reset() {
        this.node.destroy();
    }
}