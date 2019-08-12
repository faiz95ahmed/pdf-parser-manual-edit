import * as vscode from 'vscode';

export class State {
    fileName: string;
    poisName: string;
    poisText: string;
    poisJSON: Array<POI>;
    poisPos: number[];
    ready: Boolean;
    activePOI: number;
    numPOIs: number;
    constructor() {
        var current_editor = vscode.window.activeTextEditor;
        this.fileName = "";
        this.poisName = "";
        this.poisText = "";
        this.poisJSON = [];
        this.poisPos = [];
        this.activePOI = -1;
        this.numPOIs = 0;
        this.ready = false;
    }
    currentPOIName() {
        var currPOI = this.poisJSON[this.activePOI];
        return currPOI.name;
    }
}

abstract class POI {
    name!: string;
    positions!: Array<bigint>;
}