import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import path from 'path';
import fs from 'fs';

/**
 * Preload スクリプトの所在するディレクトリを取得
 *
 * 開発時には webpack の出力先を指定し、
 * electron-builder によるパッケージ後には 'asarUnpack' オプションに
 * 設定したディレクトリを返す
 */
const getResourceDirectory = () => {
  return process.env.NODE_ENV === 'development'
    ? path.join(process.cwd(), 'dist')
    : path.join(process.resourcesPath, 'app.asar.unpack', 'dist');
};


async function openDialog(mainWin: BrowserWindow) {
    // フォルダ選択ダイアログを開いてディレクトリパスを取得する
    const dirpath = await dialog
        .showOpenDialog(mainWin, {
            properties: ["openDirectory"],
        })
        .then((result) => {
            // キャンセルされたとき
            if (result.canceled) return;

            // 選択されたディレクトリのパスを返す
            return result.filePaths[0];
        })
        .catch((err) => console.log(err));

    // なにも選択されなかったときやエラーが生じたときは
    // void | undefined となる
    if (!dirpath) return;

    /**
     * Node.fs を使って上で得られたディレクトリパスの
     * ファイル一覧を作成し、返信としてレンダラープロセス
     * へ送る
     */
    const filelist = fs.promises
        .readdir(dirpath, { withFileTypes: true })
        .then((dirents) =>
            dirents
                .filter((dirent) => dirent.isFile())
                .map(({ name }) => path.join(dirpath, name)),
        )
        .catch((err) => console.log(err));

    return filelist;
}

/**
 * BrowserWindowインスタンスを作成する関数
 */
const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.resolve(getResourceDirectory(), 'preload.js'),
    },
  });

  // レンダラープロセスをロード
  mainWindow.loadFile(path.resolve(getResourceDirectory(), 'index.html'));

  // 開発時にはデベロッパーツールを開く
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools({ mode: 'detach' });

    // React Developer Tools をロードする
    // loadDevtool(loadDevtool.REACT_DEVELOPER_TOOLS);
  }

  ipcMain.handle('open-dialog', () => openDialog(mainWindow));
};

/**
 * アプリが起動したら BrowserWindow インスタンスを作成し、
 * レンダラープロセス（index.htmlとそこから呼ばれるスクリプト）を
 * ロードする
 */
app.whenReady().then(createWindow);

// すべてのウィンドウが閉じられたらアプリを終了する
app.once('window-all-closed', () => app.quit());
