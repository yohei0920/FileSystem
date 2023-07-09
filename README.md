# FileSystem

## 詳細設計

詳細設計は[こちら](https://github.com/yohei0920/FileSystem/blob/main/%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E3%82%B7%E3%82%B9%E3%83%86%E3%83%A0%E8%A8%AD%E8%A8%88.md)

## 使用可能コマンド一覧(コマンド名 [引数]: 操作内容)

- touch [fileName]: 名前をつけて新しいファイルを作成します。

- mkdir [dirName]: 名前をつけて新しいディレクトリを作成します。

- print [fileName]: ファイルの内容を出力します。

- pwd: 現在の作業ディレクトリのパスを出力します。

- ls [fileOrDirName]: ディレクトリに含まれるファイルのファイルの情報のリストを表示、または単一ファイルの情報を出力します。

- setContent [fileName] [content]: 与えられたファイル名の内容を新しい内容に書き換えます。

- rm [fileOrDirName]: 与えられたファイル、またはディレクトリを取り除きます。

- cd [dirName]: 現在の作業ディレクトリを指定されたものに変更します。

- help [commandName]: コマンドのヘルプが表示されます。



## サンプルシナリオ

手順
~~~~~~~~~
1. pwd #=> 特になし

2. touch sampleFile #=> sampleFileファイルが作成されます。

3. mkdir sampleDir #=> sampleDirディレクトリが作成されます。

4. ls #=> sampleFile, sampleDirの2つが表示されます。

5. print sampleFile #=> 特になし

6. setContent sampleFile サンプル用の詳細が表示されます。

7. print sampleFile #=> 「サンプル用の詳細が表示されます。」という文言が表示されます

8. cd sampleDir #=> sampleDirに移動します。

9. mkdir sampleDir2 #=> sampleDir2ディレクトリが作成されます。

10. mkdir sampleDir3 #=> sampleDir3ディレクトリが作成されます。

11. cd sampleDir2 #=> sampleDir2に移動します。

12. mkdir sampleDir4 #=> sampleDir4が作成されます。

13 touch sampleFile2 #=> sampleFile2が作成されます。

14. pwd #=> /sampleDir/sampleDir2/

15. ls #=> sampleDir4, sampleFile2が表示されます。

16. rm sampleFile2 #=> sampleFile2が削除されます。

17. ls #=> sampleDir4が表示されます。

18. cd .. #=> /sampleDir/に移動します。

19. pwd #=> /sampleDir/

20. cd .. #=> ホームディレクトリに移動します。
~~~~~~~~~

以上
