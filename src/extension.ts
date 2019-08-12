// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as load_pois from "./util/load_pois";
import { State } from "./util/state";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Point-of-interest extension active!');
	var myState = new State();
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let cmdLoad = vscode.commands.registerCommand('extension.poiLoad', () => {
		console.log('Point-of-interest Load');
		if (!myState.ready) {
			load_pois.loadPois(myState);
			goToOffset(myState);
		} else {
			vscode.window.showInformationMessage("Already Loaded");
		}
	});
	let cmdCycle = vscode.commands.registerCommand('extension.poiCycle', () => {
		if (myState.ready) {
			myState.activePOI = (myState.activePOI + 1) % myState.numPOIs;
			vscode.window.showInformationMessage("current POI: " + myState.currentPOIName());
			goToOffset(myState);
		} else {
			vscode.window.showInformationMessage("Not Loaded");
		}
	});
	let cmdNext = vscode.commands.registerCommand('extension.poiNext', () => {
		if (myState.ready) {
			myState.poisPos[myState.activePOI] = (myState.poisPos[myState.activePOI] + 1) % myState.poisJSON[myState.activePOI].positions.length;
			goToOffset(myState);
		} else {
			vscode.window.showInformationMessage("Not Loaded");
		}
	});
	let cmdPrev = vscode.commands.registerCommand('extension.poiPrev', () => {		
		if (myState.ready) {
			myState.poisPos[myState.activePOI] = (myState.poisPos[myState.activePOI] - 1) % myState.poisJSON[myState.activePOI].positions.length;
			goToOffset(myState);
		} else {
			vscode.window.showInformationMessage("Not Loaded");
		}
	});

	context.subscriptions.push(cmdLoad);
	context.subscriptions.push(cmdCycle);
	context.subscriptions.push(cmdNext);
	context.subscriptions.push(cmdPrev);
}

function goToOffset(state: State) {
	var currentLine = 0;
	var currentChar = 0;
	var targetOffset = state.poisJSON[state.activePOI].positions[state.poisPos[state.activePOI]];
	var current_editor = vscode.window.activeTextEditor;
	if (current_editor) {
		var current_document = current_editor.document;
		var targetPosition = current_document.positionAt(Number(targetOffset));
		console.log("TARGET OFFSET: "+ targetOffset);
		console.log("TARGET POSITION: "+ targetPosition.line + "/" + targetPosition.character);
		var targetRange = new vscode.Range(previousPosition(targetPosition, current_document),
										   nextPosition(targetPosition, current_document));
		current_editor.selection = new vscode.Selection(targetRange.start, targetRange.end);
		current_editor.revealRange(targetRange);
	}	
}

function previousPosition(position: vscode.Position, document: vscode.TextDocument): vscode.Position {
	if (position.character === 0) {
		return document.lineAt(position.line - 1).range.end;
	} else {
		return position.translate({ characterDelta: -1 });
	}
}

function nextPosition(position: vscode.Position, document: vscode.TextDocument): vscode.Position {
	// if (position.character === document.lineAt(position.line).range.end) {
	// 	return document.lineAt(position.line + 1).range.start;
	// } else {
	return position.translate({ characterDelta: +1 });
	//}
}

// this method is called when your extension is deactivated
export function deactivate() {}
