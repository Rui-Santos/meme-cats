
var env = process.env.NODE_ENV || 'development',
	config = require('../../config/config')[env],
	s3 = require('aws2js').load('s3', config.s3.accessKey, config.s3.secAccessKey);

module.exports = {
	putImage: function(fileName, path, permissions, cb){

		var callback = cb || function(){};
		// uploads the file into the bucket with public-read access
		s3.setBucket('wms-assets');
		s3.putFile(fileName, path, permissions, {}, callback);
	}	
};