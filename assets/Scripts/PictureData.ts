import { _decorator, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PictureData')
export class PictureData {
    @property(SpriteFrame)
    bg: SpriteFrame = null;
    @property([SpriteFrame])
    pieces: SpriteFrame[] = [];
    @property(Number)
    row: number = 0;
    @property(Number)
    column: number = 0;
}

