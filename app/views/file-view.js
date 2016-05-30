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
        // 'click button#new': 'changeTableHeader',
        // 'click button#cancel': 'changeTableHeaderBack',
        // 'click button#save': 'addItem'
    },
    files : [
        {"name": "file0"},
        {"name": "file1"},
        {"name": "file2"},
        {"name": "file3"},
        {"name": "file4"}
    ],

    initialize: function(){
        // files counter for the list
        this.counter = 0;
        // make mocks
        this.collection = new fileModel.FilesCollection();
        // this.collection.bind('add', this.renderItem());
        this.makeMocks();
        // not all views are self-rendering. This one is
        this.render();
    },

    render: function(){
        // add table header
        this.$el.find('#files-table-head').replaceWith(tableHeaderNormal());
        // render views for all items in collection
        for(var i = 0; i < this.collection.size(); i++){
            var itemId = this.collection.at(i).get('id');
            var itemName = this.collection.at(i).get('name');
            this.renderItem(itemId, itemName);
        }
        // set checkboxes listener
        this.checkboxListener();
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
            // this.changeTableHeaderBack();
        }
    },
    
    renderItem: function (item_id, item_name) {
        var string = newFileTemplate({ id: item_id, name: item_name});
        this.$el.find('tbody').append(string);
    },

    checkboxListener: function () {
        var $rename_btn = $('#rename'),
            $delete_btn = $('#delete'),
            $checkbox_all = $('#checkbox-all'),
            $tbody = $('tbody'),
            $all_rows = $tbody.find(':checkbox');

        // listener for main checkbox change
        $checkbox_all.on('change', function() {
            var $this = $(this);
            if($this.is(':checked')) {
                // if was checked then check all other
                $tbody.find(':checkbox').prop('checked', true).addClass('isChecked');
                // ..and set 'rename' and 'delete' buttons
                $rename_btn.removeClass('disabled').addClass('active');
                $delete_btn.removeClass('disabled').addClass('active');
            }
            else if ($this.not(":checked")) {
                // if was unchecked then uncheck all others..
                $tbody.find(':checkbox').prop('checked', false).removeClass('isChecked');
                // // ...and set 'rename' and 'delete' buttons
                $rename_btn.removeClass('active').addClass('disabled');
                $delete_btn.removeClass('active').addClass('disabled');
            }
        });

        // listener for row checkboxes change
        $tbody.find(':checkbox').on('change', function () {
            var $this = $(this);
            if ( $this.is(':checked') )
                $this.prop('checked', true).addClass('isChecked');
            else if ( $this.not(':checked') )
                $this.prop('checked', false).removeClass('isChecked');
            var checked_rows = $tbody.find(':checkbox:checked');
            // if all checkboxes are NOT selected..
            if ( checked_rows.length == 0 ) {
                // ..then just disable buttons
                $rename_btn.removeClass("active").addClass("disabled");
                $delete_btn.removeClass("active").addClass("disabled");
            }
            // if any checkbox is checked we have to do things and even check more...
            if ( checked_rows.length != 0 ) {
                // firstly enable buttons
                $rename_btn.removeClass('disabled').addClass('active');
                $delete_btn.removeClass('disabled').addClass('active');
                // then: check if all table rows checkboxes are checked...
                console.log("Lenght:" + $all_rows.length + " and checked:" + checked_rows.length);
                // ...so we can change main checkbox accordingly
                if ($all_rows.length == checked_rows.length)
                    $checkbox_all.prop('checked', true).addClass('isChecked');
                else
                    $checkbox_all.prop('checked', false).removeClass('isChecked');
            }
        });
    }
});
