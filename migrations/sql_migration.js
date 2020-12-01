var mysql      = require('mysql');
var fs = require('fs');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : "database_development_sncf",
  multipleStatements : true
});


connection.connect();

const dataSQL = fs.readFileSync('database_development_sncf.sql').toString();

console.log(dataSQL);

connection.query(dataSQL, function(err, rows, fields) {
  if (err) throw err;
  console.log("Migration effectuée avec succès.")
});

connection.end();