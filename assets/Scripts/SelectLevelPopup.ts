import { _decorator, Component, director, Node, tween, Vec3 } from 'cc';
import { StaticData } from './StaticData';
import AudioManager from './Utils/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('SelectLevelPopup')
export class SelectLevelPopup extends Component {
    @property(Node)
    popup: Node = null;
    @property([Node])
    modes: Node[] = [];
    @property(Node)
    home: Node = null;

    //#region Public methods

    public show(id: number) {
        this.node.active = true;
        this.modes[id].active = true;
    }

    public onLevelClick(event: Event, customEventData: string) {
        AudioManager.instance.playClickButton();
        this.scheduleOnce(() => {
            let level = parseInt(customEventData, 10);
            StaticData.CurrentLevel = level;
            director.loadScene("Game");
        }, 0.2);
    }

    public onCloseClick() {
        AudioManager.instance.playClickButton();
        this.scheduleOnce(() => {
            this.hide();
        }, 0.2);
    }

    //#endregion

    //#region Life cycle callbacks

    protected onEnable(): void {
        for (let i = 0; i < this.modes.length; i++) {
            this.modes[i].active = false;
        }

        this.popup.scale = Vec3.ZERO;
        tween(this.popup).to(0.5,
            {
                scale: Vec3.ONE
            }, {
            easing: "backOut"
        }
        ).start();
    }

    //#endregion

    //#region Private methods

    private hide() {
        tween(this.popup).to(0.5,
            {
                scale: Vec3.ZERO
            }, {
            easing: "backIn",
            onComplete: () => {
                this.node.active = false;
                this.home.active = true;
            }
        }
        ).start();
    }

    //#endregion

}

