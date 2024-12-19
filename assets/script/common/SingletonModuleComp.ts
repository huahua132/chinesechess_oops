import { ecs } from "db://oops-framework/libs/ecs/ECS";
import { Account } from "../login/account/Account";
import { Initialize } from "../login/initialize/Initialize";
import { NetNodeManager } from "../../libs/network/NetNodeManager";

/** 游戏单例业务模块 */
@ecs.register('SingletonModule')
export class SingletonModuleComp extends ecs.Comp {
    /** 游戏初始化模块 */
    initialize: Initialize = null!;
    /** 游戏账号模块 */
    account: Account = null!;
    /** 网络模块 */
    net = new NetNodeManager();

    reset() { }
}

export const smc: SingletonModuleComp = ecs.getSingleton(SingletonModuleComp);