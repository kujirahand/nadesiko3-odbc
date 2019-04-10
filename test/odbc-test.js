const assert = require('assert')
const path = require('path')
const nadesiko3 = require('nadesiko3')
const NakoCompiler = nadesiko3.compiler
const PluginNode = nadesiko3.PluginNode
const PluginODBC = require('../src/plugin_odbc.js')
const config = require('../db_config.js') // ODBC接続文字列を返すようにする
const assert_func = (a, b) => { assert.equal(a, b) }

describe('odbc_test', () => {
  const nako = new NakoCompiler()
  nako.addPluginObject('PluginNode', PluginNode)
  nako.addPluginObject('PluginODBC', PluginODBC)
  // console.log(nako.gen.plugins)
  // nako.debug = true
  nako.setFunc('テスト', [['と'], ['で']], assert_func)
  const cmp = (code, res) => {
    if (nako.debug) {
      console.log('code=' + code)
    }
    assert.equal(nako.runReset(code).log, res)
  }
  const cmd = (code) => {
    if (nako.debug) console.log('code=' + code)
    nako.runReset(code)
  }
  // --- test ---
  it('表示', () => {
    cmp('3を表示', '3')
  })
  // --- ODBCのテスト ---
  it('ODBC - create', () => {
    const sqlCreate = 'CREATE TABLE tt (id INTEGER PRIMARY KEY, value INTEGER);'
    cmd(`「${config}」をODBC開く。\n` +
        `「DROP TABLE tt」を[]でODBC実行。\n` +
        `「${sqlCreate}」を[]でODBC実行。\n` +
        `ODBC閉じる。`)
  })
  it('ODBC - insert', () => {
    const sqlInsert = 'INSERT INTO tt (id, value) VALUES (1, 123);'
    cmd(`「${config}」をODBC開く。\n` +
        `「${sqlInsert}」を[]でODBC実行。\n` +
        `ODBC閉じる。`)
  })
  it('ODBC - insert with params', () => {
    const sqlInsert = 'INSERT INTO tt (id, value) VALUES (?, ?);'
    cmd(`「${config}」をODBC開く。\n` +
        `「${sqlInsert}」を[2,321]でODBC実行。\n` +
        `ODBC閉じる。`)
  })
  it('ODBC - select', () => {
    const sqlSELECT = 'SELECT * FROM tt ORDER BY id ASC;'
    cmp(`「${config}」をODBC開く。\n` +
        `R=「${sqlSELECT}」を[]でODBC実行。\n` +
        `R[0]["value"]を表示。\n` +
        `ODBC閉じる。`, 123)
    cmp(`「${config}」をODBC開く。\n` +
        `R=「${sqlSELECT}」を[]でODBC実行。\n` +
        `R[1]["value"]を表示。\n` +
        `ODBC閉じる。`, 321)
  })
  // --- ODBCの非同期のテスト ---
  it('ODBC 非同期実行', (done) => {
    global.done = done
    cmd(
      `「${config}」をODBC開く。\n` +
      '逐次実行\n' +
      '　先に、「SELECT * FROM tt ORDER BY id ASC」を[]でODBC逐次実行\n' +
      '　次に、対象[1]["value"]と321でテスト。\n' +
      '　次に、ODBC逐次閉じる。\n' +
      '　次に、JS{{{ global.done() }}}\n' +
      'ここまで\n'
    )
  })
})
