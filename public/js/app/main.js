require.config({
    paths: {
        "jquery": "https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min",
        "backbone": "https://cdnjs.cloudflare.com/ajax/libs/backbone.js/0.9.10/backbone-min",
        "lodash": "https://cdnjs.cloudflare.com/ajax/libs/lodash.js/1.0.0-rc.3/lodash.min"
    },
    shim: {
            'backbone': {
                //These script dependencies should be loaded before loading
                //backbone.js
                deps: ['lodash', 'jquery'],
                //Once loaded, use the global 'Backbone' as the
                //module value.
                exports: 'Backbone'
            }
    }
});

require(["jquery"], function() {
    //loaded all scripts
    "use strict";
    $(function() {

    });
});