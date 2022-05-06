const vscode = require('vscode');
const { related } = require("./related.js");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  let disposable = vscode.commands.registerCommand('related-files.open-related-file', function () {
    const editor = vscode.window.activeTextEditor;

    if (editor) {
      const files = related(editor.document.getText());

      if (files.length == 0) {
        return;
      } else if (files.length == 1) {
        return openFile(files[0]);
      } else {
        const names = files.map((file) => new Item(file.name, file.path));
        vscode.window.showQuickPick(names).then(({description: path}) => openFile(path));
      }
    }
  });

  context.subscriptions.push(disposable);
}

function deactivate() {}

class Item {
  constructor(name, path) {
    this.label = name;
    this.description = path;
  }
}

function openFile(path) {
  if (path) {
    const fileUris = vscode.workspace.workspaceFolders.map((folder) => vscode.Uri.joinPath(folder.uri, path));
    const extantFileUris = fileUris.filter((uri) => vscode.workspace.fs.stat(uri));
    const firstUri = extantFileUris[0];

    if (firstUri) {
      vscode.workspace.openTextDocument(firstUri).then((document) => vscode.window.showTextDocument(document));
    }
  }
}

module.exports = {
  activate,
  deactivate
}
