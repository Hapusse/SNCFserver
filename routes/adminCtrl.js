//Imports
//Fichier de contrôle des clients (les fonctions relatives aux données client sont ici)

var config = require('../config/config');
var jwtUtils = require('../utils/jwt.utils');
var mysql      = require('mysql');


adminChecker = (headerAuth) => {
    var userId = jwtUtils.getUserId(headerAuth);
    if (userId < 0) {
        return 400;
    }
    var privilege = jwtUtils.getCredentials(headerAuth);
    console.log(`Privilèges : ${privilege}`);
    if (privilege == 0) {
        return 403;
    } else { return 201; }
}

// Il faut une fonction globale qui, une fois appelée, permettra de savoir si on est un admin ou non

module.exports = {
    gareCreator: function (req,res){
        //Params d'entrée:
        responseToAdmin = adminChecker(req.headers['authorization']);
        if (responseToAdmin == 400){
            return res.status(400).json({'error':'token corrompu ou expiré'})
        }
        else if (responseToAdmin == 403){
            return res.status(403).json({'error':'Vous n\'avez pas les privilèges administrateurs. Accès refusé.'})
        } else {
            var nom = req.body.nom;
            var ville = req.body.ville;
            if (nom == null || ville == null){
                return res.status(400).json({'error' : 'parametre ville ou nom manquant'});    
            }
            var connection = mysql.createConnection(config.development);
            connection.connect();
            // On pourrait rajouter le fait qu'une gare soit censée être unique (et donc remonter une erreur si on essaye de créer une gare dont le nom existe déjà...)
            connection.query(`INSERT INTO gares (id, nom, ville) VALUES (NULL, "${nom}", "${ville}");`, function(err, rows, fields) {
                if (err){
                    console.log(err);
                    connection.end();
                    return res.status(500).json({erreur:"Erreur serveur"});
                } else{
                    connection.end();
                    return res.status(201).json({status:"OK"});
                }
                });
        }
    },
    reductionCreator: function(req,res){
        //Params d'entrée:
        responseToAdmin = adminChecker(req.headers['authorization']);
        if (responseToAdmin == 400){
            return res.status(400).json({'error':'token corrompu ou expiré'})
        }
        else if (responseToAdmin == 403){
            return res.status(403).json({'error':'Vous n\'avez pas les privilèges administrateurs. Accès refusé.'})
        } else {
            var nom = req.body.nom;
            var pourcentage = req.body.pourcentage;
            if (nom == null || pourcentage == null || pourcentage != parseInt(pourcentage,10) || pourcentage > 100){
                return res.status(400).json({'error' : 'Paramètre nom ou pourcentage manquant, ou pourcentage > 100%'});    
            }
            var connection = mysql.createConnection(config.development);
            connection.connect();
            connection.query(`INSERT INTO reductions (id, nom, pourcentage) VALUES (NULL, "${nom}", "${pourcentage}");`, function(err, rows, fields) {
                if (err){
                    console.log(err);
                    connection.end();
                    return res.status(500).json({erreur:"Erreur serveur"});
                } else{
                    connection.end();
                    return res.status(201).json({status:"OK"});
                }
                });
        }
    },
    trainCreator: function(req,res){
        //Params d'entrée:
        responseToAdmin = adminChecker(req.headers['authorization']);
        if (responseToAdmin == 400){
            return res.status(400).json({'error':'token corrompu ou expiré'})
        }
        else if (responseToAdmin == 403){
            return res.status(403).json({'error':'Vous n\'avez pas les privilèges administrateurs. Accès refusé.'})
        } else {
            var numero = req.body.numero;
            var typeTrain = req.body.type;
            if (numero == null || typeTrain == null){
                return res.status(400).json({'error' : 'Paramètre numero ou type manquant'});    
            }
            var connection = mysql.createConnection(config.development);
            connection.connect();
            connection.query(`INSERT INTO trains (id, numero, type) VALUES (NULL, "${numero}", "${typeTrain}");`, function(err, rows, fields) {
                if (err){
                    console.log(err);
                    connection.end();
                    return res.status(500).json({erreur:"Erreur serveur"});
                } else{
                    connection.end();
                    return res.status(201).json({status:"OK"});
                }
                });
        }
    },
    voitureCreator: function(req,res){
        //Params d'entrée:
        responseToAdmin = adminChecker(req.headers['authorization']);
        if (responseToAdmin == 400){
            return res.status(400).json({'error':'token corrompu ou expiré'})
        }
        else if (responseToAdmin == 403){
            return res.status(403).json({'error':'Vous n\'avez pas les privilèges administrateurs. Accès refusé.'})
        } else {
            // Il faut créer une voiture et N places, moitié couloir (1-2  3-4)(5-6  7-8) --> Couloirs = 2 ou 3 modulo 4
            //Params d'entrée :
            var nbPlaces = req.body.nbPlaces;
            var classeVoiture = req.body.classeVoiture;
            var nbPlacesCouloir = Math.floor((nbPlaces/2+1/2));
            var nbPlacesFenetre = Math.floor(nbPlaces/2);
            if (nbPlaces == null || classeVoiture == null || nbPlaces != parseInt(nbPlaces,10)){
                return res.status(400).json({'error' : 'Paramètre nbPlaces ou classeVoiture manquant'});    
            }

            var configuration = config.development;
            configuration.multipleStatements = true;
            var connection = mysql.createConnection(configuration);
            connection.connect();
            connection.query(`
            INSERT INTO voitures (id, nb_places_couloir,nb_places_fenetre, classe) VALUES (NULL, ${nbPlacesCouloir},${nbPlacesFenetre},${classeVoiture});
            SELECT LAST_INSERT_ID() AS idVoiture;`, function(err,rows,fields){
                if (err){
                    console.log(err);
                    connection.end();
                    return res.status(500).json({erreur:"Erreur serveur"});
                }   else {
                var idVoiture = rows[0].insertId;
                console.log(idVoiture);
                var creationPlaceQuery = `INSERT INTO places (id,idVOITURE,numero_place,cote_couloir) VALUES `;
                for (let i=1 ; i <= nbPlaces; i++){
                    var cote_couloir = (i%4 <= 1 );
                    if (i == 1){
                        creationPlaceQuery += `(NULL,${idVoiture},${i},${cote_couloir})`;
                    } else {
                    creationPlaceQuery += `,(NULL,${idVoiture},${i},${cote_couloir})`;
                    }
                }
                console.log(creationPlaceQuery);
                connection.query(creationPlaceQuery,function(err,rows,fields)
                    {
                        if (err){
                            console.log(err);
                            connection.end();
                            return res.status(500).json({erreur:"Erreur serveur"});
                        }
                        return res.status(201).json({status:"OK"});

                    });
                }});
            }
        },
    trajetCreator: function(req,res){
            //Params d'entrée:
            /*
                Paramètres body : 
                    idGAREDEPART : integer
                    idGAREARRIVEE : integer
                    idTrain : integer
                    listeVoitures : JSON-like, qui donne la répartition des voitures dans le train. format : {1:idVoiture1,2:idVoiture2,...}
                    politiquePrix : Donne le prix du billet pour une place en deuxième classe.
                    heureDepart : Datetime format 'AAAA-MM-JJ hh:mm:ss'
                    heureArrivee : Datetime format 'AAAA-MM-JJ hh:mm:ss'
                Paramètres header:
                    Authorization : "Bearer " + admin_token

                Crée un trajet et la répartition correspondante
            */
        responseToAdmin = adminChecker(req.headers['authorization']);
        if (responseToAdmin == 400){
            return res.status(400).json({'error':'token corrompu ou expiré'})
        }
        else if (responseToAdmin == 403){
            return res.status(403).json({'error':'Vous n\'avez pas les privilèges administrateurs. Accès refusé.'})
        } else {
            // Il faut créer une voiture et N places, moitié couloir (1-2  3-4)(5-6  7-8) --> Couloirs = 2 ou 3 modulo 4
            //Params d'entrée :
            var idGAREDEPART = req.body.idGAREDEPART;
            var idGAREARRIVEE = req.body.idGAREARRIVEE;
            var idTrain = req.body.idTrain;
            var listeVoitures = req.body.listeVoitures;
            var politiquePrix = req.body.politiquePrix;
            var heureDepart = req.body.heureDepart;
            var heureArrivee = req.body.heureArrivee;
            // Vérifier si des arguments manquent
            if (idGAREDEPART == null || idGAREARRIVEE == null || idTrain == null || listeVoitures == null || politiquePrix == null || heureDepart == null || heureArrivee == null || heureDepart > heureArrivee){
                return res.status(400).json({'error' : 'Paramètres manquants ou incohérents. idGAREDEPART, idGAREARRIVEE, idTrain, listeVoiture, politiquePrix, heureDepart, heureArrivee'});    
            }
            var listeVoitures = JSON.parse(req.body.listeVoitures);
            console.log(listeVoitures);
            // Etablir la connexion
            var configuration = config.development;
            configuration.multipleStatements = true;
            var connection = mysql.createConnection(configuration);
            // Créer un trajet
            connection.query(`INSERT INTO trajets (id, idGAREDEPART, idGAREARRIVEE, idTRAIN, heure_depart, heure_arrivee,prix_initial) VALUES (NULL,${idGAREDEPART},${idGAREARRIVEE},${idTrain}, '${heureDepart}','${heureArrivee}',${politiquePrix});
            SELECT LAST_INSERT_ID();`, function(err,rows,fields){
                if (err){
                    console.log(err);
                    connection.end();
                    return res.status(500).json({erreur:"Erreur serveur"});
                } else {
                    var idTRAJET = rows[0].insertId;
                    // Trajet créé. On doit maintenant créer la répartition à partir des données de listeVoitures
                    var creationRepartitionQuery = `INSERT INTO repartitions (id, idTRAJET,idVOITURE,positionDansTrain,nb_places_couloir,nb_places_fenetre) VALUES `;
                    for (const position in listeVoitures){
                        console.log(position, listeVoitures[position]);
                        selectionNbPlacesVoitureCouloirQuery = `(SELECT COUNT(id) FROM places WHERE idVoiture = ${listeVoitures[position]} AND cote_couloir = 1)`;
                        selectionNbPlacesVoitureFenetreQuery = `(SELECT COUNT(id) FROM places WHERE idVoiture = ${listeVoitures[position]} AND cote_couloir = 0)`;
                        creationRepartitionQuery += `(NULL, ${idTRAJET},${listeVoitures[position]}, ${position}, ${selectionNbPlacesVoitureCouloirQuery},${selectionNbPlacesVoitureFenetreQuery}),`;
                    }
                    creationRepartitionQuery = creationRepartitionQuery.slice(0,-1);
                    console.log(creationRepartitionQuery);
                    connection.query(creationRepartitionQuery, function(err){
                        if (err){
                            console.log(err);
                            connection.end();
                            return res.status(500).json({erreur:"Erreur serveur"});
                        } else {
                            connection.end();
                            return res.status(201).json({idTrajet:idTRAJET});
                        }
                    });
                }
            });
        }
    },
    searchVoiture : function(req,res){
        responseToAdmin = adminChecker(req.headers['authorization']);
        if (responseToAdmin == 400){
            return res.status(400).json({'error':'token corrompu ou expiré'})
        }
        else if (responseToAdmin == 403){
            return res.status(403).json({'error':'Vous n\'avez pas les privilèges administrateurs. Accès refusé.'})
        } else {
            var nbResultatsLimite = req.body.nbResultatsLimite || 20;
            var idGare = req.body.gare;
            var configuration = config.development;
            var date = req.body.date;
            if (date == null || idGare == null){
                return res.status(400).json({'error' : 'Paramètres manquants ou incohérents. gare, date'});    
            }
            var selectionLieuDerniereArrivee = `SELECT gares.id
            FROM gares 
            JOIN trajets ON gares.id = trajets.idGAREARRIVEE
            JOIN repartitions ON repartitions.idTRAJET = trajets.id
            WHERE repartitions.idVOITURE = voits.id AND trajets.heure_depart < '${date}'
            ORDER BY trajets.heure_depart DESC
            LIMIT 1`
            var nbLieuDerniereArrivee = `SELECT COUNT(*)
            FROM gares 
            JOIN trajets ON gares.id = trajets.idGAREARRIVEE
            JOIN repartitions ON repartitions.idTRAJET = trajets.id
            WHERE repartitions.idVOITURE = voits.id AND trajets.heure_depart < '${date}'
            ORDER BY trajets.heure_depart DESC`

            var selectionLieuProchainDepart = `SELECT gares.id
            FROM gares 
            JOIN trajets ON gares.id = trajets.idGAREARRIVEE
            JOIN repartitions ON repartitions.idTRAJET = trajets.id
            WHERE repartitions.idVOITURE = voits.id AND trajets.heure_depart > '${date}'
            ORDER BY trajets.heure_depart ASC
            LIMIT 1`
            var nbLieuProchainDepart = `SELECT COUNT(*)
            FROM gares 
            JOIN trajets ON gares.id = trajets.idGAREARRIVEE
            JOIN repartitions ON repartitions.idTRAJET = trajets.id
            WHERE repartitions.idVOITURE = voits.id AND trajets.heure_depart > '${date}'
            ORDER BY trajets.heure_depart ASC`
            selectionVoituresPresentesAUneDate = `SELECT voits.id as idvoit, voits.nb_places_couloir as nbPlacesCouloir,
            voits.nb_places_fenetre as nbPlacesFenetre, voits.classe as classeVoiture
            FROM voitures as voits
            WHERE ((${selectionLieuDerniereArrivee}) = ${idGare} OR (${nbLieuDerniereArrivee}) = 0 )
            AND ((${selectionLieuProchainDepart}) = ${idGare} OR (${nbLieuProchainDepart}) = 0 )`
            var connection = mysql.createConnection(configuration);
            // Créer un trajet
            connection.connect();
            connection.query(selectionVoituresPresentesAUneDate,function(err, rows, fields){
            if (err){
                console.log(err);
                connection.end();
                return res.status(500).json({erreur:"Erreur serveur"});   
            } else {
                connection.end();
                return res.status(201).json(rows);
            }
            });


        }
    },
    searchTrain: function(req,res){
        responseToAdmin = adminChecker(req.headers['authorization']);
        if (responseToAdmin == 400){
            return res.status(400).json({'error':'token corrompu ou expiré'})
        }
        else if (responseToAdmin == 403){
            return res.status(403).json({'error':'Vous n\'avez pas les privilèges administrateurs. Accès refusé.'})
        } else {
            var nbResultatsLimite = req.body.nbResultatsLimite || 20;
            var typeTrainSubquery = (req.body.typeTrain) ? `type = '${req.body.typeTrain}'` : `1`;
            var connection = mysql.createConnection(config.development);
            connection.connect();
            connection.query(`SELECT * FROM trains WHERE ${typeTrainSubquery}
            LIMIT ${nbResultatsLimite}`,function(err, rows, fields){
                if (err){
                    console.log(err);
                    connection.end();
                    return res.status(500).json({erreur:"Erreur serveur"});   
                } else {
                    connection.end();
                    return res.status(201).json(rows);
                }
            });
        }
    }
}
