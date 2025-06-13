import { _decorator, Component, Node, Animation, Game, tween, Vec3, Label, director } from 'cc';
import { GameModel } from './GameModel';
import { GameView } from './GameView';
import { Constant } from './Constant';
import { PlayerController } from './PlayerController';
import { EndGamePopup } from './EndGamePopup';
import { StaticData } from './StaticData';
import AudioManager from './Utils/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    private readonly GAME_MODES = ["EASY", "NORMAL", "HARD"];

    @property(GameView)
    view: GameView = null;
    @property(GameModel)
    model: GameModel = null;
    @property(Node)
    picture: Node = null;
    @property(PlayerController)
    controller: PlayerController = null;
    @property(Label)
    title: Label = null;
    @property(EndGamePopup)
    endGamePopup: EndGamePopup = null;

    private animPicture: Animation = null;
    private counter: number = 0;
    private totalPiece: number = 0;

    //#region Properties

    private static _instance: GameManager = null;
    public static get instance(): GameManager {
        return this._instance;
    }

    private _isPlaying: boolean = false;
    public get isPlaying(): boolean {
        return this._isPlaying;
    }

    //#endregion

    //#region Public methods

    public completePiece() {
        this.counter++;

        if (this.counter == this.totalPiece) {
            this._isPlaying = false;
            this.view.completeLevel();
            this.scheduleOnce(() => {
                this.animPicture.play("picture-complete");
                this.scheduleOnce(() => {
                    this.endGamePopup.show();
                }, 2);
            }, this.totalPiece * 0.25 + 0.5);
        }
    }

    public onHomeClick() {
        AudioManager.instance.playClickButton();
        this.scheduleOnce(() => {
            director.loadScene("Menu");
        }, 0.2);
    }

    //#endregion

    //#endregion Life cycle callback

    protected onLoad(): void {
        GameManager._instance = this;
        this.animPicture = this.picture.getComponent(Animation);
    }

    start() {
        this.initGame();
    }

    //#endregion

    //#region Private methods

    private initGame() {
        this.animPicture.play("picture-start");
        let id = StaticData.CurrentLevel;
        let data = this.model.pictures[id];
        this.view.setCurrentLevel(data);
        this.totalPiece = Math.pow(data.column, 2);
        let mode = Math.floor(id / 3);
        this.title.string = this.GAME_MODES[mode];

        // Piece fly
        this.scheduleOnce(() => {
            this.view.pieceFly();
        }, 0.5);

        // gameStart
        this.scheduleOnce(() => {
            this.gameStart();
        }, this.totalPiece * Constant.PIECE_FLY_TIME + 1.5);
    }

    private gameStart() {
        this._isPlaying = true;
        this.animPicture.play("game-start");
        this.controller.gameStart();
    }

    //#endregion
}

