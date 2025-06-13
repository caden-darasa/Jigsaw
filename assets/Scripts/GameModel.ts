import { _decorator, Component, Node } from 'cc';
import { PictureData } from './PictureData';
const { ccclass, property } = _decorator;

@ccclass('GameModel')
export class GameModel {
    @property([PictureData])
    pictures: PictureData[] = [];

    start() {

    }

    update(deltaTime: number) {

    }
}

