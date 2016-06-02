var Backbone = require('backbone'),
    $ = require('jquery')(window),

    File = Backbone.Model.extend({
        defaults: {
            id: "",
            name: ""
        },
        initialize: function() {
            console.log('new file created...');
        }
    }),

    FilesCollection = Backbone.Collection.extend({
        model: File,
        initialize: function () {
            console.log('Collection created..., collection size: ' + this.size());

            // This will be called when an item is added. pushed or unshifted
            this.on('add', function(model) {
                console.log('something got added to collection, collection size: ' + this.size());
            });
            // This will be called when an item is removed, popped or shifted
            this.on('remove',  function(model) {
                console.log('something got removed from collection, collection size: ' + this.size());
            });
            // This will be called when an item is updated
            this.on('change', function(model) {
                console.log('something got changed in collection');
            });
        }
    });

Backbone.$ = $;

module.exports = {
    File: File,
    FilesCollection: FilesCollection
};