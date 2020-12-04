// Imports

var mysql      = require('mysql');
var fs = require('fs');
var config = require('../config/config');

//Setting de la configuration de connexion
var configuration = config.development;
configuration.multipleStatements = true;

// Instanciation de la connection
var connection = mysql.createConnection(configuration);

connection.connect();

const dataSQL = fs.readFileSync('database_development_sncf.sql').toString();


// On effectue l'ensemble des queries présentes dans le fichier database_development_sncf.sql
connection.query(dataSQL, function(err) {
  if (err) throw err;
  console.log("Migration effectuée avec succès.")
});
// On ferme la connexion
connection.end();