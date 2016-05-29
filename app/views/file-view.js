var
    Backbone = require('backbone'),
    $ = require('jquery'),
    _ = require('lodash');

Backbone.$ = $;

module.exports = Backbone.View.extend({

    // template: template,
    el: "#app",

    events: {
        'click button#new': 'addItem'
    },

    initialize: function(){
        // Files counter for the list
        this.counter = 0;
        // Not all views are self-rendering. This one is.
        this.render();
    },

    render: function(){
        // Injected html
        var string =
            '<tr>' +
            '<td><input type="checkbox" value="">' +
            '</td><td>File added with startup render</td>' +
            '</tr>';
        // Inject html
        this.$el.find('tr:last').after(string);
    },

    addItem: function(){
        // injected html
        var string =
            '<tr>' +
            '<td><input type="checkbox" value="">' +
            '</td><td>File added with button click</td>' +
            '</tr>';
        // Counter increment and inject HTML
        this.counter++;
        this.$el.find('tr:last').after(string);
    }
});
