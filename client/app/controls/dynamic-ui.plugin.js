(function(){
    window.wrapper = function () {
        this.getAllComponents = function () {
            return [
                {
                    name: 'Container', id:1,
                    children:[
                        { name: 'Tab', type: 'tabContainer', key:4, id: 4, templateUrl: 'app/controls/tab-container.html' },
                        { name: 'Grid', type: 'grid', key:3, id: 3 },
                        { name: 'Container Box', type: "container", key:1, id: 1,
                            columns: [
                                /*[{ "type": "item", "id": "2" }],
                                 [{ "type": "item", "id": "2" }]*/
                            ]
                        }
                    ]
                },
                {
                    name: 'Controls', id:1,
                    children:[
                        {type: "textBox", name: 'TextBox', key:5,id: 5},
                        { name: 'Label', type: "item", key:2,id: 2}
                    ]
                },
                {
                    name: 'Panels', id:1,
                    children:[
                        { name: 'col-lg-3', type: 'floatingContainer', key:6, id: 6, templateUrl: 'app/controls/panels/col-lg-3.html' },
                        { name: 'col-lg-4', type: 'floatingContainer', key:7, id: 7, templateUrl: 'app/controls/panels/col-lg-4.html' },
                        { name: 'col-lg-8', type: 'floatingContainer', key:8, id: 8, templateUrl: 'app/controls/panels/col-lg-8.html' },
                        { name: 'col-lg-12', type: 'floatingContainer', key:8, id: 8, templateUrl: 'app/controls/panels/col-lg-12.html' },
                    ]
                }
            ];
        };

        this.getTemplates = function(data){
            if (typeof data === 'number') {
                var tmplt = {
                    4: {type: 'tabContainer', key: 4, id: 4, templateUrl: 'app/controls/tab-container.html'},
                    3: {type: 'grid', key: 3, id: 3,},
                    2: {type: "item", key: 2, id: 2},
                    5: {type: "textBox", key: 5, id: 5},
                    1: {
                        type: "container", key: 1, id: 1, columns: []
                    }
                };
                return tmplt[data];
            };
        };
        this.manupulateDateToSerialize = function(info){
            var data = info.data;
            for (var i in data) {
                var item = data[i], self = this;
                if (item && 'object' === typeof item && Array === data.constructor && item.length > 0) {
                    self.manupulateDateToSerialize({
                        data: item
                    })
                } else {
                    if (item.columns && item.columns.length > 0) {
                        data[i] = {id: item.id, key: item.key, columns: item.columns};
                        self.manupulateDateToSerialize({
                            data: item.columns
                        })
                    } else {
                        data[i] = {id: item.id, key: item.key};
                    }
                }
            }
        };
        this.manupulateDateToDeSerialize = function(info){
            var data = info.data;
            for (var i in data) {
                var item = data[i], self = this;
                if (item && 'object' === typeof item && Array === data.constructor && item.length > 0) {
                    this.manupulateDateToDeSerialize({ data: item })
                } else {
                    if (item.columns && item.columns.length > 0) {
                        var _item = self.getTemplates(item['key']);
                        _item.columns = item.columns;
                        data[i] = _item;
                        this.manupulateDateToDeSerialize({ data: data[i].columns })
                    } else {
                        data[i] = self.getTemplates(item['key']);
                    }
                }
            }
        }
    };
    wrapper.prototype.serialize = function (data, done) {
        var input = {data: data};
        this.manupulateDateToSerialize(input);
        done({response: input.data});
    };
    wrapper.prototype.deserialize = function (data, done) {
        var input = {data: data};
        this.manupulateDateToDeSerialize(input);
        done({response: input.data});
    };
})();