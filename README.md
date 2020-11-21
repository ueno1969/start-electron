# electron + typescript + react + eslint + prettier開発

## electron起動
```
yarn install
yarn start
```

## 構成

- ソースファイル群は src以下にまとめる
  - メインプロセスはmain以下
  - レンダラープロセスは renderer以下
  - 共通ライブラリは lib以下
- import時にsrcからのパスで指定できるようにする
  
## テスト

- jestを使う

```
yarn test
```

## VSCode

- VSCodeでESLintとPrettier プラグインを入れる
- 保存時にフォーマットする設定追加
  - .vscode/settings.json


## 手順

### パッケージインストール

```
mkdir start-electron
cd .\start-electron
yarn init -y
git init

yarn add react react-dom
yarn add -D electron  typescript @types/react @types/react-dom

yarn add -D webpack webpack-cli @types/webpack
yarn add -D ts-loader style-loader css-loader url-loader
yarn add -D html-webpack-plugin

yarn add -D rimraf cross-env npm-run-all

yarn add -D jest @types/jest ts-jest
```

### srcディレクトリからのパスでインポートできるように修正

以下のようにimportできるようにする

> import { foo } from `lib/foo.ts`

### tsconfig.ts

```
        "paths": {
            "*": ["src/*"]
        },
```

### webpack.config.js

```
const libraryPath = ["lib", "main"].reduce((obj, dir) => {
    obj[dir] = path.resolve(__dirname, `src/${dir}`);
    return obj;
}, {});
```

```
    resolve: {
        alias: libraryPath,
    },v
```


## 参考

- [Electron + TypeScript + React の環境構築(2020年夏）](https://qiita.com/sprout2000/items/aee0f1a7eb529068c836)

