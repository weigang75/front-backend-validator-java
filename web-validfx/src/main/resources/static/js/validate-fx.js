if(typeof Validfx === "undefined"){
    var Validfx = {};
    Validfx.debug = false;
    Validfx.bindVoAttr = "bindVo";
    Validfx.onFormValidFail = function (context) {

    };
}
$.fn.extend({
    checkForm : function () {
        var form = $(this);
        var validate = form.form('validate')
        if(validate == true)
            return true;
        if(Validfx.onFormValidFail){
            var invalidItems = form.find(".validatebox-invalid");
            Validfx.onFormValidFail({form : form, items : invalidItems});
        }
        //var invalidMessage = form.find(".validatebox-invalid:first").attr("invalidMessage");
        //alert(invalidMessage);
        return false;
    },
    jsonData:function() {
        return (function (element) {
            var form = $.getForm(element);
            if(form[0] == null){
                return null;
            }
            var data = {};
            var inputs = form.find("[name]");
            inputs.each(function(index,element){
                var name = $(element).attr("name");
                var val = $(element).val();
                var inputType = $(element).attr("type");
                if(inputType === "checkbox"){
                    if($(element).is(':checked')){
                        if(data[name] == null)
                            data[name] = [];
                        data[name].push(val);
                    }
                }else if(inputType === "radio"){
                    if($(element).is(':checked')) {
                        data[name] = val;
                    }
                }else{
                    data[name] = val;
                }
                //console.log(element,index);
            });
            return data;
        })($(this));
    },
    submitData : function (option) {
        var url = option.url;
        var form = null;
        var isValid = option.isValid;
        if(isValid != false)
            isValid = true;
        if(option.element)
            form = $.getForm(option.element);
        if(form === null){
            form = $.getForm($(this));
        }
        if(form[0] === null){
            return;
        }
        var api = new HttpClient();
        if(form.checkForm() || !isValid || Validfx.debug) {
            var data = $(form).jsonData();
            api.post({
                url: url, data: data, success: option.success
            });
        }
    }
});

$.extend($.fn.validatebox.defaults.rules, {
    equals: {
        validator: function(value,param){
            // if(param.length > 1){
            //     this.message = param[1];
            //     $(this).attr("invalidMessage",param[1]);
            //     $.parser.parse($(this));
            // }
            return value == $(param[0]).val();
        },
        message: '{1}'
    }});
$.extend({
    callJsonp : function (url,success) {
        $.ajax({
            url: url,
            type: "GET",
            // jsonpCallback: "callback",  //指定回调函数名称
            dataType: "jsonp", //指定服务器返回的数据类型
            success: success
        });
    },
    getForm : function (element) {
        var form = null;
        if(element != null){
            form = $(element);
        }
        if(form != null) {
            if (form.is("form")) {
                return form;
            }
            form = form.parents("form");
            return form;
        }
        form = $(event.target);
        if (form.is("form")) {
            return form;
        }
        form = form.parents("form");
        return form;
    }
});

$(function () {
    $.callJsonp("/validators/rules",function (rules) {
        var regexRules = {};
        for(var i in rules){
            var rule = rules[i];
            regexRules[rule.ruleName] = {};
            (function () {
                if(rule.regex){
                    var thisRule = regexRules[rule.ruleName];
                    thisRule.regex = new RegExp(rule.regex);
                    thisRule.message = rule.message;
                    thisRule.validator = function (value, params) {
                        if(params && params.length > 0){
                            thisRule.message = params[params.length-1];
                        }
                        return thisRule.regex.test(value);
                    };
                }else if(rule.ruleName === "length"){
                    var thisRule = regexRules[rule.ruleName];
                    thisRule.message = "输入的字符长度不能超过{1}";
                    thisRule.validator = function(val, params){
                        var len = $.trim(val).length;
                        if(params[0] > 0 && len < params[0]){
                            thisRule.message = "输入的字符长度不能少于{0}";
                        }else{
                            thisRule.message = "输入的字符长度不能超过{1}";
                        }
                        return len >= params[0] && len<= params[1];
                    };
                }else if(rule.ruleName === "size"){
                    var thisRule = regexRules[rule.ruleName];
                    thisRule.message = rule.message;
                    thisRule.validator = function(val, params){
                        var len = $("[name=" + val + "]:checked").length

                        if(params[0] > 0 && len < params[0]){
                            if(thisRule.message === null)
                                thisRule.message = "输入的字符长度不能少于{0}";
                            else
                                thisRule.message = thisRule.message.replace("{min}",params[0]);
                        }else{
                            if(thisRule.message === null)
                                thisRule.message = "输入的字符长度不能超过{1}";
                            else
                                thisRule.message = thisRule.message.replace("{max}",params[1]);
                        }
                        return len >= params[0] && len<= params[1];
                    }
                }
            })();
        }
        if(Validfx.debug)
            console.log(regexRules,"extendValidateRules");

        $.extend($.fn.validatebox.defaults.rules,regexRules);
    });

    var bindInfo = "";
    var formIdx = 0;
    $(this).find("form").each(function(index,element){
        var bindVo = $(element).attr(Validfx.bindVoAttr);
        if(bindVo){
            var formId = $(element).attr("id");
            if(formId == null){
                formId = "_form_" + formIdx;
                formIdx++;
                $(element).attr("id",formId);
            }
            bindInfo += formId +":"+bindVo+","
        }
    });
    if(bindInfo.length > 0){
        $.callJsonp("/validators/models/" + bindInfo,function (json) {
            __bindVoModel(json); // $.bindForm("ff:user,ff2:user");
        });
    }
});


var __getValidType = function (rules) {
    var retRules = [];
    for(var i in rules){
        var rule = rules[i];
        var ruleInfo = rule.name;
        if(rule.parameters){
            var ps = "";
            for(var p in rule.parameters){
                //if("message" == p)
                //    continue;
                var val = rule.parameters[p];
                if(typeof val === "number"){
                    ps += val+",";
                }else if(typeof val === "string"){
                    ps += "\"" + val +"\",";
                }else{
                    ps += "\"" + val +"\",";
                }
            }
            if(ps.length > 1){
                retRules.push(ruleInfo + "[" + ps.substr(0,ps.length-1) + "]");
                continue;
            }
        }
        retRules.push(ruleInfo);
    }
    if(retRules.length == 1)
        return retRules[0];

    return retRules;
};
var __bindVoModel = function (json) {
    if(Validfx.debug)
        console.log(json,"bindVoModel");

    for(var i in json){
        var f = json[i];
        var form = $("#"+f.form);
        if(form.length > 0){
            for(var j in f.items){
                var item = f.items[j];
                var inputs = form.find("input[name='" + item.propertyName + "']");
                if(inputs.length == 0)
                    break;
                var input = inputs.length == 1 ? $(inputs[0]) : null;
                if(input == null){
                    // 说明有多个
                    input = $("<input type='hidden' name='group_" + item.propertyName + "' value='" + item.propertyName + "' />");
                    $(inputs[0]).before(input);
                }
                if(input){
                    if(item.rules && item.rules.length > 0) {
                        var validType = __getValidType(item.rules);
                        input.validatebox({
                            required: item.required,
                            validType: validType
                        });
                    }else if(item.required == true){
                        input.validatebox({
                            required: true
                        });
                    }
                    $.parser.parse(input);
                }
            }
        }
    }
};

