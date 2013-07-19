var lastCacheClear = Date.now(),
    path = require('path'),
    http = require('http'),
    fs = require('fs');

// meme generator page
exports.meme = function(req, res){
  res.render('memes/meme', { title: 'meme' });
};

/**
 * Image proxy method takes a remote image url
 * and fetches it, this method also caches the file
 * on the server for 24 hours
 */
exports.imageProxy = function(req, res) {

    var imageUrl,
        cacheDir = __dirname + '/../public/data/cache',
        days = 1,
        cachedFiles,
        fileModifiedSinceHeader = res.get('If-Modified-Since'),
        cacheIsExpired = (Date.now() - lastCacheClear) > (days * (24 * 60 * 60 * 1000)),
        headerObj = {'content-type': 'image/jpeg',
                    'Cache-Control': 'public, max-age=86400',
                    'Expires': new Date(Date.now() + (86400 * 1000)).toString(),
                    'Last-Modified': new Date(Date.now()).toString()},
        filePath,
        cachedFiles,
        req;

    // check if the browser has a cached version
    // and return 304 if it does
    if(fileModifiedSinceHeader){
        headerObj['Last-Modified'] = fileModifiedSinceHeader;
        res.set(headerObj);
        res.send(304, null)
    }

    // get remote url
    imageUrl = req.params.imageUrl || '';

    // file path for local cache
    filePath = cacheDir + '/imagecache/image' + path.basename(imageUrl);

    // create the cache dir if it doesnt exist
    if (!fs.existsSync(cacheDir + '/imagecache/')) {
        fs.mkdirSync(cacheDir + '/imagecache/');
    }

    // get an array of cached files
    cachedFiles = fs.readdirSync(cacheDir + '/imagecache/')

    // empty the cache dir if it is expired or too many files are stored
    if (!lastCacheClear || cacheIsExpired || cachedFiles.length > 2000) {

        cachedFiles.forEach(function(path){
            fs.unlinkSync(cacheDir + '/imagecache/' + path);
        });

        lastCacheClear = Date.now();
    }

    // load from file system if file is in local cache
    if(fs.existsSync(filePath)) {
        fs.readFile(filePath, function(err, data){
            if (err) new error(err);
            res.set(headerObj);
            res.send(data);
        })
    } else {
        // load from remote host
        req = http.get(imageUrl, function(remoteRes) {

            var byteIndex = 0,
                contentLength = parseInt(remoteRes.headers['content-length'], 10),
                responseBody = new Buffer(contentLength);

            remoteRes.setEncoding('binary');

            remoteRes.on('data', function (chunk) {
                responseBody.write(chunk, byteIndex, 'binary');
                byteIndex += chunk.length;
            });

            remoteRes.on('end', function() {
                fs.writeFile(filePath , responseBody, function(err, resp){
                    if(err) res.send(err);
                });

                res.set(headerObj);
                res.send(responseBody);
            });

        }).on('error', function(e) {
            new error(e.message);
        });
    }
};