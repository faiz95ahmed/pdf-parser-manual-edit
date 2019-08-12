import { TextDocument, Uri } from "vscode";
import * as vscode from 'vscode';
import { State } from "./state";
let fs = require("fs");

export function loadPois(state: State) {
    var current_editor = vscode.window.activeTextEditor;
    if (current_editor) {
        var current_file = current_editor.document;
        state.fileName = current_file.fileName;
        var ls = state.fileName.split("\\");
        var current_file_name = ls[ls.length - 1];
        var ls2 = current_file_name.split(".");
        if (ls2.length > 1) {
            ls2[ls2.length - 2] = ls2[ls2.length - 2] + "_pois";
            ls2[ls2.length - 1] = "json";
        } else {
            ls2[0] = ls2[0] + "_pois.json";
        }
        var pois_file_name = ls2.join(".");
        ls[ls.length - 1] = pois_file_name;
        state.poisName = ls.join("/"); 
    } else {
        vscode.window.showInformationMessage("No point-of-interest file found");
    }
    state.poisText = fs.readFileSync(state.poisName, 'utf8');
    state.poisJSON = JSON.parse(state.poisText);
    for (var _ in state.poisJSON) {
        state.poisPos.push(0);
        state.numPOIs += 1;
    }
    state.activePOI = 0;
    state.ready = true;
}


  