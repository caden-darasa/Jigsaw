import { _decorator, Component, Node, tween, v3, Vec3 } from 'cc';
import { SelectLevelPopup } from './SelectLevelPopup';
import AudioManager from './Utils/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('HomeController')
export class HomeController extends Component {
    @property(SelectLevelPopup)
    levelPopup: SelectLevelPopup = null;
    @property([Node])
    modes: Node[] = [];

    private isTweening: boolean = false;

    //#region Public methods

    public onModeClick(event: Event, customEventData: string) {
        if (this.isTweening)
            return;

        AudioManager.instance.playClickButton();
        let id = parseInt(customEventData, 10);
        this.buttonOut(id);
    }

    //#endregion

    protected onEnable(): void {
        this.buttonIn();
    }

    //#region Private methods

    private buttonIn() {
        let left: Node = null;
        let right: Node = null;

        for (let i = 0; i < this.modes.length; i++) {
            if (this.modes[i].position.x < 0)
                left = this.modes[i];
            else if (this.modes[i].position.x > 0)
                right = this.modes[i];
        }

        if (left && right) {
            tween(left).to(0.25, {
                position: new Vec3(0, left.position.y, left.position.z)
            }, {
                easing: "backOut"
            }).start();

            tween(right).to(0.25, {
                position: new Vec3(0, right.position.y, right.position.z)
            }, {
                easing: "backOut"
            }).start();
        }
    }

    private buttonOut(id: number) {
        this.isTweening = true;
        let left = this.modes[0];
        let right = this.modes[1];

        if (id == 0) {
            left = this.modes[1];
            right = this.modes[2];
        }
        else if (id == 1) {
            right = this.modes[2];
        }

        tween(left).to(0.25, {
            position: new Vec3(-900, left.position.y, left.position.z)
        }, {
            easing: "backIn"
        }).start();

        tween(right).to(0.25, {
            position: new Vec3(900, right.position.y, right.position.z)
        }, {
            easing: "backIn"
        }).start();

        this.scheduleOnce(() => {
            this.levelPopup.show(id);
            this.isTweening = false;
            this.node.active = false;
        }, 0.25);
    }

    //#endregion
}

