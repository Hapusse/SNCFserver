//Imports
var jwt = require('jsonwebtoken');
//clef secrète
const JWT_SIGN_SECRET = "ipr958G>{?!+5`MOz?=kS$pyb($yDKt,6UgX?:I8,iSu!J?DVZu>=mINnbi2wg";

//Exported functions

// Fichier servant à l'exploitation des jwt_tokens:

module.exports = {
    generateTokenForUser: function(userData){
        // Permet de générer et de signer un token utilisateur grâce à la clef secrète. Le token expire 1h après avoir été généré
        return jwt.sign({
            userId: userData.id,
            isAdmin: userData.isAdmin,

            
        },JWT_SIGN_SECRET,
        {
            // On peut changer ce paramètre pour avoir des sessions plus longues.
            expiresIn: '1h'
        })
    },
    parseAuthorization: function(authorization){
        // Permet de lire le volet authorization du header pour le transformer en token
        return (authorization != null) ? authorization.replace('Bearer ', '') :null;
    },
    getUserId: function(authorization){
        // Prend en argument le volet authorization du header et renvoie l'id de l'utilisateur si le token n'est pas expiré.
        // Renvoie -1 si le token est corrompu ou expiré.
        var userId = -1;
        var token = module.exports.parseAuthorization(authorization);
        if (token != null){
            try{
                var jwtToken = jwt.verify(token,JWT_SIGN_SECRET);
                if (jwtToken != null){ userId = jwtToken.userId; }
            }
            catch(err){}
            }
            return userId;
        },
    getCredentials: function(authorization){
        // Vérifie si l'utilisateur est admin à partir du volet authorization du header.
        // Renvoie 0 si non admin et 1 si l'utilisateur est admin.
        var isAdmin = 0;
        var token = module.exports.parseAuthorization(authorization);
        if (token != null){
            try{
                var jwtToken = jwt.verify(token,JWT_SIGN_SECRET);
                if (jwtToken != null){ isAdmin = jwtToken.isAdmin; }
            }
            catch(err){}
            }
            return isAdmin;
    }
    }
