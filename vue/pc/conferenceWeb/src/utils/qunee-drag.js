export function RectElement(x, y, width, height, radius, image) {
    Q.doSuperConstructor(this, RectElement)
    this.anchorPosition = Q.Position.LEFT_TOP
    this.setStyle(Q.Styles.SHAPE_FILL_COLOR, '#EEE')
    this.setStyle(Q.Styles.SHAPE_STROKE, 1)
    this.setStyle(Q.Styles.SHAPE_STROKE_STYLE, '#555')
    this.setStyle(Q.Styles.LABEL_PADDING, 5)
    this.radius = radius
    this.setBounds(x, y, width, height, image)
}

RectElement.prototype = {
    setBounds: function(x, y, width, height, image, relativeParent) {
        x = x || 0, y = y || 0
        if (relativeParent && this.parent) {
            x += this.parent.x, y += this.parent.y
        }
        this.width = width, this.height = height
        this.x = x, this.y = y
        if (image) {
            this.image = image
        } else {
            this.image = Q.Shapes.getRect(0, 0, width, height, this.radius || 5)
        }
    },
    getBounds: function() {
        return {
            x: this.x, y: this.y - 5, width: this.width, height: this.height
        }
    }
}

Q.extend(RectElement, Q.Node)

export function initInteraction(graph) {
    var currentElement
    var oldFillColor
    var highlightColor = '#FF0'

    function unhighlight() {
        if (currentElement) {
            currentElement.setStyle(Q.Styles.SHAPE_FILL_COLOR, oldFillColor)
        }
    }

    function highlight(element) {
        if (currentElement == element) {
            return
        }
        unhighlight(currentElement)
        currentElement = element
        if (!currentElement) {
            return
        }
        oldFillColor = currentElement.getStyle(Q.Styles.SHAPE_FILL_COLOR)
        currentElement.setStyle(Q.Styles.SHAPE_FILL_COLOR, highlightColor)
    }

    function findSlot(element, evt) {
        var type = element.get('type')
        var xy = graph.toLogical(evt.event)

        function canDrop(data) {
            return data.get('type') == 'slot' && data.get('childType') == type
        }

        var slot
        graph.forEachReverseVisibleUI(function(ui) {
            if (ui.data == element) {
                return
            }
            var bounds = graph.getUIBounds(ui)
            if (bounds.intersects(xy.x, xy.y)) {
                if (canDrop(ui.data)) {
                    slot = ui.data
                }
                return false
            }
        })
        return slot
    }

    function updateLocation(element, slot) {
        element.parent = slot
        var bounds = slot.getBounds()
        graph.moveElements([element], bounds.x - element.x, bounds.y - element.y)
    }

    var dragInfo = {}

    /*
    graph.interactionDispatcher.addListener(function(evt) {
        var data = evt.data
        if (evt.kind == Q.InteractionEvent.ELEMENT_CREATED) {
            console.log('created')
            // console.log(data.name)
            console.log(data.typeFlag)
            if (data.typeFlag === 'meianmozu') {
                // data.parent =
                dragInfo = { data: data, x: data.x, y: data.y }
                var oldSlot = data.parent
                console.log(data.x)
                var slot = findSlot(data, evt)
                console.log(slot)
                if (!slot || slot == oldSlot) {
                    console.log(1111)
                    graph.moveElements([data], dragInfo.x - data.x, dragInfo.y - data.y)
                } else {
                    updateLocation(data, slot)
                }
                dragInfo = null
            }
            // console.log(data.label)
            // console.log(data.image)
            // console.log(data.get('image'))
        }
        if (evt.kind == Q.InteractionEvent.ELEMENT_MOVE_START) {
            if (data.parent && data.parent.get('type') == 'slot') {
                dragInfo = { data: data, x: data.x, y: data.y }
                graph.sendToTop(data)
            } else {
                dragInfo = null
            }
            return
        }
        if (!dragInfo) {
            return
        }
        if (evt.kind == Q.InteractionEvent.ELEMENT_MOVING) {
            var slot = findSlot(data, evt)
            if (!slot) {
                unhighlight()
            } else {
                highlight(slot)
            }
            return
        }
        if (evt.kind == Q.InteractionEvent.ELEMENT_MOVE_END) {
            unhighlight()
            var data = dragInfo.data
            var oldSlot = data.parent
            var slot = findSlot(data, evt)
            if (!slot || slot == oldSlot) {
                graph.moveElements([data], dragInfo.x - data.x, dragInfo.y - data.y)
            } else {
                updateLocation(data, slot)
            }
            dragInfo = null
        }
    })

    */

    graph.addCustomInteraction({
        onmousedown: function(evt, graph) {
            // console.log('aaaa')
            //alert(123)
            graph.focus(true)
        }
    })
}
