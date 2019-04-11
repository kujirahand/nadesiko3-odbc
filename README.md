# nadesiko3-odbc
ODBC for Nadesiko3 (Database Driver)

## 利用の前準備

 - (1) Windowsにインストールされている「WindowsのODBCデータソース」を起動(32/64ビットあるので注意)
 - (2) ODBCソースで、ユーザDSNを追加 (追加時に接続テストできるのでテストすると良い)

## 動作テストを実行する場合

 - (1) db_config.js を作る
 - (2) そこに以下のように記述
 
 ```js
 const dsn = 'xxx'
 const user = 'xxx'
 const password = 'xxx'
 module.exports = `DSN=${dsn};UID=${user};PWD=${password}`
 ```
 
  - (3) npm test
 
 ## メモ
 
 詳しくは、testディレクトリ以下に書かれているサンプルを参照してください
 
