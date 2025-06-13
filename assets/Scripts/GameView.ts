import { _decorator, Component, Animation, Node, Sprite, tween, math, Quat, Vec3, Layout, UITransform } from 'cc';
import { PictureData } from './PictureData';
import { Piece } from './Piece';
import { Constant } from './Constant';
const { ccclass, property } = _decorator;

@ccclass('GameView')
export class GameView extends Component {
    private readonly PICTURE_SCALE: number = 0.8;

    @property([Node])
    grids: Node[] = [];
    @property([Layout])
    groups: Layout[] = [];
    @property(Node)
    moveParent: Node = null;
    @property([Sprite])
    bgs: Sprite[] = [];

    private curGrid: Node = null;
    private curGroup: Layout = null;
    private posGrids: Node[] = [];
    private pieces: Piece[] = [];
    private posGroups: Node[] = [];

    //#region Public methods

    public setCurrentLevel(data: PictureData) {
        let id = 0;

        if (data.row == 3) {
            id = 1;
        }
        else if (data.row == 4) {
            id = 2;
        }

        this.bgs[id].spriteFrame = data.bg;
        this.curGroup = this.groups[id];
        this.curGrid = this.grids[id];
        this.bgs[id].node.active = true;
        this.curGroup.node.active = true;
        this.curGrid.active = true;

        for (let i = 0; i < this.curGrid.children.length; i++) {
            this.posGrids[i] = this.curGrid.children[i];
            this.pieces[i] = this.posGrids[i].children[0].getComponent(Piece);
            this.pieces[i].setFrame(data.pieces[i], id);
            this.posGroups[i] = this.curGroup.node.children[i];
        }
    }

    public pieceFly() {
        let count = 0;
        let ids: number[] = [];

        for (let i = 0; i < this.posGroups.length; i++) {
            ids.push(i);
        }

        this.schedule(() => {
            let p = this.pieces[count];
            let scl = p.node.getWorldScale();
            let pos = p.node.getWorldPosition();
            this.moveParent.addChild(p.node);
            p.node.setWorldScale(scl);
            p.node.setWorldPosition(pos);
            let rd = Math.floor(Math.random() * ids.length);
            let groupId = ids[rd];
            ids.splice(rd, 1);
            let tf = p.getComponent(UITransform);
            let ratio = tf.contentSize.x * this.PICTURE_SCALE / this.curGroup.cellSize.x;
            let sclTo = new Vec3(scl.x / ratio, scl.y / ratio, scl.z / ratio);
            p.moveTo(this.posGroups[groupId].worldPosition, sclTo);
            count++;
        }, Constant.PIECE_FLY_TIME, this.posGrids.length - 1, 0);
    }

    public completeLevel() {
        let count = 0;
        this.schedule(() => {
            let n = this.pieces[count].node;
            let temp = count;
            tween(n).by(0.25, {
                eulerAngles: new Vec3(0, 0, 360)
            }, {
                onComplete: () => {
                    this.pieces[temp].returnRoot(this.posGrids[temp]);
                }
            }).start();
            n.setSiblingIndex(n.parent.children.length - 1);
            count++;
        }, 0.25, this.pieces.length - 1);
    }

    //#endregion
}

