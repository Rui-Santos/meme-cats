var PORT = process.env.PORT || 3000,
    FB_CID = process.env.FB_CID || '',
    FB_SECRET = process.env.FB_SECRET || '',
    TW_CID = process.env.TW_CID || '',
    TW_SECRET = process.env.TW_SECRET || '',
    GH_CID = process.env.GH_CID || '',
    GH_SECRET = process.env.GH_SECRET || '';

module.exports = {
    development: {
      root: require('path').normalize(__dirname + '/..'),
      app: {
        name: 'wheres my stuff'
      },
      db: 'mongodb://stuffApp:stuff@staff.mongohq.com:10051/app1170127',
      facebook: {
          clientID: FB_CID
        , clientSecret: FB_SECRET
        , callbackURL: 'http://localhost:'+PORT+'/auth/facebook/callback'
      },
      twitter: {
          clientID: TW_CID
        , clientSecret: TW_SECRET
        , callbackURL: 'http://localhost:'+PORT+'/auth/twitter/callback'
      },
      github: {
          clientID: GH_CID
        , clientSecret: GH_SECRET
        , callbackURL: 'http://localhost:'+PORT+'/auth/github/callback'
      }
    }
  , test: {

    }
  , production: {

    }
}
