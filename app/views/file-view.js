var
    Backbone = require('backbone'),
    $ = require('jquery'),
    _ = require('lodash'),
    // templates
    newFileTemplate = require('../templates/file_row.hbs'),
    tableHeaderNormal = require('../templates/table_head_normal.hbs'),
    tableHeaderNewfile = require('../templates/table_head_newfile.hbs'),
    // models
    fileModel = require('../models/file');

Backbone.$ = $;

module.exports = Backbone.View.extend({

    el: "#app",
    counter: 0,
    events: {
        'click button#new': 'changeTableHeader',
        'click button#cancel': 'changeTableHeaderBack',
        'click button#save': 'addItem'
    },
    files : [
        {"name": "file0"},
        {"name": "file1"},
        {"name": "file2"},
        {"name": "file3"}
    ],

    initialize: function(){
        // Files counter for the list
        this.counter = 0;
        // Make mocks
        this.collection = new fileModel.FilesCollection();
        // this.collection.bind('add', this.renderItem());
        this.makeMocks();
        // Not all views are self-rendering. This one is.
        this.render();
    },

    render: function(){
        // add table header
        this.$el.find('#files-table-head').replaceWith(tableHeaderNormal());

        // var string = newFileTemplate({ id: '0', name: 'example file'});
        // render views for all items in collection
        for(var i = 0; i < this.collection.size(); i++){
            var itemId = this.collection.at(i).get('id');
            var itemName = this.collection.at(i).get('name');
            this.renderItem(itemId, itemName);

        }
    },

    makeMocks: function () {
        var self = this;
        $.each(this.files, function(index, value){
            var item = new fileModel.File();
            item.set("id", index);
            item.set("name", value["name"]);
            self.collection.add(item);
            // console.log('Position: ' + index + ', this value: ' + value["name"]);
        });
    },
    
    changeTableHeader: function () {
        this.$el.find('#files-table-head').replaceWith(tableHeaderNewfile());
    },

    changeTableHeaderBack: function () {
        this.$el.find('#files-table-head').replaceWith(tableHeaderNormal());
    },

    addItem: function(){
        var input = this.$el.find('#filename').val();
        if(input) {
            this.counter = this.collection.size();
            // Add to collection
            var item = new fileModel.File();
            item.set("id",this.counter);
            item.set("name", input);
            this.collection.add(item);
            // Render view
            this.renderItem(this.counter, input);
            this.changeTableHeaderBack();
        }
    },
    
    renderItem: function (item_id, item_name) {
        var string = newFileTemplate({ id: item_id, name: item_name});
        this.$el.find('tr:last').after(string);
    }
});
