import { _decorator, Component, Layout, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DynamicGridView')
export class DynamicGridView extends Component {

    private grid: Layout = null;

    //#region Life cycle callbacks

    protected onLoad(): void {
        this.grid = this.getComponent(Layout);
    }

    start() {

    }

    update(deltaTime: number) {

    }

    //#endregion
}

