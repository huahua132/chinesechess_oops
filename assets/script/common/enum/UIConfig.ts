import { LayerType, UIConfig } from "db://oops-framework/core/gui/layer/LayerManager";

/** 界面唯一标识（方便服务器通过编号数据触发界面打开） */
export enum UIID {
    /** 资源加载界面 */
    Loading = 1,
    /** 提示弹出窗口 */
    Alert,
    /** 确认弹出窗口 */
    Confirm,
    /** 登录界面 */
    Login,
}

/** 打开界面方式的配置数据 */
export const UIConfigData: { [key: number]: UIConfig } = {
    [UIID.Alert]: { layer: LayerType.Dialog, prefab: "common/prefab/alert", mask: true },
    [UIID.Confirm]: { layer: LayerType.Dialog, prefab: "common/prefab/confirm", mask: true },
    [UIID.Loading]: { layer: LayerType.UI, prefab: "gui/loading/loading" },
    [UIID.Login] : {layer: LayerType.UI, prefab: "gui/login/login"},
}