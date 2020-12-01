//Imports
//Fichier de contrôle des clients (les fonctions relatives aux données client sont ici)

var config = require('../config/config');
var bcrypt = require('bcrypt');
var jwtUtils = require('../utils/jwt.utils');
var mysql      = require('mysql');

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const PASSWORD_REGEX = /^.{4,255}$/

// Routes

module.exports = {
    register: function (req,res){
        //Params d'entrée:
        var email = req.body.email;
        var password = req.body.password;
        var prenom = req.body.prenom;
        var nom = req.body.nom;
        var date_naissance = req.body.date_naissance;
        var idREDUCTION = req.body.idREDUCTION || 1;
        console.log(idREDUCTION);
        if (email == null || password == null){
            return res.status(400).json({'error' : 'missing parameters'});    
        }
        if (!EMAIL_REGEX.test(email)){
            return res.status(400).json({'error' : 'Format d\'adresse mail invalide'});
        }
        if (!PASSWORD_REGEX.test(password)){
            return res.status(400).json({'error' : 'Mot de passe trop faible, veuillez rentrer un mot de passe d\'au moins 4 caractères.'});
        }
        var connection = mysql.createConnection(config.development);
        connection.connect();
        connection.query(`SELECT email FROM clients WHERE email ='${email}'`, function(err, rows, fields) {
            if (err){
                console.log(err);
                connection.end();
                return res.status(500).json({erreur:"Erreur serveur"});
            }
            if (rows[0] == undefined){
                bcrypt.hash(password,5,function(err,bcryptedPassword){
                    connection.query(`INSERT INTO clients (id, idREDUCTION, prenom, nom, date_naissance, email, password, isAdmin) VALUES
                    (NULL, ${idREDUCTION}, '${prenom}' ,'${nom}' , '${date_naissance}', '${email}', '${bcryptedPassword}', 0);`,function(err,rows,fields){
                        connection.end();
                        return res.status(201).json({status:'complete'});
                    });
            }
        );
            } else {
                connection.end();
                return res.status(409).json({'error':'Cet email est déjà associé à un compte'});
            }
            });
            
    },
    login: function(req,res){

        var email = req.body.email;
        var password = req.body.password;
        if (email == null || password == null){
            return res.status(400).json({'error':'Des paramètres sont manquants'});
        }
        var connection = mysql.createConnection(config.development);
        connection.connect();
        connection.query(`SELECT id,email,password,isAdmin FROM clients WHERE email ='${email}'`, function(err, rows, fields) {
            if (rows[0] != undefined){
                bcrypt.compare(password, rows[0].password, function(errBycrypt,resBycrypt){
                    if(resBycrypt){
                        connection.end();
                        return res.status(201).json({
                            'idClient':rows[0].id,
                            'token':jwtUtils.generateTokenForUser(rows[0])}
                        );
                    } else {
                        connection.end();
                        return res.status(403).json({'error' : 'Le mot de passe est invalide.'});
                    }
            });
            } else {
                connection.end();
                return res.status(404).json({'error' : 'L\' utilisateur n\'existe pas.'});
            }
        });       
    },
    getUserProfile: function(req,res){
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);
        if (userId < 0){
            return res.status(400).json({'error':'token corrompu ou expiré'})
        }
        var connection = mysql.createConnection(config.development);
        connection.connect();
        connection.query(`SELECT id,email,prenom,nom,date_naissance,isAdmin FROM clients WHERE id ='${userId}'`, function(err, rows, fields) {
            if (rows[0] != undefined){
                connection.end();
                return res.status(201).json(rows[0]);
            } else {
                connection.end();
                return res.status(404).json({'error':'L\'utilisateur indiqué est introuvable.'});
            }
        });
    },
    changePassword: function(req,res){
        //get Header auth
        
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);
        //get params
        var newPassword = req.body.newPassword;
        console.log(newPassword);
        if (newPassword == undefined){
            return res.status(400).json({'error':'newPassword est absent des paramètres appelés.'})
        }
        if (userId < 0){
            return res.status(400).json({'error':'token corrompu ou expiré'})
        }
        if (!PASSWORD_REGEX.test(newPassword)){
            return res.status(400).json({'error' : 'Mot de passe trop faible, veuillez rentrer un mot de passe d\'au moins 4 caractères.'});
        }
        // D'abord, vérifier que l'utilisateur existe, puis modifier son mdp
        var connection = mysql.createConnection(config.development);
        connection.connect();
        connection.query(`SELECT id FROM Clients WHERE id ='${userId}'`, function(err, rows, fields) {
            if (rows[0] == undefined){
                connection.end();
                return res.status(404).json({'error':'utilisateur non trouvé'});
            } else {
                bcrypt.hash(newPassword,5,function(err,bCryptedNewPassword){
                    connection.query(`UPDATE clients SET password = '${bCryptedNewPassword}' WHERE id = ${userId}`);
                    connection.end();
                    return res.status(201).json({'status':'complete'})
                })
            }
        });
    },
    getMyReservations: function(req,res){
         //get Header auth
         var headerAuth = req.headers['authorization'];
         var userId = jwtUtils.getUserId(headerAuth);
         if (userId < 0){
            return res.status(400).json({'error':'token corrompu ou expiré'})
        }
        var connection = mysql.createConnection(config.development);
        connection.connect();
        connection.query(`SELECT trajets.heure_depart AS heure_dep, trajets.heure_arrivee AS heure_arr, 
        Garedep.nom AS nomGareDepart, Garedep.ville AS villeGareDep, Garearr.nom AS nomGareArrivee, 
        Garearr.ville AS villeGareArrivee, billets.prix_billet AS prixBillet,
        places.numero_place AS numeroPlace, repartitions.positionDansTrain AS numeroVoiture, trains.numero AS nomTrain,
        trains.type AS typeTrain, voitures.classe AS classeReservation, billets.id AS idBillet
        FROM billets
        JOIN trajets ON trajets.id = billets.idTRAJET
        JOIN clients ON clients.id = billets.idCLIENT
        JOIN reductions ON reductions.id = clients.idREDUCTION
        JOIN places ON places.id = billets.idPLACE
        JOIN gares AS Garedep ON Garedep.id = trajets.idGAREDEPART
        JOIN gares AS Garearr ON Garearr.id = trajets.idGAREARRIVEE
        JOIN voitures ON voitures.id = places.idVOITURE
        JOIN trains ON trains.id = trajets.idTRAIN
        JOIN repartitions ON repartitions.idVOITURE = voitures.id AND repartitions.idTRAJET = trajets.id
        WHERE clients.id = ${idUser}
        GROUP BY billets.id
        ORDER BY heure_dep;`,function(err, rows, fields){
            if (err) {
                console.log(err);
                connection.end();
                return res.status(500).json({erreur:"Erreur serveur"});
            }
            connection.end()
            return res.status(201).json(rows);
        }
        )

    },
    cancelReservation: function(req,res){
        //get Header auth
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);
        //get params
        if (userId < 0){
           return res.status(400).json({'error':'token corrompu ou expiré'})
       }
       var idBillet = req.body.idBillet;
       if (idBillet == undefined){
           return res.status(400).json({'error':'idBillet non renseigné'})
       }
       var connection = mysql.createConnection(config.development);
       connection.connect();
       // Premièrement, vérifier que le trajet est bien réservé par l'utilisateur qui le demande
       // Ensuite, altérer le trajet pour que idClient = 1
       // Etape 1:
       connection.query(`SELECT billets.id WHERE billets.id = ${idBillet} AND billets.idCLIENT = ${userId}`,function(err,rows,fields){
           if (err){
               console.log(err);
               connection.end();
               return res.status(500).json({erreur:"Erreur serveur"});
           }
           if (rows[0] == undefined){
               connection.end();
               return res.status(404).json({erreur:"Réservation non trouvée sur cet utilisateur"});
           }    else    {
                // Le trajet est bien réservé par cet utilisateur.
                connection.query(`SELECT repartitions.id as idRepartition, places.cote_couloir as cotecouloir
                FROM billets
                JOIN places ON places.id = billets.idPLACE
                JOIN voitures ON voitures.id = places.idVOITURE
                JOIN repartitions ON billets.idTRAJET = repartitions.idTRAJET AND voitures.id = repartitions.idVOITURE
                `, function(err,rows, fields){
                    if (err){
                        console.log(err);
                        connection.end();
                        return res.status(500).json({erreur:"Erreur serveur"});
                    }
                    if (rows[0] == undefined){
                        connection.end();
                        return res.status(404).json({error : `Ce billet n'est lié à aucun trajet`})
                    } else {
                        var couloirfenetre = (rows[0].cotecouloir == 1) ? "couloir":"fenetre";
                        connection.query(`DELETE FROM billets WHERE id = ${idBillet}`);
                        connection.query(`UPDATE repartitions SET nb_places_${couloirfenetre} = nb_places_${couloirfenetre} + 1 WHERE id = ${rows[0].idRepartition}`);
                    }
                    
                });
           }
       });
       },
       newReservation: function(req,res){
        //get Header auth
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);
        //get params
        if (userId < 0){
           return res.status(400).json({'error':'token corrompu ou expiré'})
       }
       var idTrajet = req.body.idTrajet;
       var classeVoiture = req.body.classe;
       var isCouloir = req.body.isCouloir;
       var couloirfenetre = (isCouloir == 1) ? 'couloir':'fenetre';
       var idBillet = req.body.idBillet;
       if (idTrajet == undefined || classe == undefined || isCouloir == undefined){
           return res.status(400).json({'error':'Un argument est manquant (idTrajet ou classe ou isCouloir).'})
       }
       var connection = mysql.createConnection(config.development);
       connection.connect();
       connection.query(`SELECT Voitures.id as idVoiture
       FROM Trajets 
            JOIN Repartitions ON Repartitions.idTrajet = Trajets.id
            JOIN Voitures ON Voitures.id = Repartitions.idVoiture
        WHERE Trajets.id = ${idTrajet} AND Voitures.classe = ${classeVoiture} AND Repartitions.nb_places_${couloirfenetre} > 0
        LIMIT 1`,function(err, rows){
            if (err){
                console.log(err);
                connection.end();
                return res.status(500).json({erreur:"Erreur serveur"});
            }
            // On a récupéré toutes les voitures de même classe et de même situation couloir/fenetre que celle qu'on recherche.
            if (rows[0] == undefined){
                connection.end();
                return res.status(404).json({erreur:"Réservation non disponible"});
            }
            var idVoiture = rows[0].idVoiture;
            var coefficient_multiplicatif_classe = (classeVoiture == '1') ? 1.1:1
            queryPlacesReserveesVoiture = `SELECT Billets.idPlace
            FROM Billets
            JOIN Places ON Places.id = Billets.idPlace
            JOIN Voitures ON Voitures.id = Places.idVoiture
            WHERE Voitures.id = ${idVoiture} AND Places.cote_couloir = ${isCouloir}`;
            queryIdPlaceDisponible = `(SELECT Places.id
            FROM Places
            JOIN Voitures ON Voitures.id = Places.idVoiture
            WHERE Voitures.id = ${idVoiture} AND Places.id NOT IN (${queryPlacesReserveesVoiture})
            LIMIT 1)`; // On a l'id de la place disponible, manque le prix du billet
            queryPrixBillet = `(SELECT Trajets.prix_initial*(100-Reduction.pourcentage)*${coefficient_multiplicatif_classe}
            FROM Trajets
            JOIN Clients
            JOIN Reductions ON Reductions.id = Clients.idREDUCTION
            WHERE Trajets.id = ${idTrajet} AND Clients.id = ${userId}
            LIMIT 1;)` // Renvoie un résultat unique

            connection.query(`INSERT INTO Billets (id, idTrajet, idPlace, idCLIENT, prixBillet)
                                        VALUES (NULL, ${idTrajet},${queryIdPlaceDisponible},${userId},${queryPrixBillet});`,function(err){
                                            if (err){
                                                console.log(err);
                                                connection.end();
                                                return res.status(500).json({erreur:"Erreur serveur"});
                                            }
                                        });
            connection.query(`UPDATE Repartitions SET nb_places_${couloirfenetre} = nb_places_${couloirfenetre} - 1
            WHERE idTRAJET = ${idTrajet} AND idVOITURE = ${idVoiture}`)
            connection.end();
            return res.status(201).json({status:"ok"});
        
        });
       },
       changePersonnalData: function(req,res){
           //get Header auth
            var headerAuth = req.headers['authorization'];
            var userId = jwtUtils.getUserId(headerAuth);
            //get params
            if (userId < 0){
                return res.status(400).json({'error':'token corrompu ou expiré'})
            }
            var nom = req.body.nom;
            var prenom = req.body.prenom;
            var date_naissance = req.body.date_naissance;
            var idREDUCTION = req.body.idREDUCTION || 1;
            if (idBillet == undefined){
                return res.status(400).json({'error':'idBillet non renseigné'})
            }
            var connection = mysql.createConnection(config.development);
            connection.connect();
            connection.query(`SELECT prenom,nom,date_naissance,isAdmin FROM Clients WHERE id ='${userId}'`, function(rows,err,fields){
                if (err){
                    console.log(err);
                    connection.end();
                    return res.status(500).json({erreur:"Erreur serveur"});
                }
                if (rows[0] == undefined){
                    connection.end();
                    return res.status(404).json({erreur:"Utilisateur non trouvé"});
                }    else    {
                     // Il faut modifier les infos si elles ne sont pas définies (ou si on veut pour idREDUCTION)
                     var newNom = (rows[0].nom == "undefined") ? nom : rows[0].nom;
                     var newPrenom = (rows[0].prenom == "undefined") ? prenom : rows[0].prenom;
                     var newDateNaissance = (rows[0].date_naissance == '0000-00-00') ? date_naissance : rows[0].date_naissance;
                     var newIdReduction = idREDUCTION;
                     connection.query(`UPDATE Clients SET nom = '${newNom}', prenom = '${newPrenom}, date_naissance = '${newDateNaissance}', idREDUCTION = ${newIdReduction}  WHERE id = ${userId}`)
                    
                }
            })

       }

   }