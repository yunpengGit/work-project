export default {

createNode(graph,name,x,y,image,parent,label){
    let node = graph.createNode(name,x,y);
    node.anchorPosition = Q.Position.LEFT_TOP;
    node.image = image;
/*    node.name.size=32;*/
    if(parent!=null && parent!=""){
        node.host = parent
        node.parent = parent
    }
    node.movable = false
    node.selectable = false
    if(label){
        node.mousemoveable=true;
        node.lab=label;
        node.xiaoxi= this.createLabel(label);
    }
    return node;
},
createTextWithDescription(graph,text, description, x, y){
    var text = graph.createText(text, x, y);
    text.setStyle(Q.Styles.LABEL_BACKGROUND_COLOR, "#2898E0");
    text.setStyle(Q.Styles.LABEL_BACKGROUND_GRADIENT, new Q.Gradient(Q.Consts.GRADIENT_TYPE_LINEAR, ['#00d4f9', '#1ea6e6'], null, Math.PI / 2));
    text.setStyle(Q.Styles.LABEL_COLOR, "#FFF");
    text.setStyle(Q.Styles.LABEL_BORDER, 0.5);
    text.setStyle(Q.Styles.LABEL_PADDING, 4);
    text.setStyle(Q.Styles.LABEL_BORDER_STYLE, "#1D4876");
    text.setStyle(Q.Styles.LABEL_RADIUS, 0);
    text.setStyle(Q.Styles.LABEL_SIZE, new Q.Size(60, 25));
    text.setStyle(Q.Styles.SELECTION_COLOR, "#0F0");
    var label1 = new Q.LabelUI();
    label1.border = 0;
    label1.borderColor = "#DDD";
    label1.borderRadius = 0;
    label1.size = new Q.Size(200, 200);
    label1.fontSize = 45;
    label1.padding = 4;
    label1.alignPosition = Q.Position.LEFT_MIDDLE;
    label1.position = Q.Position.RIGHT_MIDDLE;
    label1.anchorPosition = Q.Position.LEFT_MIDDLE;
    text.addUI(label1, [{
        bindingProperty : "data",
        property : "description",
        propertyType : Q.Consts.PROPERTY_TYPE_CLIENT
    }]);
    text.set("description", description);
    return text;
},
createLabel(label){
    var label2 = new Q.LabelUI();
    label2.position = Q.Position.CENTER_TOP;
    label2.anchorPosition = Q.Position.CENTER_BOTTOM;
    label2.border = 1;
    label2.padding = new Q.Insets(50, 50);
    label2.showPointer = true;
    label2.offsetY = -10;
    label2.fontSize = 28;
    label2.fontStyle = "italic 100";
    return label2;
},
    addGraphEvent(_graph){
        let _this = this;
        _graph.addCustomInteraction({
            onmousemove:function(evt, graph){
                let element = graph.getElementByMouseEvent(evt);
                if(element && element.mousemoveable){
                    //移除ui
                    if(_this.showQipaoNode!=null && _this.showQipaoNode.id!=element.id){
                        _this.showQipaoNode.removeUI(_this.showQipaoNode.xiaoxi);
                        _this.showQipaoNode=null;
                    }else{
                        if(element.xiaoxi){
                            element.addUI(element.xiaoxi, [{
                                property : "label2",
                                propertyType : Q.Consts.PROPERTY_TYPE_CLIENT,
                                bindingProperty : "data"
                            }, {
                                property : "label2.color",
                                propertyType : Q.Consts.PROPERTY_TYPE_CLIENT,
                                bindingProperty : "color"
                            }]);
                            element.set("label2",element.lab);
                            _this.showQipaoNode=element;
                        }
                    }
                }else{
                    if(_this.showQipaoNode!=null){
                        _this.showQipaoNode.removeUI(_this.showQipaoNode.xiaoxi);
                        _this.showQipaoNode=null;
                    }
                }

            }
        });

    },
}
