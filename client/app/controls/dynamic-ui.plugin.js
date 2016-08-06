(function(){
    window.wrapper = function () {
        this.getTemplates = function(data){
            if (typeof data === 'number') {
                var tmplt = {
                    4: {type: 'tabContainer', key: 4, id: 4, templateUrl: 'app/controls/tab-container.html'},
                    3: {type: 'grid', key: 3, id: 3,},
                    2: {type: "item", key: 2, id: 2},
                    5: {type: "textBox", key: 5, id: 5},
                    1: {
                        type: "container", key: 1, id: 1,
                        columns: []
                    }
                };
                return tmplt[data];
            };
        };
        this.getId = function (id) {
            return parseInt(id);
        };

        this.isSpecialCondition = function (_item) {
            return (_item && _item.columns && 'object' == typeof(_item.columns))
        };

        this.serializer = function (data, result) {
            if (typeof data == 'object' && data && Array === data.constructor) {
                for (var i = 0; i < data.length; i++) {
                    this.serializer(data[i], result);
                }
                ;
            } else if (data.columns) {
                var _arr = [this.getId(data.key), []];
                for (var j = 0; j < data.columns.length; j++) {
                    var newArr = [];
                    this.serializer(data.columns[j], newArr);
                    _arr[1].push(newArr)
                }
                ;
                result.push(_arr);
            } else {
                result.push(this.getId(data.key));
            }
        };

        this.setTemplate = function (data) {
            if (typeof data === 'number') {
                return this.templates(data);
            }
        }

        this.deserializer = function (data, result) {
            for (var i = 0; i < data.length; i++) {
                var arr = [], _iData = data[i];

                if (typeof _iData == 'object' && _iData && Array === _iData.constructor) {
                    this.deserializer(_iData, arr);
                } else {
                    var _templ = this.setTemplate(_iData);
                    if (_iData == 1) { // Apply condition here
                        var arr1 = [], columnData = data[i + 1];
                        this.deserializer(columnData, arr1);
                        data.splice(i + 1, 1);
                        _templ.columns = arr1;
                        result.push(_templ);
                        /*var _arrayInfo = [];
                         _arrayInfo.push(_templ);
                         result.push(_arrayInfo);*/
                    } else {
                        var _arrayInfo = [];
                        _arrayInfo.push(_templ);
                        result.push(_arrayInfo);
                    }
                }
            }
            ;

        }
    };
    wrapper.prototype.serialize = function (data) {
        var result = result || [];
        this.serializer(data, result);
        return result;
    };
    wrapper.prototype.deserialize = function deserialize(pattern, done, options) {

        var response = options ? options.response : [];
        var sourceKey = options ? options.sourceKey : undefined;
        var sourcePattern = options ? options.sourcePattern : undefined;
        var specialCase = options ? options.specialCase : false;
        var that = this;
        for (var key in pattern) {
            if (key != "length") {
                (function (value, key, arr, options) {
                    if (typeof(value) == "number") {
                        var _item = that.getTemplates(value), isSpecialCase = that.isSpecialCondition(_item);
                        if (isSpecialCase || specialCase) {
                            response.push(_item);
                        } else {
                            response.push([_item]);
                        }
                    } else if (Array.isArray(value)) {
                        /*console.log("Array : ", value);*/

                        (function (value, keyVal, arr, options) {
                            var resp = null; isSpecialCase = that.isSpecialCondition(response[0]);
                            /*var _convertArrayToObj = false, tempResp = null;
                            value.forEach(function(item, index){
                                var _getType = typeof item;
                                if(_getType == 'object' && 1 == item[0]){
                                    _convertArrayToObj = true;
                                    debugger;
                                    tempResp = [1, [], 2];
                                    console.log(_convertArrayToObj);
                                }
                            });
                            if(_convertArrayToObj){
                                resp = tempResp;
                            }
                           else*/
                            if (!isSpecialCase) {
                                response.push([]);
                                resp = response[response.length - 1];
                            } else {
                                resp = response[0].columns;
                                specialCase = true;
                            };
                            that.deserialize(value, done, {
                                response: resp,
                                sourceKey: options.sourceKey,
                                sourcePattern: options.sourcePattern,
                                specialCase: specialCase
                            });
                        })(value, key, arr, options);
                    }

                    if (!sourceKey) {
                        if (key == arr.length - 1) {
                            done({response: response, options: options});
                            console.log(JSON.stringify(response));
                        }
                    }
                })(pattern[key], key, pattern, {
                    response: response,
                    sourceKey: sourceKey || key,
                    sourcePattern: sourcePattern || pattern,
                    specialCase: false
                });
            }
        }
    };
})();