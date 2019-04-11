// plugin_odbc.js
const ODBC = require('odbc')
const ERR_OPEN_DB = 'ODBCの命令を使う前に『ODBC開く』でデータベースを開いてください。';
const ERR_ASYNC = '『逐次実行』構文で使ってください。';
const PluginODBC = {
  '初期化': {
    type: 'func',
    josi: [],
    fn: function (sys) {
      sys.__odbc_db = null
    }
  },
  // @ODBC
  'ODBC逐次開': { // @逐次実行構文にて、ODBCのデータベースを開く // @ODBCちくじひらく
    type: 'func',
    josi: [['を', 'の', 'で']],
    fn: function (s, sys) {
      if (!sys.resolve) throw new Error('『ODBC開』は' + ERR_ASYNC)
      sys.resolveCount++
      const resolve = sys.resolve
      const db = ODBC()
      sys.__odbc_db = db
      db.open(s, function (err) {
        if (err) {
          throw new Error('ODBC接続エラー:' + err.message)
        }
        resolve()
      })
    }
  },
  'ODBC開': { // @ODBCのデータベースを同期的に開いてオブジェクトを返す // @ODBCひらく
    type: 'func',
    josi: [['を', 'の', 'で']],
    fn: function (s, sys) {
      const db = ODBC()
      sys.__odbc_db = db
      const res = db.openSync(s)
      if (res) return db
      return null
    }
  },
  'ODBC逐次実行': { // @逐次実行構文にて、SQLとパラメータPARAMSでSQLを実行し、変数『対象』に結果を得る。 // ODBCちくじじっこう
    type: 'func',
    josi: [['を'], ['で']],
    fn: function (sql, params, sys) {
      if (!sys.resolve) throw new Error(ERR_ASYNC)
      sys.resolveCount++
      const resolve = sys.resolve
      if (!sys.__odbc_db) throw new Error(ERR_OPEN_DB)
      sys.__odbc_db.query(sql, params, function (err, rows) {
        if (err) {
          throw new Error('ODBC逐次実行のエラー『' + sql + '』' + err.message)
        }
        sys.__v0['対象'] = rows
        resolve()
      })
    },
    return_none: true
  },
  'ODBC実行': { // @逐次実行構文内で、SQLとパラメータPARAMSでSQLを実行して結果を得る。 // SQLITE3をしゅとく
    type: 'func',
    josi: [['を'], ['で']],
    fn: function (sql, params, sys) {
      if (!sys.__odbc_db) throw new Error(ERR_OPEN_DB)
      const rows = sys.__odbc_db.querySync(sql, params)
      return rows
    }
  },
  'ODBC閉': { // @ODBCで開いているデータベースを閉じる // ODBCとじる
    type: 'func',
    josi: [],
    fn: function (sys) {
      if (!sys.__odbc_db) throw new Error(ERR_OPEN_DB)
      sys.__odbc_db.closeSync()
    },
    return_none: true
  },
  'ODBC逐次閉': { // @逐次実行構文でODBCで開いているデータベースを閉じる // ODBCちくじとじる
    type: 'func',
    josi: [],
    fn: function (sys) {
      if (!sys.resolve) throw new Error(ERR_ASYNC)
      sys.resolveCount++
      const resolve = sys.resolve
      if (!sys.__odbc_db) throw new Error(ERR_OPEN_DB)
      sys.__odbc_db.close(function (err) {
        if (err) throw new Error('ODBCを閉じることができません。' + err.message)
        resolve()            
      })
    },
    return_none: true
  },
  'ODBCトランザクション開始': { // @ODBCでトランザクションを開始する // ODBCとらんざくしょんかいし
    type: 'func',
    josi: [],
    fn: function (sys) {
      if (!sys.__odbc_db) throw new Error(ERR_OPEN_DB)
      sys.__odbc_db.beginTransactionSync()
    },
    return_none: true
  },
  'ODBCトランザクション終了': { // @ODBCでトランザクションを終了する // ODBCとらんざくしょんしゅうりょう
    type: 'func',
    josi: [],
    fn: function (sys) {
      if (!sys.__odbc_db) throw new Error(ERR_OPEN_DB)
      sys.__odbc_db.commitTransactionSync()
    },
    return_none: true
  }
}

module.exports = PluginODBC

