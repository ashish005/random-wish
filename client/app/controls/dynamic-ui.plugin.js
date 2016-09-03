(function(){
    window.wrapper = function () {
        this.getAllComponents = function () {
            return [
                {
                    name: 'Container', id:1,
                    children:[
                        { name: 'Tab', type: 'tabContainer', key:4, templateUrl: 'app/controls/tab-container.html' },
                        { name: 'Grid', type: 'grid', key:3 },
                        { name: 'Container Box', type: "container", key:1,
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
                        {type: "textBox", name: 'TextBox', key:5},
                        { name: 'Label', type: "item", key:2}
                    ]
                },
                {
                    name: 'Panels', id:1,
                    children:[
                        { name: 'col-lg-3', type: 'floatingContainer', key:6, templateUrl: 'app/controls/panels/col-lg-3.html' },
                        { name: 'col-lg-4', type: 'floatingContainer', key:7, templateUrl: 'app/controls/panels/col-lg-4.html' },
                        { name: 'col-lg-8', type: 'floatingContainer', key:8, templateUrl: 'app/controls/panels/col-lg-8.html' },
                        { name: 'col-lg-12', type: 'floatingContainer', key:9, templateUrl: 'app/controls/panels/col-lg-12.html' },
                    ]
                }
            ];
        };

        this.getTemplates = function(data){

            /*var tmplt = this.getAllComponents().forEach(function (record, index) {
                var _child = record.children;
                var _result = {};
                if(_child && _child.length>0){
                    (function (data) {
                        data.forEach(function (item, i) {

                            var _model = {
                                type: item.type,
                                key: item.key
                            };
                            if(item.templateUrl){
                                _model.templateUrl = item.templateUrl;
                            }

                            _result[item.key]= _model;
                        });
                    })(_child);
                }
                return _result;
            });*/
            var _key = data['key'];
            if (typeof _key === 'number') {
                var tmplt = {
                    4: {type: 'tabContainer', key: 4, templateUrl: 'app/controls/tab-container.html'},
                    3: {type: 'grid', key: 3},
                    2: {type: "item", key: 2},
                    5: {type: "textBox", key: 5},
                    1: {
                        type: "container", key: 1, columns: []
                    }
                };
                var _item = tmplt[_key];
                _item['id'] = data['id'];
                return _item;
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
                        var _item = self.getTemplates(item);
                        _item.columns = item.columns;
                        data[i] = _item;
                        this.manupulateDateToDeSerialize({ data: data[i].columns })
                    } else {
                        data[i] = self.getTemplates(item);
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