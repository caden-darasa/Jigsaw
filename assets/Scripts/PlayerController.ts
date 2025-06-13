import { _decorator, Component, EventTouch, Node, UITransform, v3, Vec3 } from 'cc';
import { GameManager } from './GameManager';
import { Piece } from './Piece';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
    @property(Node)
    parentPiece: Node = null;

    private pieces: Piece[] = [];
    private isMoving: boolean = false;
    private curId: number = -1;
    private offset: Vec3 = new Vec3();

    //#region Public methods

    public gameStart() {
        this.getPiece();
    }

    //#endregion

    //#region Life cycle callbacks

    protected onLoad(): void {
        this.parentPiece.on(Node.EventType.TOUCH_START, this.onTouch, this);
        this.parentPiece.on(Node.EventType.TOUCH_MOVE, this.onMove, this);
        this.parentPiece.on(Node.EventType.TOUCH_END, this.onMouseUp, this);
    }

    //#endregion

    //#region Private methods

    private getPiece() {
        this.pieces = [];
        for (let i = 0; i < this.parentPiece.children.length; i++) {
            this.pieces.push(this.parentPiece.children[i].getComponent(Piece));
        }
    }

    private onTouch(event: EventTouch) {
        if (!GameManager.instance.isPlaying) {
            return;
        }

        let touch = event.getUILocation();
        this.curId = -1;
        for (let i = 0; i < this.pieces.length; i++) {
            if (this.pieces[i].contains(touch)) {
                this.curId = i;
                break;
            }
        }
    }

    private onMove(event: EventTouch) {
        if (this.curId >= 0) {
            let move = event.getUILocation();
            this.pieces[this.curId].move(new Vec3(move.x, move.y, 0));
        }
    }

    private onMouseUp() {
        if (this.curId >= 0) {
            this.pieces[this.curId].returnPosition();
        }
    }

    //#endregion
}

