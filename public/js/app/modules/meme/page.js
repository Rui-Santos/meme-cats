/**
 * page controller
 **/
define(['modules/meme/memegen', 'jquery', 'libs/modernizr'], function(MemeGen, $) {

    "use strict";

    var recap;

    function init(){
        if(Modernizr.canvas && Modernizr.canvastext){
            // create a new instance of Capit
            recap = new MemeGen($('#preview'), $('#srcimg')[0], 50);

            // set events to pass text to canvas
            $('#inputs').on('keyup', function(){
                var currentInput = $(this).find('input:focus'),
                whichInput = currentInput.is('#top-input') ? 'top' : 'bottom',
                val = currentInput.val() || ' ';

                recap.draw(whichInput, val);
            });

            $('#init-canvas').on('click', function(){
                recap.initCapit();
                $('#preview').show();
            });

            $('#change-image').on('click', function(){
                var img = new Image();
                img.src = $(this).attr('data-src');

                recap.changeImage(img);
            });

            // save capit to server
            $('#export-cap').on('click', function(e){
                e.preventDefault();

                // if already saving return
                if($(this).is('.saving, .saved')) {
                    return;
                }

                var capData = recap.exportCapit(),
                    saving = 'saving',
                    saved = 'saved',
                    done = 'done',
                    $elem = $(this),
                    $textElem = $elem.find('span'),
                    $cancelButton = $('#cancel-cap'),
                    $cancelTextElem = $cancelButton.find('span'),
                    buttonText = $textElem.text();

                // add show ids
                capData.airing_id = '_AIRING_ID';
                capData.ci_show_id = '_CI_SHOW_ID';
                capData.normal_url = '_NORMAL_IMAGE';
                capData.o_efeed_id = '_O_EFEED_ID';

                $('.recap-content').addClass(saving);
                $elem.addClass(saving);
                $textElem.text(saving + '…');

                // upload re-cap to server
                $.ajax({
                    type: 'POST',
                    url: '_BASE_URL' + 'on/save',
                    data: capData,
                    success: function(d){
                    var rsp = d,
                        share_url = '';

                    if(rsp.response.error && rsp.response.error.type === 'LOGIN_REQUIRED'){
                        // not logged in
                        $('#modal').modal();
                    }else if(rsp.response && rsp.response.response){
                        // successfull save
                        $('.recap-content').removeClass(saving);
                        $textElem.text(saved);
                        $elem.removeClass(saving).addClass(saved);
                        $cancelButton.addClass(done);
                        $cancelTextElem.text(done);
                        share_url = '_BASE_URL'+'on/frame/' + rsp.response.response.base62;

                        // hide the recap form
                        $('.recap-form-wrapper').hide();

                        // show the share view
                        $('.share-recap-wrapper').show();

                        // update the fb meta
                        $('meta[property|="og:image"]').attr('content', rsp.response.response.custom_url);
                        $('meta[property|="og:url"]').attr('content', share_url);

                        // // update the normal image
                        // _NORMAL_IMAGE = rsp.response.response.normal_url;
                        // // update custom image
                        // _CUSTOM_IMAGE = rsp.response.response.custom_url;
                        // // update the share url
                        // _SHARE_URL = share_url;

                        // move the share buttons
                        $('.share-container').addClass('transition');
                    }else{
                        // error
                        window.alert('an error occurred please try again');
                        $('.recap-content').removeClass(saving);
                        $elem.removeClass(saving);
                        $textElem.text(buttonText);
                    }
                }
                });
                return false;
            });
        }
    }

    return {
        initPage: init
    };
});