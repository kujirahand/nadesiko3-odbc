const db = require('odbc')()
const config = require('./db_config.js')
db.open(config, function (err) {
  if (err) {
    return console.log(err)
  }
  console.log('opend');
  db.query("insert into hoge (hoge_id,value)VALUES(1,1000)", function (err, rows, moreResultSets) {
    if (err) return console.log(err)
    console.log("insert")
  })
  db.query("select * FROM hoge", function (err, rows, moreResultSets) {
    if (err) return console.log(err)
    console.log(rows)
  })
})


