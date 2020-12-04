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
        /* Fonction permettant de s'enregistrer
        Entrée :
        email (format str email),
        mdp (plus de 4 caractères),
        prenom,
        nom,
        date de naissance (format : "AAAA-MM-JJ")
        idREDUCTION (integer)

        Sortie :
        message de succès ou d'erreur
        */
        //Params d'entrée:
        var email = req.body.email;
        var password = req.body.password;
        var prenom = req.body.prenom;
        var nom = req.body.nom;
        var date_naissance = req.body.date_naissance || '0000-00-00';
        var idREDUCTION = req.body.idREDUCTION || 1;
        console.log(idREDUCTION);
        // Si l'un des paramètres email ou password est vide, on renvoie un message d'erreur
        if (email == null || password == null){
            return res.status(400).json({'error' : 'missing parameters'});    
        }
        // Si l'email n'est pas au format email, on renvoie un message d'erreur
        if (!EMAIL_REGEX.test(email)){
            return res.status(400).json({'error' : 'Format d\'adresse mail invalide'});
        }
        // Si le password a moins de 4 caractères, on renvoie un message d'erreur
        if (!PASSWORD_REGEX.test(password)){
            return res.status(400).json({'error' : 'Mot de passe trop faible, veuillez rentrer un mot de passe d\'au moins 4 caractères.'});
        }
        //Création de la connexion
        var connection = mysql.createConnection(config.development);
        connection.connect();
        connection.query(`SELECT email FROM clients WHERE email ='${email}'`, function(err, rows, fields) {
            //On vérifie si le mail n'est pas déjà attribué
            if (err){
                console.log(err);
                connection.end();
                return res.status(500).json({error:"Erreur serveur"});
            }
            if (rows[0] == undefined){
                // Le mail n'est pas attribué
                bcrypt.hash(password,5,function(err,bcryptedPassword){
                    // On crypte le mot de passe dans la BDD
                    connection.query(`INSERT INTO clients (id, idREDUCTION, prenom, nom, date_naissance, email, password, isAdmin) VALUES
                    (NULL, ${idREDUCTION}, '${prenom}' ,'${nom}' , '${date_naissance}', '${email}', '${bcryptedPassword}', 0);`,function(err,rows,fields){
                        if (err){
                            console.log(err);
                            connection.end();
                            return res.status(500).json({error:"Erreur serveur"});
                        }
                        connection.end();
                        return res.status(201).json({status:'complete'});
                    });
            }
        );
            } else {
                // Dans ce cas le mail est déjà attribué à un compte. On renvoie une erreur.
                connection.end();
                return res.status(409).json({'error':'Cet email est déjà associé à un compte'});
            }
            });
            
    },
    login: function(req,res){
        /*Fonction permettant de s'authentifier (login)
        Entrée : email, password
        Sortie : idUser, token (jeton d'identification crypté valable 1h permettant de s'assurer de l'identité de l'utilisateur)
        
        */
       //Récupération des paramètres d'entrée
        var email = req.body.email;
        var password = req.body.password;
        // Si l'un des paramètres email ou password est vide, on renvoie un message d'erreur
        if (email == null || password == null){
            return res.status(400).json({'error':'Des paramètres sont manquants'});
        }
        //création de la connexion
        var connection = mysql.createConnection(config.development);
        connection.connect();
        // Requête pour vérifier l'utilisateur et permettre de renvoyer les bons paramètres dans la réponse et le token
        connection.query(`SELECT id,email,password,isAdmin FROM clients WHERE email ='${email}'`, function(err, rows, fields) {
            
            if (rows[0] != undefined){
                bcrypt.compare(password, rows[0].password, function(errBycrypt,resBycrypt){
                    //On compare le mdp crypté avec le mdp renvoyé par l'utilisateur qu'on crypte
                    if(resBycrypt){
                        // S'il correspond, on renvoie les bons paramètres
                        connection.end();
                        return res.status(201).json({
                            'idClient':rows[0].id,
                            'token':jwtUtils.generateTokenForUser(rows[0])}
                        );
                    } else {
                        // Sinon, erreur 403
                        connection.end();
                        return res.status(403).json({'error' : 'Le mot de passe est invalide.'});
                    }
            });
            } else {
                // On n'a pas trouvé de résultat donc l'utilisateur est invalide.
                connection.end();
                return res.status(404).json({'error' : 'L\' utilisateur n\'existe pas.'});
            }
        });       
    },
    getUserProfile: function(req,res){
        /*Fonction permettant de récupérer les informations de son profil
        Entrée : le token d'identification, dans l'entête "authorization" du Header au format "Bearer " + jwt_token
        Sortie : id,email, prenom, nom, date_naissance, isAdmin de l'utilisateur
        
        */
       //On vérifie que le token de l'utilisateur est valide, cf utils/jwt.utils.js
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);
        if (userId < 0){
            // Il n'est pas valide
            return res.status(400).json({'error':'token corrompu ou expiré'})
        }
        // Création de la connexion
        var connection = mysql.createConnection(config.development);
        connection.connect();
        // On dump les infos utiles de la base clients
        connection.query(`SELECT id,email,prenom,nom,date_naissance,isAdmin,idREDUCTION FROM clients WHERE id ='${userId}'`, function(err, rows, fields) {
            if (rows[0] != undefined){
                // On a trouvé un résultat donc on le renvoie
                connection.end();
                return res.status(201).json(rows[0]);
            } else {
                // On n'a rien trouvé, ce qui est très étrange si le token de l'utilisateur est valide.
                connection.end();
                return res.status(404).json({'error':'L\'utilisateur indiqué est introuvable.'});
            }
        });
    },
    changePassword: function(req,res){
        /*Fonction permettant de changer son mot de passe
        Entrée : token (dans le header), newPassword
        Sortie : Message de succès ou d'erreur
        
        */
       //Récupération des paramètres d'entrée
        //get Header auth
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);
        //get params
        var newPassword = req.body.newPassword;
        // Différentes erreurs possibles :
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
        // On cherche le user
        connection.query(`SELECT id FROM Clients WHERE id ='${userId}'`, function(err, rows, fields) {
            if (rows[0] == undefined){
                // Rien n'est renvoyé donc message d'erreur
                connection.end();
                return res.status(404).json({'error':'utilisateur non trouvé'});
            } else {
                bcrypt.hash(newPassword,5,function(err,bCryptedNewPassword){
                    // On a trouvé l'utilisateur, on change son mdp.
                    connection.query(`UPDATE clients SET password = '${bCryptedNewPassword}' WHERE id = ${userId}`);
                    connection.end();
                    return res.status(201).json({'status':'complete'})
                })
            }
        });
    },
    getMyReservations: function(req,res){
        /*Fonction permettant à l'utilisateur de check ses réservations
        Entrée : token (dans le header)
        Sortie : heure_dep, heure_arr, nomGareDepart, villeGareDep,nomGareArrivee, villeGareArrivee, prixBillet, numeroPlace,
        numeroVoiture, nomTrain, typeTrain (TGV,TER...), classeReservation (1 ou 2), idBillet
        */
       //Récupération des paramètres d'entrée
         //get Header auth
         var headerAuth = req.headers['authorization'];
         
         var userId = jwtUtils.getUserId(headerAuth);
         if (userId < 0){
             // Utilisateur valide ?
            return res.status(400).json({'error':'token corrompu ou expiré'})
        }
        // On se connecte
        var connection = mysql.createConnection(config.development);
        connection.connect();
        // On dump une grande quantité d'informations de différentes bases, d'où le nombre de jointures importantes (mais nécessaires)
        connection.query(`SELECT trajets.heure_depart AS heure_dep, trajets.heure_arrivee AS heure_arr, 
        Garedep.nom AS nomGareDepart, Garedep.ville AS villeGareDep, Garearr.nom AS nomGareArrivee, 
        Garearr.ville AS villeGareArrivee, billets.prix_billet/100 AS prixBillet,
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
        WHERE clients.id = ${userId}
        GROUP BY billets.id
        ORDER BY heure_dep;`,function(err, rows, fields){
            if (err) {
                console.log(err);
                connection.end();
                return res.status(500).json({error:"Erreur serveur"});
            }
            connection.end()
            // Si on trouve des billets on renvoie toutes les infos ci-dessus
            return res.status(201).json(rows);
        }
        )

    },
    cancelReservation: function(req,res){
        /*Fonction permettant à l'utilisateur d'annuler une réservation
        Entrée : token (dans le header), idBillet (celui à supprimer)
        Sortie : 
        */
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
       // Création connexion
       var connection = mysql.createConnection(config.development);
       connection.connect();
       // Premièrement, vérifier que le trajet est bien réservé par l'utilisateur qui le demande
       connection.query(`SELECT billets.id FROM billets WHERE billets.id = ${idBillet} AND billets.idCLIENT = ${userId}`,function(err,rows,fields){
           if (err){
               console.log(err);
               connection.end();
               return res.status(500).json({error:"Erreur serveur"});
           }
           if (rows[0] == undefined){
               // Pas de résultat de retour
               connection.end();
               return res.status(404).json({error:"Réservation non trouvée sur cet utilisateur"});
           }    else    {
                // Le trajet est bien réservé par cet utilisateur. On cherche ensuite à quelle répartition était lié ce billet et s'il était côté couloir ou fenêtre
                connection.query(`SELECT repartitions.id as idREPARTITION, places.cote_couloir as cotecouloir
                FROM billets
                JOIN places ON places.id = billets.idPLACE
                JOIN voitures ON voitures.id = places.idVOITURE
                JOIN repartitions ON billets.idTRAJET = repartitions.idTRAJET AND voitures.id = repartitions.idVOITURE
                `, function(err,rows, fields){
                    if (err){
                        console.log(err);
                        connection.end();
                        return res.status(500).json({error:"Erreur serveur"});
                    }
                    if (rows[0] == undefined){
                        // Pas censé arriver mais ça voudrait dire qu'il y a un problème dans les clefs étrangères
                        connection.end();
                        return res.status(404).json({error : `Ce billet n'est lié à aucun trajet`})
                    } else {
                        // On supprime le billet et on incrémente le nombre de places dispo côté couloir/fenetre de 1.
                        var couloirfenetre = (rows[0].cotecouloir == 1) ? "couloir":"fenetre";
                        connection.query(`DELETE FROM billets WHERE id = ${idBillet}`);
                        connection.query(`UPDATE repartitions SET nb_places_${couloirfenetre} = nb_places_${couloirfenetre} + 1 WHERE id = ${rows[0].idREPARTITION}`);
                        connection.end();
                        return res.status(201).json({status : `complete`})
                    }
                    
                });
           }
       });
       },
       newReservation: function(req,res){
        /*Fonction permettant à l'utilisateur de réserver un nouveau trajet. 
        Le billet lui est automatiquement attribué en fonction de ses choix de couloir/fenetre ou de classe de voiture.
        Entrée : token (dans le header), idTrajet, classeVoiture, isCouloir
        Sortie : 
        */
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
       // Si les paramètres sont non renseignés on renvoie une erreur
       if (idTrajet == undefined || classeVoiture == undefined || isCouloir == undefined){
           return res.status(400).json({'error':'Un argument est manquant (idTrajet ou classe ou isCouloir).'})
       }
       // Création de la connexion
       var connection = mysql.createConnection(config.development);
       connection.connect();
       // On regarde s'il y a des places disponibles dans les spécifications de classe et de côté demandées :
       connection.query(`SELECT voitures.id as idVoiture
       FROM trajets 
            JOIN repartitions ON repartitions.idTRAJET = trajets.id
            JOIN voitures ON voitures.id = repartitions.idVOITURE
        WHERE trajets.id = ${idTrajet} AND voitures.classe = ${classeVoiture} AND repartitions.nb_places_${couloirfenetre} > 0
        LIMIT 1`,function(err, rows){
            if (err){
                console.log(err);
                connection.end();
                return res.status(500).json({error:"Erreur serveur"});
            }
            // On a récupéré la première voiture dans laquelle il y a des places.
            if (rows[0] == undefined){
                // Si on ne récupère aucun résultat ça veut dire que c'est complet.
                connection.end();
                return res.status(404).json({error:"Réservation non disponible"});
            }
            var idVoiture = rows[0].idVoiture;
            // Choix empirique : un billet en première coûte 10% plus cher qu'un billet en seconde classe.
            var coefficient_multiplicatif_classe = (classeVoiture == '1') ? 1.1:1
            // On va effectuer une grosse requête plusieurs fois imbriquer.
            // Il faut récupérer l'ensemble des places déjà prises
            queryPlacesReserveesVoiture = `SELECT bil.idPLACE
            FROM (SELECT * FROM billets) AS bil
            JOIN places ON places.id = bil.idPLACE
            JOIN voitures ON voitures.id = places.idVOITURE
            WHERE voitures.id = ${idVoiture} AND places.cote_couloir = ${isCouloir}`;
            // Pour pouvoir déterminer l'id d'une place disponible
            queryIdPlaceDisponible = `(SELECT places.id
            FROM places
            JOIN voitures ON voitures.id = places.idVOITURE
            WHERE voitures.id = ${idVoiture} AND places.id NOT IN (${queryPlacesReserveesVoiture})
            LIMIT 1)`;
            // On récupère le prix du billet
            queryPrixBillet = `(SELECT trajets.prix_initial*(100-reductions.pourcentage)/100*${coefficient_multiplicatif_classe}
            FROM trajets
            JOIN clients
            JOIN reductions ON reductions.id = clients.idREDUCTION
            WHERE trajets.id = ${idTrajet} AND clients.id = ${userId}
            LIMIT 1)`
            // On crée une nouvelle réservation avec les spécifications ci-dessus :
            connection.query(`INSERT INTO billets (id, idTRAJET, idPLACE, idCLIENT, prix_billet)
                                        VALUES (NULL, ${idTrajet},${queryIdPlaceDisponible},${userId},${queryPrixBillet});`,function(err){
                                            if (err){
                                                console.log(err);
                                                connection.end();
                                                return res.status(500).json({error:"Erreur serveur"});
                                            }
                                        });
            // Finalement, on décrémente le nombre de places disponibles.
            connection.query(`UPDATE repartitions SET nb_places_${couloirfenetre} = nb_places_${couloirfenetre} - 1
            WHERE idTRAJET = ${idTrajet} AND idVOITURE = ${idVoiture}`)
            connection.end();
            return res.status(201).json({status:"ok"});
        
        });
       },
       changePersonnalData: function(req,res){
        /*Fonction permettant à l'utilisateur de changer certaines données
        Entrée : token (dans le header), email (optionnel), idREDUCTION (optionnel)
        Sortie : Message de succès ou d'erreur
        */
           //get Header auth
            var headerAuth = req.headers['authorization'];
            var userId = jwtUtils.getUserId(headerAuth);
            //get params
            if (userId < 0){
                return res.status(400).json({'error':'token corrompu ou expiré'})
            }
            var email = req.body.email;
            var idREDUCTION = req.body.idREDUCTION || 1;
            var connection = mysql.createConnection(config.development);
            connection.connect();
            connection.query(`SELECT id,email FROM clients WHERE id =${userId}`, function(err,rows,fields){
                if (err){
                    console.log(err);
                    connection.end();
                    return res.status(500).json({error:"Erreur serveur"});
                }
                if (rows[0] == undefined){
                    connection.end();
                    return res.status(404).json({error:"Utilisateur non trouvé"});
                }    else    {
                     // Il faut modifier les infos si elles ne sont pas définies (ou si on veut pour idREDUCTION)
                     var newEmail = (email == "undefined") ? rows[0].email : email;
                     if(!EMAIL_REGEX.test(newEmail)){
                        return res.status(400).json({'error' : 'Format d\'adresse mail invalide'});
                     }
                     // Il faut vérifier si le nouveau mail n'est pas déjà pris :
                     connection.query(`SELECT email FROM clients WHERE email ='${email}' AND NOT(id = ${userId})`, function(err, rows, fields) {
                        if (err){
                            console.log(err);
                            connection.end();
                            return res.status(500).json({error:"Erreur serveur"});
                        }
                        if (rows[0] == undefined){
                            // Le mail n'est pas attribué
                            connection.query(`UPDATE clients SET email = '${newEmail}' WHERE id = ${userId}`);
                        } else {
                            // Dans ce cas le mail est déjà attribué à un autre compte. On renvoie une erreur.
                            connection.end();
                            return res.status(409).json({'error':'Cet email est déjà associé à un autre compte'});
                        }
                     var newIdReduction = idREDUCTION;
                     connection.query(`UPDATE clients SET idREDUCTION = ${newIdReduction} WHERE id = ${userId}`)
                     connection.end();
                     return res.status(201).json({status:"Complete"});
                });
            }
        });

       },
       searchGares: function(req,res){
        /*Fonction permettant à l'utilisateur de charger l'ensemble des gares
        Entrée : Aucune
        Sortie : liste d'id, nom, ville
        */
        // On se connecte
        var connection = mysql.createConnection(config.development);
        connection.connect();
        //On dump la table gares
        connection.query(`SELECT id,nom,ville FROM gares`, function(err,rows,fields){
            if (err){
                console.log(err);
                connection.end();
                return res.status(500).json(err);
            }
            connection.end();
            // On renvoie le résultat
            return res.status(201).json(rows);
       });
    },
    searchReductions : function(req,res){
        /*Fonction permettant à l'utilisateur de charger l'ensemble des réductions
        Entrée : Aucune
        Sortie : éléments de la table reductions
        */
       // On se connecte
        var connection = mysql.createConnection(config.development);
        connection.connect();
        // On dump la table reductions
        connection.query(`SELECT * FROM reductions`, function(err,rows,fields){
            if (err){
                console.log(err);
                connection.end();
                return res.status(500).json(err);
            }
            connection.end();
            // On renvoie le résultat
            return res.status(201).json(rows);
       });
    },
    searchTrajets: function(req,res){
        /*Fonction permettant à l'utilisateur de charger les données intéressantes d'un trajet
        Entrée : jourTrajet, idGareDepart, idGareArrivee
        Sortie : idTrajet, nomGareDepart, villeGareDepart, nomGareArrivee, villeGareArrivee,heureDepart, heureArrivee, prixSansReduction,
        nb_places_couloir_1,nb_places_couloir_2,nb_places_fenetre_1,nb_places_fenetre_2, type (train) 
        */
       // Récupération des données
        var jourTrajet = req.body.jourTrajet;
        var idGareDepart = req.body.idGareDepart;
        var idGareArrivee = req.body.idGareArrivee;
        // Check des arguments manquants
        if (jourTrajet == undefined || idGareDepart == undefined || idGareArrivee == undefined){
            return res.status(400).json({'error':'Un argument est manquant (jourTrajet ou idGareDepart ou idGareArrivee).'})
        }
        var connection = mysql.createConnection(config.development);
        // Le point délicat de cette fonction est la détermination du nombre de places dispo côté couloir ou fenetre en classe 1 ou 2
        // On n'a en effet accès aux places dispo couloir/fenetre dans la table répartitions, 
        //qu'on doit donc sommer sur l'ensemble des voitures de classe 1 ou 2
        // On utilise donc des requêtes imbriquées

        queryCouloirFenetre12 = function(isCouloir, classe){
            // Permettra d'écrire la chaîne de caractère correspondant à la sous-requête renvoyant le nombre de places dispo par catégorie
            var couloirFenetre = (isCouloir) ? "couloir" : "fenetre";
            return `(SELECT SUM(repartitions.nb_places_${couloirFenetre}) FROM repartitions
            JOIN voitures ON repartitions.idVOITURE = voitures.id WHERE repartitions.idTRAJET = idTrajet AND voitures.classe = ${classe})`;
        }
        // La query principale
        var querySearchTrajets = `SELECT trajets.id as idTrajet, Garedep.nom as nomGareDepart, Garedep.ville as villeGareDepart,
        Garearr.nom as nomGareArrivee, Garearr.ville as villeGareArrivee, trajets.heure_depart as heureDepart,
        trajets.heure_arrivee as heureArrivee, trajets.prix_initial/100 as prixSansReduction, ${queryCouloirFenetre12(true, 1)} as nb_places_couloir_1,
        ${queryCouloirFenetre12(false, 1)} as nb_places_fenetre_1, ${queryCouloirFenetre12(true, 2)} as nb_places_couloir_2, ${queryCouloirFenetre12(false, 2)} as nb_places_fenetre_2,
        trains.type
        FROM trajets
        JOIN gares AS Garedep ON Garedep.id = trajets.idGAREDEPART
        JOIN gares AS Garearr ON Garearr.id = trajets.idGAREARRIVEE
        JOIN trains ON trains.id = trajets.idTRAIN
        WHERE idGAREDEPART = ${idGareDepart} AND idGAREARRIVEE = ${idGareArrivee} AND DATE(trajets.heure_depart) = '${jourTrajet}'
        GROUP BY idTrajet`
        // On a écrit la fonction, reste à se connecter et à la lancer
        connection.connect();
        connection.query(querySearchTrajets, function(err,rows,fields){
            if (err){
                console.log(err);
                connection.end();
                return res.status(500).json(err);
            }
            connection.end();
            return res.status(201).json(rows);
       });
    }
}