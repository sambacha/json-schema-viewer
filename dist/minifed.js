window.location.origin||(window.location.origin=window.location.protocol+"//"+window.location.hostname+(window.location.port?":"+window.location.port:""));"undefined"==typeof JSV&&(JSV={schema:"https://schema.catalog.sd2e.org/schemas/sample_set.json",plain:!1,version:"1.0.0",focusNode:!1,example:!1,treeData:null,viewerInit:!1,viewerHeight:0,viewerWidth:0,duration:750,counter:0,maxLabelLength:0,maxDepth:20,labels:{allOf:!0,anyOf:!0,oneOf:!0,"object{ }":!0},baseSvg:null,svgGroup:null,init:function(config,callback){for(var i in config)JSV.hasOwnProperty(i)&&(JSV[i]=config[i]);if(JSV.plain){JSV.createDiagram(callback);d3.selectAll("#zoom-controls>a").on("click",JSV.zoomClick);d3.select("#tree-controls>a#reset-tree").on("click",JSV.resetViewer);JSV.viewerInit=!0}else{JSV.contentHeight();JSV.resizeViewer();$(document).on("pagecontainertransition",this.contentHeight);$(window).on("throttledresize orientationchange",this.contentHeight);$(window).on("resize",this.contentHeight);JSV.resizeBtn();$(document).on("pagecontainershow",JSV.resizeBtn);$(window).on("throttledresize",JSV.resizeBtn);JSV.createDiagram(function(){callback();var items=[];JSV.visit(JSV.treeData,function(me){me.isReal&&items.push(me.plainName+"|"+JSV.getNodePath(me).join("-"))},function(me){return me.children||me._children});items.sort();$("#viewer-page #search-result").on("filterablebeforefilter",function(e,value){var $ul=$(this),value=$(value.input).val();$ul.html("");$ul.on("click",function(node){node=$(node.target).attr("data-path"),node=JSV.expandNodePath(node.split("-"));JSV.flashNode(node)});if(value&&2<value.length){$ul.html('<li><a class="ui-btn ui-btn-icon-left ui-icon-search">Searching...</a></li>');$ul.listview("refresh");JSV.buildSearchList(items,value)}});$("#loading").fadeOut("slow")});JSV.initValidator();$("#popup-error").enhanceWithin().popup();$.fn.highlight=function(str,className,quote){var regex=new RegExp(quote?'\\"\\b'+str+'\\b\\"':"\\b"+str+"\\b","g");return this.each(function(){this.innerHTML=this.innerHTML.replace(regex,function(matched){return'<span class="'+className+'">'+matched+"</span>"})})};$("body").on("pagecontainershow",function(event,page){page=page.toPage;if("viewer-page"===page.attr("id")&&JSV.viewerInit){page.jqmData("infoOpen")&&$("#info-panel").panel("open");JSV.contentHeight();if(0===$("svg#jsv-tree").height()){$("svg#jsv-tree").attr("width",$("#main-body").width()).attr("height",$("#main-body").height());JSV.resizeViewer();JSV.resetViewer()}}});$("body").on("pagecontainerbeforehide",function(event,page){page=page.prevPage;"viewer-page"===page.attr("id")&&page.jqmData("infoOpen",!!page.find("#info-panel.ui-panel-open").length)});$("#info-panel").on("panelopen",function(){var focus=JSV.focusNode;JSV.resizeViewer();if(focus){d3.select("#n-"+focus.id).classed("focus",!0);JSV.setPermalink(focus)}});$("#info-panel").on("panelclose",function(){var focus=JSV.focusNode;JSV.resizeViewer();if(focus){d3.select("#n-"+focus.id).classed("focus",!1);$("#permalink").html("Select a Node...");$("#sharelink").val("")}});$("#info-panel").on("tabsactivate",function(event,highEl){var pre=highEl.newPanel.attr("id");if("info-tab-example"===pre||"info-tab-schema"===pre){pre=highEl.newPanel.find("pre"),highEl=pre.find("span.highlight")[0];highEl&&pre.scrollTo(highEl,900)}});$(".load-example").each(function(idx,link){var ljq=$(link);ljq.on("click",function(evt){evt.preventDefault();JSV.loadInputExample(link.href,ljq.data("target"))})});d3.selectAll("#zoom-controls>a").on("click",JSV.zoomClick);d3.select("#tree-controls>a#reset-tree").on("click",JSV.resetViewer);$("#sharelink").on("click",function(){$(this).select()});JSV.viewerInit=!0}},contentHeight:function(){var content=$.mobile.getScreenHeight()-($(".ui-header").hasClass("ui-header-fixed")?$(".ui-header").outerHeight()-1:$(".ui-header").outerHeight())-($(".ui-footer").hasClass("ui-footer-fixed")?$(".ui-footer").outerHeight()-1:$(".ui-footer").outerHeight())-($("#main-body.ui-content").outerHeight()-$("#main-body.ui-content").height());$("#main-body.ui-content").css("min-height",content+"px")},resizeBtn:function(activePage){var bp="number"==typeof activePage?activePage:800,activePage=$.mobile.pageContainer.pagecontainer("getActivePage");$(".md-navbar",activePage).width()<=bp?$(".md-navbar .md-flex-btn.ui-btn-icon-left").toggleClass("ui-btn-icon-notext ui-btn-icon-left"):$(".md-navbar .md-flex-btn.ui-btn-icon-notext").toggleClass("ui-btn-icon-left ui-btn-icon-notext")},setVersion:function(version){JSV.version=version;$(".schema-version").text(version)},showError:function(msg){$("#popup-error .error-message").html(msg);$("#popup-error").popup("open")},initValidator:function(){var opts={readAsDefault:"Text",on:{load:function(e,file){var data=e.currentTarget.result;try{$.parseJSON(data);$("#textarea-json").val(data)}catch(err){JSV.showError("Failed to load "+file.name+". The file is not valid JSON. <br/>The error: <i>"+err+"</i>")}},error:function(msg,file){msg="Failed to load "+file.name+". "+msg.currentTarget.error.message;JSV.showError(msg)}}};$("#file-upload, #textarea-json").fileReaderJS(opts);$("body").fileClipboard(opts);$("#button-validate").click(function(){var result=JSV.validate();result&&JSV.showValResult(result)})},validate:function(){var data;try{data=$.parseJSON($("#textarea-json").val())}catch(e){JSV.showError("Unable to parse JSON: <br/>"+e)}if(data){var r=$("#checkbox-stop").is(":checked"),strict=$("#checkbox-strict").is(":checked"),schema=tv4.getSchemaMap()[JSV.schema];return r?{valid:r=tv4.validate(data,schema,!1,strict),errors:r?[]:[tv4.error]}:tv4.validateMultiple(data,schema,!1,strict)}},showValResult:function(result){var ui,cont=$("#validation-results");cont.children().length&&cont.css("opacity",0);if(result.valid)cont.html("<p class=ui-content>JSON is valid!</p>");else{ui=cont.html("<div class=ui-content>JSON is <b>NOT</b> valid!</div>");$.each(result.errors,function(i,err){var me=JSV.buildValError(err,"Error "+(i+1)+": ");err.subErrors&&$.each(err.subErrors,function(i,sub){me.append(JSV.buildValError(sub,"SubError "+(i+1)+": "))});ui.children(".ui-content").first().append(me).enhanceWithin()})}cont.toggleClass("error",!result.valid);$("#validator-page").animate({scrollTop:$("#validation-results").offset().top+20},1e3);cont.fadeTo(350,1)},buildValError:function(main,title){main='<div data-role="collapsible" data-collapsed="true" data-mini="true"><h4>'+(title||"Error: ")+main.message+"</h4><ul><li>Message: "+main.message+"</li><li>Data Path: "+main.dataPath+"</li><li>Schema Path: "+main.schemaPath+"</li></ul></div>";return $(main)},setInfo:function(node){var highEl=$("#info-tab-schema"),pre=$("#info-tab-def"),ex=$("#info-tab-example"),height=$("#info-panel").innerHeight()-$("#info-panel .ui-panel-inner").outerHeight()+$("#info-panel #info-tabs").height()-$("#info-panel #info-tabs-navbar").height()-(highEl.outerHeight(!0)-highEl.height());$.each([highEl,pre,ex],function(i,e){e.height(height)});$("#info-definition").html(node.description||"No definition provided.");$("#info-type").html(node.displayType.toString());if(node.translation){var trans=$("<ul></ul>");$.each(node.translation,function(li,v){var li=$("<li>"+li+"</li>"),ul=$("<ul></ul>");$.each(v,function(i,e){ul.append("<li>"+e+"</li>")});trans.append(li.append(ul))});$("#info-translation").html(trans)}else $("#info-translation").html("No translations available.");pre=node.parentSchema.dependencies&&node.parentSchema.dependencies[node.name];if($.isArray(pre)){var deps=$("<ul></ul>");$.each(pre,function(i,li){li=$("<li>"+li+"</li>");deps.append(li)});$("#info-dependencies").html(deps)}else pre?$("#info-dependencies").html("For <em>schema dependencies</em> see parent schema."):$("#info-dependencies").html("No dependencies listed.");JSV.createPre(highEl,tv4.getSchema(node.schema),!1,node.plainName);var example=(!node.example&&node.parent&&node.parent.example&&"object"===node.parent.type?node.parent:node).example;if(example)if(example!==JSV.example)$.getJSON(node.schema.match(/^(.*?)(?=[^\/]*\.json)/g)+example,function(data){var pointer=example.split("#")[1];pointer&&(data=jsonpointer.get(data,pointer));JSV.createPre(ex,data,!1,node.plainName);JSV.example=example}).fail(function(){ex.html("<h3>No example found.</h3>");JSV.example=!1});else{pre=ex.find("pre");pre.find("span.highlight").removeClass("highlight");node.plainName&&pre.highlight(node.plainName,"highlight",!0);(highEl=pre.find("span.highlight")[0])&&pre.scrollTo(highEl,900)}else{ex.html("<h3>No example available.</h3>");JSV.example=!1}},createPre:function(el,highEl,title,exp){var pre=$('<pre><code class="language-json">'+JSON.stringify(highEl,null,"  ")+"</code></pre>"),highEl=$('<a href="#" class="ui-btn ui-mini ui-icon-action ui-btn-icon-right">Open in new window</a>').click(function(){var w=window.open("","pre",null,!0);$(w.document.body).html($("<div>").append(pre.clone().height("95%")).html());hljs.highlightBlock($(w.document.body).children("pre")[0]);$(w.document.body).append('<link rel="stylesheet" href="http://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.1/styles/default.min.css">');w.document.title=title||"JSON Schema Viewer";w.document.close()});el.html(highEl);exp&&pre.highlight(exp,"highlight",!0);el.append(pre);pre.height(el.height()-highEl.outerHeight(!0)-(pre.outerHeight(!0)-pre.height()));highEl=pre.find("span.highlight")[0];highEl&&pre.scrollTo(highEl,900)},compilePath:function(node,path){var p;if(node.parent){p=path?node.name+" > "+path:node.name;return JSV.compilePath(node.parent,p)}return p=path?node.name+" > "+path:node.name},loadInputExample:function(uri,target){$.getJSON(uri).done(function(fetched){$("#"+target).val(JSON.stringify(fetched,null,"  "))}).fail(function(jqXHR,textStatus,errorThrown){JSV.showError("Failed to load example: "+errorThrown)})},setPermalink:function(node){var uri=new URI,path=JSV.getNodePath(node).join("-");uri.hash($.mobile.activePage.attr("id")+"?v="+path);$("#permalink").html(JSV.compilePath(node));$("#sharelink").val(uri.toString())},getNodePath:function(node,children){var p=children||[],parent=node.parent;if(parent){children=parent.children||parent._children;p.unshift(children.indexOf(node));return JSV.getNodePath(parent,p)}return p},expandNodePath:function(path){for(var node=JSV.treeData,i=0;i<path.length;i++){node._children&&JSV.expand(node);node=node.children[path[i]]}JSV.update(JSV.treeData);JSV.centerNode(node);return node},buildSearchList:function(items,val){var ul=$("ul#search-result"),exp=new RegExp("^.*"+val+".*\\|.+","i");$.each(items,function(i,li){if(li.match(exp)){var data=li.split("|"),li=$("<li/>").attr("data-icon","false").appendTo(ul);$("<a/>").attr("data-path",data[1]).text(data[0]).appendTo(li)}})},flashNode:function(node,times){for(var t=times||4,text=$("#n-"+node.id+" text");t--;)text.fadeTo(350,0).fadeTo(350,1)},visit:function(parent,visitFn,childrenFn){if(parent){visitFn(parent);var children=childrenFn(parent);if(children)for(var count=children.length,i=0;i<count;i++)JSV.visit(children[i],visitFn,childrenFn)}},compileData:function(schema,parent,name,real,depth){if(!((depth=depth||0)>this.maxDepth)){var key,node,s=schema.$ref?tv4.getSchema(schema.$ref):schema,props=s.properties,items=s.items,owns=Object.prototype.hasOwnProperty,all={},parentSchema=function(node){var schema=node.id||node.$ref||node.schema;return schema||(node.parentSchema?parentSchema(node.parentSchema):null)};s.allOf&&(all.allOf=s.allOf);s.oneOf&&(all.oneOf=s.oneOf);s.anyOf&&(all.anyOf=s.anyOf);(node={description:schema.description||s.description,name:!(!schema.$ref||!real)&&name||s.title||name||"schema",isReal:real,plainName:name,type:s.type,displayType:s.type||(s.enum?"enum: "+s.enum.join(", "):s.items?"array":s.properties?"object":"ambiguous"),translation:schema.translation||s.translation,example:schema.example||s.example,opacity:real?1:.5,required:s.required,schema:s.id||schema.$ref||parentSchema(parent),parentSchema:parent,deprecated:schema.deprecated||s.deprecated,dependencies:s.dependencies}).require=!(!parent||!parent.required)&&-1<parent.required.indexOf(node.name);if(parent)if("item"===node.name){node.parent=parent;if(node.type){node.name=node.type;parent.children.push(node)}}else("item"===parent.name?parent.parent:parent).children.push(node);else JSV.treeData=node;if("array"===node.type){node.name+="["+(s.minItems||" ")+"]";node.minItems=s.minItems}"object"===node.type&&"item"!==node.name&&(node.name+="{ }");(props||items||all)&&(node.children=[]);for(key in props)owns.call(props,key)&&JSV.compileData(props[key],node,key,!0,depth+1);for(key in all)if(owns.call(all,key)&&all[key]){var allNode={name:key,children:[],opacity:.5,parentSchema:parent,schema:schema.$ref||parentSchema(parent)};("item"===node.name?node.parent:node).children.push(allNode);for(var i=0;i<all[key].length;i++)JSV.compileData(all[key][i],allNode,s.title||all[key][i].type,!1,depth+1)}"[object Object]"===Object.prototype.toString.call(items)?JSV.compileData(items,node,"item",!1,depth+1):"[object Array]"===Object.prototype.toString.call(items)&&items.forEach(function(itm,idx,arr){JSV.compileData(itm,node,idx.toString(),!1,depth+1)})}},resizeViewer:function(){JSV.viewerWidth=$("#main-body").width();JSV.viewerHeight=$("#main-body").height();JSV.focusNode&&JSV.centerNode(JSV.focusNode)},resetTree:function(source,level){JSV.visit(source,function(d){d.children&&0<d.children.length&&d.depth>level&&!JSV.labels[d.name]?JSV.collapse(d):JSV.labels[d.name]&&JSV.expand(d)},function(d){return d.children&&0<d.children.length?d.children:d._children&&0<d._children.length?d._children:null})},resetViewer:function(){var page=$("#viewer-page");page.css("display","block");var root=JSV.treeData;root.x0=JSV.viewerHeight/2;root.y0=0;JSV.tree.nodes(root);JSV.resetTree(root,1);JSV.update(root);page.css("display","");JSV.centerNode(root,4)},centerNode:function(y,scale){var x=scale||2,zl=JSV.zoomListener,scale=zl.scale(),x=-y.y0*scale+JSV.viewerWidth/x,y=-y.x0*scale+JSV.viewerHeight/2;d3.select("g#node-group").transition().duration(JSV.duration).attr("transform","translate("+x+","+y+")scale("+scale+")");zl.scale(scale);zl.translate([x,y])},collapse:function(d){if(d.children){d._children=d.children;d.children=null}},expand:function(d){if(d._children){d.children=d._children;d._children=null}if(d.children)for(var count=d.children.length,i=0;i<count;i++)JSV.labels[d.children[i].name]&&JSV.expand(d.children[i])},toggleChildren:function(d){d.children?JSV.collapse(d):d._children&&JSV.expand(d);return d},click:function(d){if(!JSV.labels[d.name]){if(d3.event&&d3.event.defaultPrevented)return;d=JSV.toggleChildren(d);JSV.update(d);JSV.centerNode(d)}},clickTitle:function(d){if(!JSV.labels[d.name]){if(d3.event&&d3.event.defaultPrevented)return;var panel=$("#info-panel");JSV.focusNode&&d3.select("#n-"+JSV.focusNode.id).classed("focus",!1);JSV.focusNode=d;JSV.centerNode(d);d3.select("#n-"+d.id).classed("focus",!0);if(!JSV.plain){JSV.setPermalink(d);$("#info-title").text("Info: "+d.name).toggleClass("deprecated",!!d.deprecated);JSV.setInfo(d);panel.panel("open")}}},zoom:function(){JSV.svgGroup.attr("transform","translate("+JSV.zoomListener.translate()+")scale("+JSV.zoomListener.scale()+")")},interpolateZoom:function(translate,scale){return d3.transition().duration(350).tween("zoom",function(){var iTranslate=d3.interpolate(JSV.zoomListener.translate(),translate),iScale=d3.interpolate(JSV.zoomListener.scale(),scale);return function(t){JSV.zoomListener.scale(iScale(t)).translate(iTranslate(t));JSV.zoom()}})},zoomClick:function(){d3.event.target;var direction,target_zoom,translate0,l,center=[JSV.viewerWidth/2,JSV.viewerHeight/2],zl=JSV.zoomListener,extent=zl.scaleExtent(),view=zl.translate(),view={x:view[0],y:view[1],k:zl.scale()};d3.event.preventDefault();direction="zoom_in"===this.id?1:-1;if((target_zoom=zl.scale()*(1+.2*direction))<extent[0]||target_zoom>extent[1])return!1;translate0=[(center[0]-view.x)/view.k,(center[1]-view.y)/view.k];view.k=target_zoom;l=[translate0[0]*view.k+view.x,translate0[1]*view.k+view.y];view.x+=center[0]-l[0];view.y+=center[1]-l[1];JSV.interpolateZoom([view.x,view.y],view.k)},zoomListener:null,sortTree:function(tree){tree.sort(function(a,b){return b.name.toLowerCase()<a.name.toLowerCase()?1:-1})},diagonal1:function(d){var src=d.source,node=d3.select("#n-"+src.id)[0][0],width=0;node&&(width=node.getBBox().width);return"M"+(src.y+width)+","+src.x+"H"+(d.target.y-30)+"V"+d.target.x+"h30"},update:function(source){var duration=JSV.duration,nodeEnter=JSV.treeData,levelWidth=[1],childCount=function(level,n){if(n.children&&0<n.children.length){levelWidth.length<=level+1&&levelWidth.push(0);levelWidth[level+1]+=n.children.length;n.children.forEach(function(d){childCount(level+1,d)})}};childCount(0,nodeEnter);var nodeExit=45*d3.max(levelWidth);JSV.tree.size([nodeExit,JSV.viewerWidth]);var nodes=JSV.tree.nodes(nodeEnter).reverse(),link=JSV.tree.links(nodes);nodes.forEach(function(d){d.y=d.depth*(8*JSV.maxLabelLength)});nodeExit=JSV.svgGroup.selectAll("g.node").data(nodes,function(d){return d.id||(d.id=++JSV.counter)}),nodeEnter=nodeExit.enter().append("g").attr("class",function(d){return JSV.labels[d.name]?"node label":"node"}).classed("deprecated",function(d){return d.deprecated}).attr("id",function(d,i){return"n-"+d.id}).attr("transform",function(d){return"translate("+source.y0+","+source.x0+")"});nodeEnter.append("circle").attr("r",0).classed("collapsed",function(d){return!!d._children}).on("click",JSV.click);nodeEnter.append("text").attr("x",function(d){return 10}).attr("dy",".35em").attr("class",function(d){return d.children||d._children?"node-text node-branch":"node-text"}).classed("abstract",function(d){return d.opacity<1}).attr("text-anchor",function(d){return"start"}).text(function(d){return d.name+(d.require?"*":"")}).style("fill-opacity",0).on("click",JSV.clickTitle).on("dblclick",function(d){JSV.click(d);JSV.clickTitle(d);d3.event.stopPropagation()});nodeExit.select(".node circle").attr("r",6.5).classed("collapsed",function(d){return!!d._children});nodeExit.transition().duration(duration).attr("transform",function(d){return"translate("+d.y+","+d.x+")"}).select("text").style("fill-opacity",function(d){return d.opacity||1});nodeExit=nodeExit.exit().transition().duration(duration).attr("transform",function(d){return"translate("+source.y+","+source.x+")"}).remove();nodeExit.select("circle").attr("r",0);nodeExit.select("text").style("fill-opacity",0);link=JSV.svgGroup.selectAll("path.link").data(link,function(d){return d.target.id});link.enter().insert("path","g").attr("class","link").attr("d",function(d){var o={x:source.x0,y:source.y0};return JSV.diagonal1({source:o,target:o})});link.transition().duration(duration).attr("d",JSV.diagonal1);link.exit().transition().duration(duration).attr("d",function(d){var o={x:source.x,y:source.y};return JSV.diagonal1({source:o,target:o})}).remove();nodes.forEach(function(d){d.x0=d.x;d.y0=d.y})},createDiagram:function(callback){console.log("JSV: "+JSV.schema);tv4.asyncLoad([JSV.schema],function(){console.log("compileData");JSV.compileData(tv4.getSchema(JSV.schema),!1,"schema");console.log("!compileData");var legendItem=JSV.viewerWidth,viewerHeight=JSV.viewerHeight;JSV.zoomListener=d3.behavior.zoom().scaleExtent([.1,3]).on("zoom",JSV.zoom);JSV.baseSvg=d3.select("#main-body").append("svg").attr("id","jsv-tree").attr("class","overlay").attr("width",legendItem).attr("height",viewerHeight).call(JSV.zoomListener);JSV.tree=d3.layout.tree().size([viewerHeight,legendItem]);JSV.visit(JSV.treeData,function(d){0;JSV.maxLabelLength=Math.max(d.name.length,JSV.maxLabelLength)},function(d){return d.children&&0<d.children.length?d.children:null});JSV.svgGroup=JSV.baseSvg.append("g").attr("id","node-group");JSV.resetViewer();JSV.centerNode(JSV.treeData,4);legendItem=d3.select("#legend-items").append("svg").attr("width",170).attr("height",180).selectAll("g.item-group").data([{text:"Expanded",y:20},{text:"Collapsed",iconCls:"collapsed",y:40},{text:"Selected",itemCls:"focus",y:60},{text:"Required*",y:80},{text:"Object{ }",iconCls:"collapsed",y:100},{text:"Array[minimum #]",iconCls:"collapsed",y:120},{text:"Abstract Property",itemCls:"abstract",y:140,opacity:.5},{text:"Deprecated",itemCls:"deprecated",y:160}]).enter().append("g").attr("class",function(d){var cls="item-group ";return cls+=d.itemCls||""}).attr("transform",function(d){return"translate(10, "+d.y+")"});legendItem.append("circle").attr("r",6.5).attr("class",function(d){return d.iconCls});legendItem.append("text").attr("x",15).attr("dy",".35em").attr("class","item-text").attr("text-anchor","start").style("fill-opacity",function(d){return d.opacity||1}).text(function(d){return d.text});"function"==typeof callback&&callback()})}});
