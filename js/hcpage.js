/*
    hucong 2018-02-25
    分页插件
*/
(function(exports){


function Page(options){
    this.initOptions(options);
    this.render(true);
}

Page.prototype.initOptions = function(options){
    options.layout = (typeof options.layout === 'object') ? options.layout : ['prev','page','next'];
    options.curr = options.curr || 1;
    options.count = options.count || 0;
    options.groups = options.groups || 5;
    options.limit = options.limit || 10;
    this.options = options||{};
    this.elem = document.getElementById(this.options.id);
}
Page.prototype.render = function(first){
    var view = this.view();
    this.elem.innerHTML = view;
    this.options.jump(this.options,first);
    this.initEvents();
}
//返回分页html代码
Page.prototype.view = function(){
    var self = this,
        options = this.options;

    //总页数
    var pages = self.options.pages = Math.ceil(options.count/options.limit)||1;

    var views = {
        first:function(){
            var first = options.first || '首页';            
            return '<a href="javascript:;" class="hcpage-first '+(options.curr==1?'hcpage-disabled':'')+'" data-page="1">'+first+'</a>';
        },
        prev:function(){
            return '<a href="javascript:;" class="hcpage-prev '+(options.curr==1?'hcpage-disabled':'')+'" data-page="'+(options.curr-1)+'">&#x4E0A;&#x4E00;&#x9875</a>';
        },
        page:function(){
            var pager = [];

            options.groups = options.groups>pages ? pages : options.groups;

            // 根据curr的判断当前处于哪个组
            var index = Math.floor(options.curr/options.groups)+1;

            //根据groups设置组的起止范围，如group为4，那么第一组为1~4
            var halve = Math.floor( (options.groups-1)/2 ); //index>1时，curr左边有几个页码块
            var start = index>1 ? (options.curr - halve) : 1;
            var _end = index>1 ? (options.curr + (options.groups-halve-1)) : options.groups;
            var end = _end>pages ? pages : _end;

            // 比如 pages=10，groups=4；当curr=9时，start为8，end为9，那么页码就只有8、9、10三个，不合要求
            if(end-start < options.groups-1){
                start = end - options.groups + 1;
            }

            //first首页
            if(index>1){
                var first = options.first || 1;
                pager.push('<a href="javascript:;" class="hcpage-first" data-page="1">'+first+'</a>');
            }
            //省略号分隔符（首部）
            if(start>2){
                pager.push('<span>...</span>');
            }            

            // 页码
            for(;start<=end;start++){
                if(start === options.curr){
                    pager.push('<span class="hcpage-curr">'+start+'</span>');
                }else{
                    pager.push('<a href="javascript:;" data-page="'+start+'">'+start+'</a>');
                }
            }

            // 省略号分隔符（末尾）
            if(pages-end>=2){
                pager.push('<span>...</span>');
            }
            // last末页            
            if(end<pages){
                var last = options.last || pages;
                pager.push('<a href="javascript:;" class="hcpage-last" data-page="'+pages+'">'+last+'</a>');
            }

            return pager.join('');
        },
        cpage:function(){ // custom page
            var cpage = options.cpage;
            if(cpage && typeof cpage === 'string'){
                var result = cpage.match(/{\$[^}^\s]+}/g);
                console.log('result',result);
                if(!result) return '';
                for(var i=0,l=result.length;i<l;i++){
                    var key = result[i].split(/[$}]/)[1];
                    cpage = cpage.replace(result[i],options[key]);
                }
            }
            return cpage;
        },
        next:function(){
            return '<a href="javascript:;" class="hcpage-next '+(options.curr==pages?'hcpage-disabled':'')+'" data-page="'+(options.curr+1)+'">&#x4E0B;&#x4E00;&#x9875;</a>';
        },
        last:function(){
            var last = options.last || '尾页';
            return '<a href="javascript:;" class="hcpage-last '+(options.curr==pages?'hcpage-disabled':'')+'" data-page="'+pages+'">'+last+'</a>';
        },
        count:function(){
            return '<span class="hcpage-count">共 '+options.count+' 条</span>';
        },
        skip:function(){
            return '<span class="hcpage-skip">到第<input type="number" value="'+options.curr+'">页<button>确定</button>';
        }
    };

    var renderContent = function(){
        var plate = [];
        var layout = self.options.layout;
        for(var i=0,l=layout.length;i<l;i++){
            var item = layout[i];
            if(views[item]){
                plate.push( views[item]() );
            }
        }
        return plate.join('');
    };
    var content = renderContent();

    var arr = ['<div class="hcpage">',content,'</div>'];
    return arr.join('');
}
Page.prototype.initEvents = function(){
    var self = this;
    this.elem.onclick = function(e){
        var target = e.target;
        var tagName = target.tagName.toLowerCase();
        var pages = self.options.pages;
        if(tagName === 'a'){
            var page = target.getAttribute('data-page')|0; //转为数值
            if(page<1 || page>pages) return;
            self.options.curr = page;
            self.render();
        }
        if(tagName === 'button'){
            var input = self.elem.getElementsByTagName('input')[0];
            var page = input.value | 0;
            page = page<1?1:page;
            page = page>pages?pages:page;
            self.options.curr = page;
            self.render();
        }
    }
}

// 对外接口
var hcpage = exports.hcpage = {
    init:function(options){
        var o = new Page(options);
    }
}


}(typeof exports === 'object' ? exports : window));