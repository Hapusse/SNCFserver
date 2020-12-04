//Imports
//Fichier de contrôle des administateurs

var config = require('../config/config');
var jwtUtils = require('../utils/jwt.utils');
var mysql      = require('mysql');



adminChecker = (headerAuth) => {
    // Fonction de contrôle administrateur : renvoie un code correspondant au statut à renvoyer (201 si ok)
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


module.exports = {
    gareCreator: function (req,res){
        /*Fonction permettant à l'administateur de créer une gare
        Entrée : token admin (dans le header), nom, ville
        Sortie : Message d'erreur ou de succès
        */
        // On checke si le token est valide et correspond à un admin
        responseToAdmin = adminChecker(req.headers['authorization']);
        if (responseToAdmin == 400){
            return res.status(400).json({'error':'token corrompu ou expiré'})
        }
        else if (responseToAdmin == 403){
            return res.status(403).json({'error':'Vous n\'avez pas les privilèges administrateurs. Accès refusé.'})
        } else {
            // On vérifie les paramètres d'entrée
            var nom = req.body.nom;
            var ville = req.body.ville;
            if (nom == null || ville == null){
                return res.status(400).json({'error' : 'parametre ville ou nom manquant'});    
            }
            // Connexion à la base
            var connection = mysql.createConnection(config.development);
            connection.connect();
            // Insertion de la nouvelle gare
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
        /*Fonction permettant à l'administateur de créer une réduction
        Entrée : token admin (dans le header), nom, pourcentage (< 100%)
        Sortie : Message d'erreur ou de succès
        */
        // On checke si le token est valide et correspond à un admin
        responseToAdmin = adminChecker(req.headers['authorization']);
        if (responseToAdmin == 400){
            return res.status(400).json({'error':'token corrompu ou expiré'})
        }
        else if (responseToAdmin == 403){
            return res.status(403).json({'error':'Vous n\'avez pas les privilèges administrateurs. Accès refusé.'})
        } else {
            // Check des variables d'entrées
            var nom = req.body.nom;
            var pourcentage = req.body.pourcentage;
            if (nom == null || pourcentage == null || pourcentage != parseInt(pourcentage,10) || pourcentage > 100){
                return res.status(400).json({'error' : 'Paramètre nom ou pourcentage manquant, ou pourcentage > 100%'});    
            }
            //Connexion à la BDD
            var connection = mysql.createConnection(config.development);
            connection.connect();
            // Insertion de la nouvelle réduction
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
        /*Fonction permettant à l'administateur de créer un train
        Entrée : token admin (dans le header), numero, type
        Sortie : Message d'erreur ou de succès
        */
        // On checke si le token est valide et correspond à un admin
        //Params d'entrée:
        responseToAdmin = adminChecker(req.headers['authorization']);
        if (responseToAdmin == 400){
            return res.status(400).json({'error':'token corrompu ou expiré'})
        }
        else if (responseToAdmin == 403){
            return res.status(403).json({'error':'Vous n\'avez pas les privilèges administrateurs. Accès refusé.'})
        } else {
            // On vérifie les données d'entrée
            var numero = req.body.numero;
            var typeTrain = req.body.type;
            if (numero == null || typeTrain == null){
                return res.status(400).json({'error' : 'Paramètre numero ou type manquant'});    
            }
            // On se connecte
            var connection = mysql.createConnection(config.development);
            connection.connect();
            // On insère un nouveau train
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
        /*Fonction permettant à l'administateur de créer une voiture ainsi que toutes les places correspondantes
        Entrée : token admin (dans le header), nbPlaces, classeVoiture
        Sortie : Message d'erreur ou de succès
        */
        // On checke si le token est valide et correspond à un admin
        responseToAdmin = adminChecker(req.headers['authorization']);
        if (responseToAdmin == 400){
            return res.status(400).json({'error':'token corrompu ou expiré'})
        }
        else if (responseToAdmin == 403){
            return res.status(403).json({'error':'Vous n\'avez pas les privilèges administrateurs. Accès refusé.'})
        } else {
            // Il faut créer une voiture et N places, moitié couloir (1-2  3-4)(5-6  7-8) --> Couloirs = 2 ou 3 modulo 4
            //On vérifie les paramètres d'entrée et on crée les variables du nombre de places couloir/fenêtre
            var nbPlaces = req.body.nbPlaces;
            var classeVoiture = req.body.classeVoiture;
            var nbPlacesCouloir = Math.floor((nbPlaces/2+1/2));
            var nbPlacesFenetre = Math.floor(nbPlaces/2);
            if (nbPlaces == null || classeVoiture == null || nbPlaces != parseInt(nbPlaces,10)){
                return res.status(400).json({'error' : 'Paramètre nbPlaces ou classeVoiture manquant'});    
            }
            // Connexion à la BDD
            var configuration = config.development;
            configuration.multipleStatements = true;
            // On va devoir récupérer l'id inséré de la voiture, donc on va avoir besoin du multipleStatements = true
            var connection = mysql.createConnection(configuration);
            connection.connect();
            connection.query(`
            INSERT INTO voitures (id, nb_places_couloir,nb_places_fenetre, classe) VALUES (NULL, ${nbPlacesCouloir},${nbPlacesFenetre},${classeVoiture});
            SELECT LAST_INSERT_ID() AS idVoiture;`, function(err,rows,fields){
                // On a créé une voiture
                if (err){
                    console.log(err);
                    connection.end();
                    return res.status(500).json({erreur:"Erreur serveur"});
                }   else {
                var idVoiture = rows[0].insertId;
                // On génère la requête créant l'ensemble des places :
                var creationPlaceQuery = `INSERT INTO places (id,idVOITURE,numero_place,cote_couloir) VALUES `;
                for (let i=1 ; i <= nbPlaces; i++){
                    var cote_couloir = (i%4 <= 1 );
                    if (i == 1){
                        creationPlaceQuery += `(NULL,${idVoiture},${i},${cote_couloir})`;
                    } else {
                    creationPlaceQuery += `,(NULL,${idVoiture},${i},${cote_couloir})`;
                    }
                }
                // On crée les places toutes en même temps
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
            /*
            Crée un trajet et la répartition correspondante
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
            Sortie :
                Message d'erreur ou idTrajet.
                
            */
        // On vérifie si le token est valide et est admin
        responseToAdmin = adminChecker(req.headers['authorization']);
        if (responseToAdmin == 400){
            return res.status(400).json({'error':'token corrompu ou expiré'})
        }
        else if (responseToAdmin == 403){
            return res.status(403).json({'error':'Vous n\'avez pas les privilèges administrateurs. Accès refusé.'})
        } else {
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
            politiquePrix *= 100; // Les prix sont stockés en centimes dans la base.
            // Etablir la connexion
            var configuration = config.development;
            configuration.multipleStatements = true;
            var connection = mysql.createConnection(configuration);
            // Créer un trajet et récupérer son ID pour créer la répartition
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
                    // On génère la requête de création de l'ensemble de la répartition d'un seul coup pour des soucis de performance
                    for (const position in listeVoitures){
                        // On récupère d'un même coup le nombre de places couloir et fenetre via une subquery select directement dans le INSERT.
                        selectionNbPlacesVoitureCouloirQuery = `(SELECT nb_places_couloir FROM voitures WHERE voitures.id = ${listeVoitures[position]})`;
                        selectionNbPlacesVoitureFenetreQuery = `(SELECT nb_places_fenetre FROM voitures WHERE voitures.id = ${listeVoitures[position]})`;
                        creationRepartitionQuery += `(NULL, ${idTRAJET},${listeVoitures[position]}, ${position}, ${selectionNbPlacesVoitureCouloirQuery},${selectionNbPlacesVoitureFenetreQuery}),`;
                    }
                    // On supprime la dernière virgule
                    creationRepartitionQuery = creationRepartitionQuery.slice(0,-1);
                    // On lance la query :
                    connection.query(creationRepartitionQuery, function(err){
                        if (err){
                            console.log(err);
                            connection.end();
                            return res.status(500).json({erreur:"Erreur serveur"});
                        } else {
                            // La répartition est créée, on renvoie l'id du trajet
                            connection.end();
                            return res.status(201).json({idTrajet:idTRAJET});
                        }
                    });
                }
            });
        }
    },
    searchVoiture : function(req,res){
        /*Fonction permettant à l'administateur de chercher l'ensemble des voitures disponibles un certain jour à une certaine gare
        Entrée : token admin (dans le header), date, idGare
        Sortie : idvoit, nbPlacesCouloir, nbPlacesFenetre, classeVoiture
        */
        // On checke si le token est valide et correspond à un admin
        responseToAdmin = adminChecker(req.headers['authorization']);
        if (responseToAdmin == 400){
            return res.status(400).json({'error':'token corrompu ou expiré'})
        }
        else if (responseToAdmin == 403){
            return res.status(403).json({'error':'Vous n\'avez pas les privilèges administrateurs. Accès refusé.'})
        } else {
            // Récupération des paramètres
            var idGare = req.body.gare;
            var configuration = config.development;
            var date = req.body.date;
            if (date == null || idGare == null){
                return res.status(400).json({'error' : 'Paramètres manquants ou incohérents. gare, date'});    
            }
            // Pour vérifier si une voiture est dispo, il faut que sa dernière arrivée corresponde à l'idGare,
            // Et que son prochain départ soit après la date demandée.
            // Ou qu'elle n'ait jamais fait de départ ou d'arrivée (si on vient de créer une voiture)
            // Lieu de la dernière arrivée :
            var selectionLieuDerniereArrivee = `SELECT gares.id
            FROM gares 
            JOIN trajets ON gares.id = trajets.idGAREARRIVEE
            JOIN repartitions ON repartitions.idTRAJET = trajets.id
            WHERE repartitions.idVOITURE = voits.id AND trajets.heure_depart < '${date}'
            ORDER BY trajets.heure_depart DESC
            LIMIT 1`
            // Nombre de dernières arrivées (si 0 alors ça supplantera la requête précédente)
            var nbLieuDerniereArrivee = `SELECT COUNT(*)
            FROM gares 
            JOIN trajets ON gares.id = trajets.idGAREARRIVEE
            JOIN repartitions ON repartitions.idTRAJET = trajets.id
            WHERE repartitions.idVOITURE = voits.id AND trajets.heure_depart < '${date}'
            ORDER BY trajets.heure_depart DESC`
            // Lieu prochain départ (si différent de l'id gare ça veut dire qu'elle est partie avant donc n'est pas dispo)
            var selectionLieuProchainDepart = `SELECT gares.id
            FROM gares 
            JOIN trajets ON gares.id = trajets.idGAREARRIVEE
            JOIN repartitions ON repartitions.idTRAJET = trajets.id
            WHERE repartitions.idVOITURE = voits.id AND trajets.heure_depart > '${date}'
            ORDER BY trajets.heure_depart ASC
            LIMIT 1`
            // Nombre de prochains départs (si 0 alors ça supplantera la requête précédente)
            var nbLieuProchainDepart = `SELECT COUNT(*)
            FROM gares 
            JOIN trajets ON gares.id = trajets.idGAREARRIVEE
            JOIN repartitions ON repartitions.idTRAJET = trajets.id
            WHERE repartitions.idVOITURE = voits.id AND trajets.heure_depart > '${date}'
            ORDER BY trajets.heure_depart ASC`
            // Requête principale
            selectionVoituresPresentesAUneDate = `SELECT voits.id as idvoit, voits.nb_places_couloir as nbPlacesCouloir,
            voits.nb_places_fenetre as nbPlacesFenetre, voits.classe as classeVoiture
            FROM voitures as voits
            WHERE ((${selectionLieuDerniereArrivee}) = ${idGare} OR (${nbLieuDerniereArrivee}) = 0 )
            AND ((${selectionLieuProchainDepart}) = ${idGare} OR (${nbLieuProchainDepart}) = 0 )`
            // Création de la connexion
            var connection = mysql.createConnection(configuration);
            connection.connect();
            // On effectue la query
            connection.query(selectionVoituresPresentesAUneDate,function(err, rows, fields){
            if (err){
                console.log(err);
                connection.end();
                return res.status(500).json({erreur:"Erreur serveur"});   
            } else {
                connection.end();
                // On renvoie l'ensemble des résultats de la requête
                return res.status(201).json(rows);
            }
            });


        }
    },
    searchTrain: function(req,res){
        /*
        Fonction permettant à l'administateur de chercher l'ensemble des trains, éventuellement d'un certain type (TGV, TER,...)
        Entrée : token admin (dans le header), typeTrain (optionnel), nbResultatsLimite(20 par défaut)
        Sortie : ensemble des éléments de la table trains (id, numéro, type)
        */
        // On checke si le token est valide et correspond à un admin
        responseToAdmin = adminChecker(req.headers['authorization']);
        if (responseToAdmin == 400){
            return res.status(400).json({'error':'token corrompu ou expiré'})
        }
        else if (responseToAdmin == 403){
            return res.status(403).json({'error':'Vous n\'avez pas les privilèges administrateurs. Accès refusé.'})
        } else {
            // Récupération des données
            var nbResultatsLimite = req.body.nbResultatsLimite || 20;
            // On transforme directement le typeTrain en subquery : si l'argument est undefined, alors on cherche tout
            var typeTrainSubquery = (req.body.typeTrain) ? `type = '${req.body.typeTrain}'` : `1`;
            var connection = mysql.createConnection(config.development);
            // On se connecte à la base
            connection.connect();
            connection.query(`SELECT * FROM trains WHERE ${typeTrainSubquery}
            LIMIT ${nbResultatsLimite}`,function(err, rows){
                if (err){
                    console.log(err);
                    connection.end();
                    return res.status(500).json({erreur:"Erreur serveur"});   
                } else {
                    connection.end();
                    // On renvoie l'ensemble des résultats.
                    return res.status(201).json(rows);
                }
            });
        }
    }
}
