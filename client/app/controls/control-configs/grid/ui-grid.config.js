define(function () {
    var _options = {};
    _options.configs = {
        'ui-grid-edit': false,
        'ui-grid-validate':false,
        'ui-grid-treeView':false,
        'ui-grid-treeBase':false,
        'ui-grid-selection':false,
        'ui-grid-saveState':false,
        'ui-grid-rowEdit':false,
        'ui-grid-resizeColumns':false,
        'ui-grid-pinning':false,
        'ui-grid-pagination':false,
        'ui-grid-moveColumns':false,
        'ui-grid-infiniteScroll':false,
        'ui-grid-importer':false,
        'ui-grid-grouping':false,
        'ui-grid-exporter':false,
        'ui-grid-expandable':false,
        'ui-grid-cellNav':false
    };
    _options.middleLayer = {
        'URL': 'Place your URl here..',
    };
    /*_options.config = {
        //Define an aggregate template to customize the rows when grouped. See github wiki for more details.
        aggregateTemplate: undefined, // no more in v3.0.+

        //Callback for when you want to validate something after selection.
        afterSelectionChange: function () { // no more in v3.0.+
        },

        /!* Callback if you want to inspect something before selection,
         return false if you want to cancel the selection. return true otherwise.
         If you need to wait for an async call to proceed with selection you can
         use rowItem.changeSelection(event) method after returning false initially.
         Note: when shift+ Selecting multiple items in the grid this will only get called
         once and the rowItem will be an array of items that are queued to be selected. *!/
        beforeSelectionChange: function () {  // no more in v3.0.+
            return true;
        },

        //checkbox templates.
        checkboxCellTemplate: undefined, // no more in v3.0.+
        checkboxHeaderTemplate: undefined, // no more in v3.0.+

        //definitions of columns as an array [], if not defined columns are auto-generated. See github wiki for more details.
        columnDefs: undefined,

        //!*Data being displayed in the grid. Each item in the array is mapped to a row being displayed.
        data: [],

        //Data updated callback, fires every time the data is modified from outside the grid.
        dataUpdated: function () { // no more in v3.0.+
        },

        //Enables cell editing.
        enableCellEdit: false,

        /!* Controls when to use the edit template on a per-row basis using an angular expression
         (enableCellEdit must also be true for editing).
         This option can be overridden in a column definition. *!/
        cellEditableCondition: 'true',

        //Enables cell selection.
        enableCellSelection: false, // no more in v3.0.+

        //Enable or disable resizing of columns
        enableColumnResizing: false,

        //Enable or disable reordering of columns
        enableColumnReordering: false,  // no more in v3.0.+

        //Enable or disable HEAVY column virtualization. This turns off selection checkboxes and column pinning and is designed for spreadsheet-like data.
        enableColumnHeavyVirt: false, // no more in v3.0.+

        //Enables the server-side paging feature
        enablePaging: false, // no more in v3.0.+, see enablePagination

        //Enable column pinning
        enablePinning: false,

        //Enable drag and drop row reordering. Only works in HTML5 compliant browsers.
        enableRowReordering: false, // no more in v3.0.+

        //To be able to have selectable rows in grid.
        enableRowSelection: true,

        //Enables or disables sorting in grid.
        enableSorting: true,

        // string list of properties to exclude when auto-generating columns.
        excludeProperties: [],

        /!* filterOptions -
         filterText: The text bound to the built-in search box.
         useExternalFilter: Bypass internal filtering if you want to roll your own filtering mechanism but want to use builtin search box.
         *!/
        filterOptions: {  // no more in v3.0.+
            filterText: "",
            useExternalFilter: false
        },

        //Defining the height of the footer in pixels.
        footerRowHeight: 55,  // no more in v3.0.+

        //Initial fields to group data by. Array of field names, not displayName.
        groups: [],  // no more in v3.0.+

        //The height of the header row in pixels.
        headerRowHeight: 30,

        //Define a header row template for further customization. See github wiki for more details.
        headerRowTemplate: undefined, // no more in v3.0.+

        /!*Enables the use of jquery UI reaggable/droppable plugin. requires jqueryUI to work if enabled.
         Useful if you want drag + drop but your users insist on crappy browsers. *!/
        jqueryUIDraggable: false,  // no more in v3.0.+

        //Enable the use jqueryUIThemes
        jqueryUITheme: false,  // no more in v3.0.+

        //Prevent unselections when in single selection mode.
        keepLastSelected: true,  // no more in v3.0.+

        /!*Maintains the column widths while resizing.
         Defaults to true when using *'s or undefined widths. Can be ovverriden by setting to false.*!/
        maintainColumnRatios: undefined, // no more in v3.0.+

        //Set this to false if you only want one item selected at a time
        multiSelect: true,

        // pagingOptions -

        pagingOptions: { // no more in v3.0.+, use paginationPageSizes, paginationPageSize
            // pageSizes: list of available page sizes.
            pageSizes: [250, 500, 1000],
            //pageSize: currently selected page size.
            pageSize: 250,
            //totalServerItems: Total items are on the server.
            totalServerItems: 0,
            //currentPage: the uhm... current page.
            currentPage: 1
        },

        //Pins the selection checkbox column
        pinSelectionCheckbox: false, // no more in v3.0.+,

        //Array of plugin functions to register in ng-grid
        plugins: [], // no more in v3.0.+

        //Row height of rows in grid.
        rowHeight: 30,

        //Define a row template to customize output. See github wiki for more details.
        rowTemplate: undefined,

        //all of the items selected in the grid. In single select mode there will only be one item in the array.
        selectedItems: [], // no more in v3.0.+

        //Disable row selections by clicking on the row and only when the checkbox is clicked.
        selectWithCheckboxOnly: false, // no more in v3.0.+

        /!*Enables menu to choose which columns to display and group by.
         If both showColumnMenu and showFilter are false the menu button will not display.*!/
        showColumnMenu: false,  // no more in v3.0.+

        /!*Enables display of the filterbox in the column menu.
         If both showColumnMenu and showFilter are false the menu button will not display.*!/
        showFilter: false, // no more in v3.0.+

        //Show or hide the footer alltogether the footer is enabled by default
        showFooter: false,  // no more in v3.0.+

        //Show the dropzone for drag and drop grouping
        showGroupPanel: false, // no more in v3.0.+

        //Row selection check boxes appear as the first column.
        showSelectionCheckbox: false, // no more in v3.0.+

        /!*Define a sortInfo object to specify a default sorting state.
         You can also observe this variable to utilize server-side sorting (see useExternalSorting).
         Syntax is sortInfo: { fields: ['fieldName1', 'fieldName2'], directions: ['asc' || 'desc']}*!/
        sortInfo: undefined, // no more in v3.0.+

        //Set the tab index of the Viewport.
        tabIndex: -1, // no more in v3.0.+
        /!*Prevents the internal sorting from executing.
         The sortInfo object will be updated with the sorting information so you can handle sorting (see sortInfo)*!/
        useExternalSorting: false,

        /!*i18n language support. choose from the installed or included languages, en, fr, sp, etc...*!/
        i18n: 'en', // no more in v3.0.+, use i18nservice

        //the threshold in rows to force virtualization on
        virtualizationThreshold: 50,

        //Enables or disables text highlighting in grid by adding the "unselectable" class (See CSS file)
        enableHighlighting: false, // no more in v3.0.+

        //Function that fires once the grid has initialized
        init: undefined // no more in v3.0.+, use onRegisterApi
    };*/
    return _options;
});