  var path    = require('path'),
      nconf = require('nconf');

  //
  // Setup nconf to use (in-order):
  //   1. Command-line arguments
  //   2. Environment variables
  //   3. A file located at 'path/to/env.json'
  //
  nconf.argv()
       .env()
       .file({ file: path.join(__dirname, '/env.json') });

var PORT = nconf.get('PORT') || 3000,
    FB_CID = nconf.get('FB_CID') || '',
    FB_SECRET = nconf.get('FB_SECRET') || '',
    TW_CID = nconf.get('TW_CID') || '',
    TW_SECRET = nconf.get('TW_SECRET') || '',
    MONGO_DB = nconf.get('MONGO_DB') || '',
    S3_ACCESSKEY = nconf.get('S3_ACCESSKEY') || '',
    S3_SECACCESSKEY = nconf.get('S3_SECACCESSKEY') || '';

module.exports = {
    development: {
      root: require('path').normalize(__dirname + '/..'),
      app: {
        name: 'wheres my stuff'
      },
      db: MONGO_DB,
      facebook: {
          clientID: FB_CID,
          clientSecret: FB_SECRET,
          callbackURL: 'http://dev.jsturgis.meme-cats.jit.su:'+PORT+'/auth/facebook/callback'
      },
      twitter: {
          clientID: TW_CID,
          clientSecret: TW_SECRET,
          callbackURL: 'http://dev.jsturgis.meme-cats.jit.su:'+PORT+'/auth/twitter/callback'
      },
      s3: {
        accessKey: S3_ACCESSKEY,
        secAccessKey: S3_SECACCESSKEY
      }
    },
    staging: {

    },
    production: {
      root: require('path').normalize(__dirname + '/..'),
      app: {
        name: 'wheres my stuff'
      },
      db: MONGO_DB,
      facebook: {
          clientID: FB_CID,
          clientSecret: FB_SECRET,
          callbackURL: 'http://jsturgis.meme-cats.jit.su/auth/facebook/callback'
      },
      twitter: {
          clientID: TW_CID,
          clientSecret: TW_SECRET,
          callbackURL: 'http://jsturgis.meme-cats.jit.su/auth/twitter/callback'
      },
      s3: {
        accessKey: S3_ACCESSKEY,
        secAccessKey: S3_SECACCESSKEY
      }
    }
};
