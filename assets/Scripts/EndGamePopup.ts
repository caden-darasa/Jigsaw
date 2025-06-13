import { _decorator, Component, director, Node, sys, tween, Vec3 } from 'cc';
import { StaticData } from './StaticData';
import AudioManager from './Utils/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('EndGamePopup')
export class EndGamePopup extends Component {
    private readonly MAX_LEVEL: number = 8;

    @property(Node)
    popup: Node = null;

    public show() {
        this.node.active = true;
    }

    public onNextClick() {
        AudioManager.instance.playClickButton();
        this.scheduleOnce(() => {
            StaticData.CurrentLevel++;
            if (StaticData.CurrentLevel >= 9)
                StaticData.CurrentLevel = 0;
            director.loadScene("Game");
        }, 0.2);
    }

    protected onLoad(): void {
        this.popup.scale = Vec3.ZERO;
        tween(this.popup).to(0.5,
            {
                scale: Vec3.ONE
            }, {
            easing: "backOut"
        }
        ).start();
    }

}

