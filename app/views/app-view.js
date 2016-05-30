var Backbone = require('backbone'),
    $ = require('jquery'),
    fileView = require('./file-view'),
    models = require('../models/file'),
    template = require('../templates/index.hbs');

Backbone.$ = $;

module.exports = Backbone.View.extend({
    
    initialize: function(){
        console.log('home init');
        this.render();
    },

    render: function(){
        var string = template();
        $('body').html(string);
        console.log('before render list-view from app-view');
        this.listView = new fileView();
        console.log('after render list-view from app-view');
        return this;
    }
});