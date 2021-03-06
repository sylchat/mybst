var formControl = ($('form[data-jsobj]').length) ? true : false;

if(formControl){
    $.webshims.setOptions({
        basePath:'/js/lib/shims/',
        overrideMessages: true,
        replaceValidationUI: true,
        addValidators: true
        //lazyCustomMessages: true
    });

    $.webshims.polyfill('forms');
}


;(function($, win, doc, NS) {

    var testMsGesture = window.navigator.pointerEnabled;

    var objs = {}, storeList = [];

    NS.$htmlTag = $('html').addClass('js').removeClass('js-notready');
    NS.$doc = $(doc);
    NS.$win = $(win);
    NS.$body = $('body');

    if (NS.$htmlTag.hasClass('csstransitions')){
        jQuery.fx.off = true;
    }

    NS.moduleCreate = function(name, obj) {
        objs[name] = obj;
    };

    NS.storeObj =  function(obj, id, callback){
      if(obj.id === undefined && id !== undefined){
        obj.id = id;
      }
      storeList.push(obj);
      if(typeof callback === 'function' && callback){callback();}
      return obj;
    }

    NS.getStoreObj =  function(id){
      for(var i = 0, lng = storeList.length; i < lng; i++){
        if(storeList[i].id === id){
          return storeList[i];
        }
      }
    }

    NS.destroyObj = function(id){
      var arr = [];
      for(var i = 0, lng = storeList.length; i < lng; i++){
        if(storeList[i].id === id && storeList[i].destroy){
          storeList[i].destroy();
        } else {
          arr.push(storeList[i]);
        }
      }
      storeList = arr;
    }

    NS.control = function() {
        var listObjs = [];

        var init = function (content) {
          var $dataObjs;

          if (content) {
            $dataObjs = $(content).find('[data-jsobj]')
          }
          else {
            $dataObjs = $('[data-jsobj]')
          }

          $dataObjs.each(function (ind, el) {
              setObj($(el));
          });
        };

        var setObj = function($el, objName) {
            var data = $el.attr('data-jsobj');
            var param = getObjParam(data);
            var objNames = param.obj.split('.');
            if (objNames.length > 1) {
                objNames[1] = param.obj;
            }
            for (var i = 0; i < objNames.length; i++) {
                if (objs[objNames[i]] !== undefined) {
                    objs[objNames[i]]($el, param.option);
                }
            }

        };
        var setModule = function($el, objName) {
            if (objName !== undefined) {
                objs[objName]($el);
            }
        };

        var getObjParam = function(data) {
            data = data.substring(1,data.length -1).replace(/\'/g, '"');
            try{
                return jQuery.parseJSON(data);
            }catch(err){
                console.log(err);
            }
        };

        return {
            init: init,
            listObjs: listObjs,
            setModule: setModule
        };
    }();

    $(function() {
        NS.control.init();
    });


})(jQuery, window, document, window.NS = window.NS || {});
