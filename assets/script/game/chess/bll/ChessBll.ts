import { ecs } from "db://oops-framework/libs/ecs/ECS";
import { ChessEntity } from "../ChessEntity";
import { PosEntity } from "../../pos/PosEntity";
import { ChessViewComp } from "../view/ChessViewComp";
import { CHESS_TYPE } from "../../enum/CHESS_TYPE";
import { TEAM_TYPE } from "../../enum/TEAM_TYPE";

/** 业务输入参数 */
@ecs.register('ChessBll')
export class ChessBllComp extends ecs.Comp {
    /** 业务层组件移除时，重置所有数据为默认值 */
    chessType: number = 0; //棋子类型
    row: number = 0;       //行
    col: number = 0;       //列
    id: number = 0;        //棋子id
    teamType : number = 0; //队伍类型
    isSelf : boolean = false; //是否是自己
    isKill : boolean = false; //是否被吃

    offSetX : number = 5; //x偏移
    offSetY : number = -5; //y偏移
    reset() {
        this.chessType = 0;
        this.row = 0;
        this.col = 0;
        this.id = 0;
        this.teamType = 0;
        this.isSelf = false;
        this.isKill = false;
        this.offSetX = 5;
        this.offSetY = -5;
    }
}

/** 业务逻辑处理对象 */
@ecs.register('ChessSys')
export class ChessBllSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(ChessBllComp, ChessViewComp);
    }

    entityEnter(entity: ChessEntity): void {
        entity.ChessSys = this;
    }

    setChessType(entity: ChessEntity, chessType: CHESS_TYPE) {
        entity.ChessBll.chessType = chessType;
        if (chessType > CHESS_TYPE.BLACK_Z) {
            entity.ChessBll.teamType = TEAM_TYPE.RED;
        } else {
            entity.ChessBll.teamType = TEAM_TYPE.BLACK;
        }
    }

    setIsSelf(entity: ChessEntity, isSelf: boolean) {
        entity.ChessBll.isSelf = isSelf;
    }

    getIsSelf(entity: ChessEntity) {
        return entity.ChessBll.isSelf;
    }

    //车
    isC(entity: ChessEntity) {
        return entity.ChessBll.chessType == CHESS_TYPE.BLACK_C || entity.ChessBll.chessType == CHESS_TYPE.RED_C;
    }
    //将
    isJ(entity: ChessEntity) {
        return entity.ChessBll.chessType == CHESS_TYPE.BLACK_J || entity.ChessBll.chessType == CHESS_TYPE.RED_J;
    }
    //马
    isM(entity: ChessEntity) {
        return entity.ChessBll.chessType == CHESS_TYPE.BLACK_M || entity.ChessBll.chessType == CHESS_TYPE.RED_M;
    }
    //炮
    isP(entity: ChessEntity) {  
        return entity.ChessBll.chessType == CHESS_TYPE.BLACK_P || entity.ChessBll.chessType == CHESS_TYPE.RED_P;
    }
    //士
    isS(entity: ChessEntity) {
        return entity.ChessBll.chessType == CHESS_TYPE.BLACK_S || entity.ChessBll.chessType == CHESS_TYPE.RED_S;
    }
    //象
    isX(entity: ChessEntity) {
        return entity.ChessBll.chessType == CHESS_TYPE.BLACK_X || entity.ChessBll.chessType == CHESS_TYPE.RED_X;
    }
    //卒
    isZ(entity: ChessEntity) {
        return entity.ChessBll.chessType == CHESS_TYPE.BLACK_Z || entity.ChessBll.chessType == CHESS_TYPE.RED_Z;
    }

    getCheesType(entity: ChessEntity) {
        return entity.ChessBll.chessType;
    }

    setPos(entity: ChessEntity, posEntity: PosEntity) {
        entity.ChessBll.row = posEntity.PosBll.row;
        entity.ChessBll.col = posEntity.PosBll.col;
        entity.ChessView.setPos(posEntity);
    }

    setId(entity: ChessEntity, id: number) {    
        entity.ChessBll.id = id;
    }

    getId(entity: ChessEntity) {
        return entity.ChessBll.id;
    }

    killed(entity: ChessEntity) {
        entity.ChessBll.isKill = true;
        entity.ChessView.hide();
    }

    isKill(entity: ChessEntity) {
        return entity.ChessBll.isKill;
    }

    getTeamType(entity: ChessEntity) {
        return entity.ChessBll.teamType;
    }

    getPos(entity: ChessEntity) {
        return { row: entity.ChessBll.row, col: entity.ChessBll.col };
    }

    //移动
    move(entity: ChessEntity, posEntity: PosEntity) {
        entity.ChessBll.row = posEntity.PosBll.row;
        entity.ChessBll.col = posEntity.PosBll.col;
        entity.ChessView.move(posEntity);
    }
}