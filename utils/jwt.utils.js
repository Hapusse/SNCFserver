//Imports
var jwt = require('jsonwebtoken');
//clef secrète
const JWT_SIGN_SECRET = "ipr958G>{?!+5`MOz?=kS$pyb($yDKt,6UgX?:I8,iSu!J?DVZu>=mINnbi2wg";

//Exported functions

module.exports = {
    generateTokenForUser: function(userData){
        return jwt.sign({
            userId: userData.id,
            isAdmin: userData.isAdmin,

            
        },JWT_SIGN_SECRET,
        {
            expiresIn: '1h'
        })
    },
    parseAuthorization: function(authorization){
        return (authorization != null) ? authorization.replace('Bearer ', '') :null;
    },
    getUserId: function(authorization){
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
        var isAdmin = 0;
        var token = module.exports.parseAuthorization(authorization);
        if (token != null){
            try{
                var jwtToken = jwt.verify(token,JWT_SIGN_SECRET);
                if (jwtToken != null){ userId = jwtToken.isAdmin; }
            }
            catch(err){}
            }
            return isAdmin;
    }
    }
