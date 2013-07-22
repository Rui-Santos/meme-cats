describe('meme test', function(){
  var MemeGen = require('modules/meme/memegen');

  	var canvas = document.createElement('canvas'),
  		memegen,
  		img = new Image();

  	img.src = '/public/images/meme/testimage.jpg';
	canvas.id = 'testCanvas';

  	document.body.appendChild(canvas);
  	document.body.appendChild(img);

	memegen = new MemeGen(canvas, img);
	memegen.initCapit();

    it('should init successfully', function(){
		expect(memegen.isInited()).toBe(true);
    });
});