import { _decorator, Animation, AudioClip, Component, Label, Node, Sprite, SpriteFrame, tween, UITransform, Vec2, Vec3 } from 'cc';
import { GameManager } from './GameManager';
import AudioManager from './Utils/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('Piece')
export class Piece extends Component {
    private readonly TWEEN_TIME = 0.2;
    private readonly DISTANCE_MATCHS = [150, 100, 75];

    @property(Sprite)
    icon: Sprite = null;
    @property(Node)
    bg: Node = null;
    @property(AudioClip)
    correctClip: AudioClip = null;
    @property(AudioClip)
    incorrectClip: AudioClip = null;

    private startPos: Vec3 = null;
    private startScale: Vec3 = null;
    private uiTransform: UITransform = null;
    private offset: Vec3 = new Vec3;
    private movePos: Vec3 = null;
    private moveScale: Vec3 = null;
    private isMoving: boolean = false;
    private complete: boolean = false;
    private anim: Animation = null;
    private id: number = 0;

    //#region Public methods

    public moveTo(posTo: Vec3, scaleTo: Vec3) {
        tween(this.node).by(0.5, {
            eulerAngles: new Vec3(0, 0, 360)
        }).start();
        tween(this.node).to(0.5, {
            worldPosition: posTo
        }).start();
        tween(this.node).to(0.5, {
            worldScale: scaleTo
        }).start();
        this.movePos = posTo;
        this.moveScale = scaleTo;
    }

    public setFrame(frame: SpriteFrame, id: number) {
        this.icon.spriteFrame = frame;
        this.id = id;
    }

    public contains(pos: Vec2) {
        if (this.complete)
            return false;

        let restult = this.uiTransform.getBoundingBoxToWorld().contains(pos);

        if (restult) {
            this.offset = Vec2.subtract(this.offset, new Vec3(pos.x, pos.y, 0), this.movePos);
        }

        return restult;
    }

    public move(pos: Vec3) {
        if (this.complete)
            return;

        if (!this.isMoving) {
            tween(this.node).to(this.TWEEN_TIME, {
                worldScale: this.startScale
            }).start();
            this.node.setSiblingIndex(this.node.parent.children.length - 1);
        }

        let newPos = new Vec3();
        Vec3.subtract(newPos, pos, this.offset);
        this.node.setWorldPosition(newPos);
        this.isMoving = true;
    }

    public returnPosition() {
        if (this.complete)
            return;

        AudioManager.instance.playSfx(this.incorrectClip);
        this.isMoving = false;
        tween(this.node).to(this.TWEEN_TIME, {
            worldScale: this.moveScale,
            worldPosition: this.movePos
        }).start();
    }

    public returnRoot(root: Node) {
        if (root) {
            this.node.setParent(root);
            this.node.setWorldScale(this.startScale);
            this.node.setWorldPosition(this.startPos);
        }
    }

    //#endregion

    //#region Life cycle callbacks

    protected onLoad(): void {
        this.startPos = this.node.getWorldPosition();
        this.uiTransform = this.icon.getComponent(UITransform);
        this.startScale = this.node.getWorldScale();
        this.anim = this.getComponent(Animation);
    }

    update(deltaTime: number) {
        if (this.isMoving) {
            let distance = Vec3.distance(this.node.getWorldPosition(), this.startPos);

            if (distance < this.DISTANCE_MATCHS[this.id]) {
                this.isMoving = false;
                this.correctPiece();
            }
        }
    }

    //#endregion

    //#region Private methods

    private correctPiece() {
        AudioManager.instance.playSfx(this.correctClip);
        this.complete = true;
        tween(this.node).to(this.TWEEN_TIME, {
            worldPosition: this.startPos,
        }, {
            onComplete: () => {
                GameManager.instance.completePiece();
                this.bg.active = true;
                this.anim.play("piece-in");
            }
        }).start();
    }

    //#endregion
}

