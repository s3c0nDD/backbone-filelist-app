var
    Backbone = require('backbone'),
    $ = require('jquery'),
    _ = require('lodash'),
    // templates
    tableRowTemplate = require('../templates/file_row.hbs'),
    tableHeaderNormal = require('../templates/table_head_normal.hbs'),
    tableRowNewFile = require('../templates/file_row_newfile.hbs'),
    tableRowEditFile = require('../templates/file_row_editfile.hbs');

    // models
    fileModel = require('../models/file');

Backbone.$ = $;

module.exports = Backbone.View.extend({

    el: "#app",
    counter: 0,
    events: {
        'click button#new': 'addRowNewFile',
        'click button#save-new': 'addItemNewFile',
        'click button#cancel-new': 'removeRowNewFile',
        'click button#rename': 'editSelectedFiles',
        'click button#delete': 'deleteSelectedFiles'
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
    
    addRowNewFile: function () {
        var $tbody = this.$el.find('tbody'),
            $newfile_btn = $('#new');
        this.counter = this.collection.size();
        $( tableRowNewFile({ id: this.counter}) ).prependTo($tbody);
        $newfile_btn.removeClass("active").addClass("disabled");
        $('#filename-new').focus();
    },

    removeRowNewFile: function () {
        var $tbody = this.$el.find('tbody'),
            $newfile_btn = $('#new');
        $tbody.find('tr').first().remove();
        $newfile_btn.removeClass("disabled").addClass("active");
    },

    addItemNewFile: function(){
        var input = this.$el.find('#filename-new').val(),
            $tbody = this.$el.find('tbody'),
            $newfile_btn = $('#new');
        if (input) {
            this.counter = this.collection.size();
            // Add to collection
            var item = new fileModel.File();
            item.set("id",this.counter);
            item.set("name", input);
            this.collection.add(item);
            // Remove unnecessary first row
            $tbody.find('tr').first().remove();
            // Activate new folder button
            $newfile_btn.removeClass("disabled").addClass("active");
            // Render view
            this.renderItem(this.counter, input);
            // checkbox's listeners reset
            $tbody.find(':checkbox').off('change');
            this.checkboxListener();
        } else {
            alert("Write some name!");
        }
    },

    editSelectedFiles: function () {
        var $app = this,
            $tbody = this.$el.find('tbody'),
            $checkbox_all = $('#checkbox-all'),
            collection = this.collection,
            selectedCheckboxes = $tbody.find(":checkbox.isChecked");

        // replace templates for chosen rows
        selectedCheckboxes.each(function (index, value) {
            var $this = $(this),
                $table_row = $this.closest('tr'),           // template to replace
                index_edit = $this.attr('data-index'),      // index of model to edit
                item_to_edit = collection.at(index_edit),   // item from collection to edit
                item_id = item_to_edit.get("id"),
                item_name = item_to_edit.get("name"),
                string = tableRowEditFile({ id: item_id, name: item_name}); // edit template
            console.log("id: " + item_id + " name: " + item_name)
            console.log("EDIT data-index:" + index_edit);
            $table_row.replaceWith(string);
        });

        // set listeners for buttons
        var save_buttons = $tbody.find('button.save-edit'),
            cancel_buttons = $tbody.find('button.cancel-edit');
        // for save buttons save changes and reload non-editable template with fresh data
        save_buttons.on("click", function(){
            var $this = $(this),
                $table_row = $this.closest('tr'),
                index_edit =  $table_row.attr('data-index'),
                item_to_edit = collection.at(index_edit),
                item_id = item_to_edit.get("id"),
                new_filename = $table_row.find(':text').val(),
                string = tableRowTemplate({ id: item_id, name: new_filename});
            item_to_edit.set({'name': new_filename});
            $table_row.replaceWith(string);
            // checkbox's listeners reset
            $tbody.find(':checkbox').off('change');
            $app.checkboxListener();

        });
        // for cancel buttons get back earlier template
        cancel_buttons.on('click', function(){
            var $this = $(this),
                $table_row = $this.closest('tr'),
                index_edit =  $table_row.attr('data-index'),
                item_id = collection.at(index_edit).get("id"),
                item_name = collection.at(index_edit).get("name"),
                string = tableRowTemplate({ id: item_id, name: item_name});
            $table_row.replaceWith(string);
            // checkbox's listeners reset
            $tbody.find(':checkbox').off('change');
            $app.checkboxListener();
        });
    },

    deleteSelectedFiles: function () {
        var $tbody = this.$el.find('tbody'),
            selectedCheckboxes = $tbody.find(':checkbox.isChecked'),
            collection = this.collection;
        // if confirm dialog was said "ok"
        if (confirm('Are you sure you want to delete the selected files?') == true) {
            // delete each row with checkbox checked
            selectedCheckboxes.each(function (i, val) {
                var $this = $(this),
                    $table_row = $this.closest('tr');
                $table_row.remove();
                // remember to get TRUE(!) index of item collection to remove..
                var index_remove = $this.attr('data-index'),  // ..which is "data-index" of checkbox
                    item_to_remove = collection.at(index_remove);
                console.log('removed id['+index_remove+'] name: '
                    + collection.at(index_remove).get('name'));
                item_to_remove.trigger('destroy', item_to_remove);
            });
            // console.log( "Collection size now: " + collection.size());
            this.counter = this.collection.size();
            // correct remaining checkboxes...
            var allCheckboxes = $tbody.find(':checkbox');
            // by setting attr 'data-index' (in reversed order 'cause on html they're upside down)
            $(allCheckboxes.get().reverse()).each(function (i, val) {
                $(this).attr('data-index', i);
            });
            // ...and correct models ids
            for(var i = 0; i < this.collection.size(); i++) {
                collection.at(i).set({'id': i });
                console.log('collection['+i+"]: " + collection.at(i).get('name'));
            }
            // checkbox's listeners reset
            $tbody.find(':checkbox').off('change');
            this.checkboxListener();
        }
    },
    
    renderItem: function (item_id, item_name) {
        var string = tableRowTemplate({ id: item_id, name: item_name}),
            $tbody = this.$el.find('tbody');
        $(string).prependTo($tbody);
    },

    checkboxListener: function () {
        var 
            $checkbox_all = $('#checkbox-all'),
            $tbody = $('tbody'),
            $all_rows = $tbody.find(':checkbox'),
            $rename_btn = $('#rename'),
            $delete_btn = $('#delete');

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
            var $this = $(this),
                checked_rows = $tbody.find(':checkbox:checked');
            if ( $this.is(':checked') )
                $this.prop('checked', true).addClass('isChecked');
            else if ( $this.not(':checked') )
                $this.prop('checked', false).removeClass('isChecked');
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
                console.log("Length:" + $all_rows.length + " and checked:" + checked_rows.length);
                // ...so we can change main checkbox accordingly
                if ($all_rows.length == checked_rows.length)
                    $checkbox_all.prop('checked', true).addClass('isChecked');
                else
                    $checkbox_all.prop('checked', false).removeClass('isChecked');
            }
        });
    }
});
