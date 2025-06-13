import { _decorator, Component, Node } from 'cc';
const { ccclass } = _decorator;

@ccclass('StaticData')
export class StaticData {
    public static CurrentLevel: number = 0;
}