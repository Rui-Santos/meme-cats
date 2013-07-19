/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, browser:true, indent:4, maxerr:50 */
/*jslint browser: true, white: true */

/**
 * memegen module
 **/
define(function() {

    "use strict";

    return function(canvas, image, fontSize){

        // handle jquery objects being passed in
        canvas = canvas.jquery ? canvas[0] : canvas;
        image = image.jquery ? image[0] : image;
        fontSize = fontSize || 40;

        var ctx = canvas.getContext('2d'),
            inited = false,
            topText = '',
            bottomText = '',
            minFontSize = 25,
            bottomFontSize = fontSize,
            topFontSize = fontSize,
            fontFamily = 'impact,impac,impactregular',
            height = 0,
            width = 0,
            hPadding = 20,
            maxWidth = 0;

        function initCanvas(){

            height = image.naturalHeight;
            width = image.naturalWidth;

            maxWidth = width - hPadding;

            canvas.setAttribute('height', height);
            canvas.setAttribute('width', width);

            // canvas styles
            ctx.fillStyle = '#FFF';
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 6;
            ctx.font = fontSize + 'px ' + fontFamily;
            ctx.textAlign = 'center';
        }

        function setFontSize(size){
            ctx.font = size + 'px ' + fontFamily;
        }

        function adjustTopFontSize(adjustType){

            // set font size to the last value
            if(topText){
                setFontSize(topFontSize);
            }

            // if text was added we need to reduce text size
            if(adjustType === 'reduce'){
                // reduce font size until it fits or it is min size
                while(ctx.measureText(topText).width > maxWidth && topFontSize > minFontSize){
                    topFontSize = topFontSize - 1;
                    setFontSize(topFontSize);
                }
            }else if(adjustType === 'increase'){
                // increase font size as much as possible
                while(ctx.measureText(topText).width < maxWidth && topFontSize < fontSize ){
                    topFontSize = topFontSize + 1;
                    setFontSize(topFontSize);

                    // if a single pixel increase is too much reset and exit the loop
                    if(ctx.measureText(topText).width > maxWidth){
                        topFontSize = topFontSize - 1;
                        setFontSize(topFontSize);
                        return;
                    }
                }
            }
        }

        function adjustBottomFontSize(adjustType){

            // set font size to the last value
            if(bottomText){
                setFontSize(bottomFontSize);
            }

            // if text was added we need to reduce text size
            if(adjustType === 'reduce'){
                // reduce font size until it fits or it is min size
                while(ctx.measureText(bottomText).width > maxWidth && bottomFontSize > minFontSize){

                    bottomFontSize = bottomFontSize - 1;
                    setFontSize(bottomFontSize);
                }

            }else if(adjustType === 'increase'){
                // increase font size as much as possible
                while(ctx.measureText(bottomText).width < maxWidth && bottomFontSize < fontSize ){
                    bottomFontSize = bottomFontSize + 1;
                    setFontSize(bottomFontSize);

                    // if a single pixel increase is too much reset and exit the loop
                    if(ctx.measureText(bottomText).width > maxWidth){
                        bottomFontSize = bottomFontSize - 1;
                        setFontSize(bottomFontSize);
                        return;
                    }
                }
            }
        }

        // adjust font size to fit on a single line
        function adjustFontSize(textPosition, adjustType){

            // adjust the top font size
            if(textPosition === 'top'){

                adjustTopFontSize(adjustType);

            }else{
                // adjust the bottom font size
                adjustBottomFontSize(adjustType);

            }
        }

        // draw the string to the canvas with stoke and padding
        function drawText(textString, stringLocation, yAddition){

            yAddition = yAddition || 0;

            var x = width / 2,
                y = stringLocation === 'bottom' ? (height - 10) - yAddition : (topFontSize + 5) + yAddition;

            // stroke before fill so that the fill sits on top of the stoke
            // ARGS: text, x, y
            ctx.strokeText(textString, x, y, maxWidth);
            ctx.fillText(textString, x, y, maxWidth);
        }

        // split the string into two lines
        function splitLines(text, textLocation) {
            var words = text.split(' '),
                line = '',
                testLine = '',
                metrics = {},
                testWidth = 0,
                y = 30,
                lines = 0,
                lineSpace = 0,
                lineHeight = 30,
                n = 0;

            // loop each word to find the max line length
            for(n = 0; n < words.length; n+=1) {
                testLine = line + words[n] + ' ';
                metrics = ctx.measureText(testLine);
                testWidth = metrics.width;

                // max reached draw text line to canvas
                if(testWidth > maxWidth && !lines) {

                    lines+=1;

                    drawText(line, textLocation, textLocation === 'bottom' ? y : 0);
                    line = words[n] + ' ';
                    y += lineHeight;

                } else {
                    // last line truncate and don't render any more lines
                    if(lines && (testWidth > maxWidth)){
                        testLine = line.slice(0, line.length - 3) + '…';
                        drawText(testLine, textLocation, textLocation === 'bottom' ? 0 : lineHeight);
                        line = '';
                        return false;
                    }

                    line = testLine;
                }
            }

            // draw line
            if(line){

                if(lines){
                    lineSpace = lineHeight;
                }

                drawText(line, textLocation, textLocation === 'bottom' ? 0 : lineSpace);
            }
        }

        // public interface
        this.isInited = function(){
            return inited;
        };

        // init the canvas
        this.initCapit = function(){
            var that = this;

            if(!inited){

                // render the image when it loads
                // check if image has loaded
                if(image.naturalHeight){
                    inited = true;
                    initCanvas();
                    ctx.drawImage(image, 0, 0, width, height);
                }else{
                    image.addEventListener('load',function(){
                        that.initCapit();
                    },false);
                }
            }
        };

        this.resetCapit = function(){
            ctx.clearRect(0, 0, width, height);
            topText = '';
            bottomText = '';
            inited = false;
        };

        this.changeImage = function(newImage){
            this.resetCapit();
            image = newImage;
            this.initCapit();
        };

        //draw loop
        this.draw = function (whichInput, value) {

            var topSizeAdjustType = '',
                bottomSizeAdjustType = '',
                valLength = value.length;

            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(image, 0, 0, width, height);

            // set text val from input
            if(whichInput === 'top'){
                topSizeAdjustType = (valLength > topText.length) ? 'reduce' :
                                    ((valLength < topText.length) ? 'increase' : '');

                topText = value.toUpperCase() || topText;
            }else{
                bottomSizeAdjustType = (valLength > bottomText.length) ? 'reduce' :
                                    ((valLength < bottomText.length) ? 'increase' : '');

                bottomText = value.toUpperCase() || bottomText;
            }

            // draw the top
            adjustFontSize('top', topSizeAdjustType);

            // min font size reached split into lines
            if(topFontSize <= minFontSize){
                splitLines(topText, 'top');
            }else{
                drawText(topText, 'top');
            }

            // draw bottom second
            adjustFontSize('bottom', bottomSizeAdjustType);

            // min font size reached split into lines
            if(bottomFontSize <= minFontSize){
                splitLines(bottomText, 'bottom');
            }else{
                drawText(bottomText, 'bottom');
            }
        };

        this.exportCapit = function () {
            var dataURL = canvas.toDataURL('image/jpeg'),
                retData = {
                    imgData: dataURL,
                    topText: topText,
                    bottomText: bottomText
                };

            return retData;
        };
    };
});