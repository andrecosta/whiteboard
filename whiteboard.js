$(function() {
    var canvas = new fabric.Canvas('canvas', {
        defaultCursor: 'none'
    });

    var gridOptions = {
            minorLines: {
                separation: 10,
                color: '#eee'
            },
            majorLines: {
                separation: 100,
                color: 'orange'
            }
        },
        pxd = 1.5, // Pixel deviation
        builderTool = new fabric.Rect({
            name: 'builderTool',
            fill: 'orange',
            width: 10,
            height: 10,
            selectable: false,
            hasControls: false
        });

    // Add initial canvas objects
    draw_test_objects();
    canvas.add(builderTool);
    // Redraw canvas viewport on resize
    $(window).on("resize", function () {
        var container = $('#whiteboard');
        canvas.setWidth(container.width());
        canvas.setHeight(container.height());
        canvas.calcOffset();

        // Draw initial objects
        drawGridLines(gridOptions.majorLines);
        drawGridLines(gridOptions.minorLines);
    }).resize();

    function drawGridLines(lineOptions) {
        var iWidth = canvas.getWidth();
        var iHeight = canvas.getHeight();
        var iCount = null;
        var i = null;
        var x = null;
        var y = null;
        var group = new fabric.Group([], {
            hasControls: false,
            selectable: false
        });

        iCount = Math.floor(iWidth / lineOptions.separation);
        for (i = 1; i <= iCount; i++) {
            x = (i * lineOptions.separation) + 0.5;
            group.add(new fabric.Line([x, 0, x, iHeight], {
                stroke: lineOptions.color
            }));
        }
        iCount = Math.floor(iHeight / lineOptions.separation);
        for (i = 1; i <= iCount; i++) {
            y = (i * lineOptions.separation) + 0.5;
            group.add(new fabric.Line([0, y, iWidth, y], {
                stroke: lineOptions.color
            }));
        }

        canvas.add(group);
        canvas.sendToBack(group);
    }

    function draw_test_objects() {
        canvas.add(new fabric.Rect({
            top: 100 + pxd,
            left: 100 + pxd,
            width: 100,
            height: 100,
            minScaleLimit: 0.5,
            fill: 'rgba(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ', 0.75)'
        }));
        canvas.add(new fabric.Rect({
            top: 200 + pxd,
            left: 200 + pxd,
            width: 100,
            height: 100,
            minScaleLimit: 0.5,
            fill: 'rgba(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ', 0.75)'
        }));
    }

    // Mouse move event
    canvas.on('mouse:move', function(o) {
        var p = canvas.getPointer(o.e);
        var target = canvas.findTarget(o.e);
        //console.log(Math.floor(p.x / gridOptions.minorLines.separation) * gridOptions.minorLines.separation + 1.5);

        coords = {
            x: Math.round((p.x + 4) / gridOptions.minorLines.separation) * gridOptions.minorLines.separation - 4,
            y: Math.round((p.y + 4) / gridOptions.minorLines.separation) * gridOptions.minorLines.separation - 4
        }

        builderTool.set({
            'left': Math.round((p.x - 2) / gridOptions.minorLines.separation) * gridOptions.minorLines.separation - 3.5,
            'top': Math.round((p.y - 5) / gridOptions.minorLines.separation) * gridOptions.minorLines.separation - 3.5
        });

        /*console.log(target);
        if (target) {
            if (target.name != 'builderTool')
            canvas.remove(builderTool);
        }
        else canvas.add(builderTool);*/

        canvas.renderAll();
    });

    // Click object
    canvas.on('mouse:down', function(o) {
      if (o.target) {
        console.log('an object was clicked! ', o.target.type, o.target);
      }
    });

    // Move object
    var moveStep = gridOptions.minorLines.separation;
    canvas.on('object:moving', function(o) {
        var obj = o.target;
        obj.set({
            left: Math.round(obj.left / moveStep) * moveStep + pxd,
            top: Math.round(obj.top / moveStep) * moveStep + pxd
        });
    });

    // Scale object
    var scaleStep = gridOptions.minorLines.separation;
    canvas.on('object:scaling', function(o) {
        var obj = o.target,
            snap = {   // Closest snapping points
                top: Math.round(obj.top / scaleStep) * scaleStep + pxd,
                left: Math.round(obj.left / scaleStep) * scaleStep + pxd,
                bottom: Math.round((obj.top + obj.getHeight()) / scaleStep) * scaleStep + pxd,
                right: Math.round((obj.left + obj.getWidth()) / scaleStep) * scaleStep + pxd
            },
            corner = obj.__corner;

        //console.log(Math.round(obj.scaleX * (scaleStep-obj.scaleX)) / scaleStep);
        console.log(Math.floor(obj.scaleX * scaleStep) / scaleStep);
        // cada 10px a escala so pode incrementar
        obj.set({
            scaleX: Math.floor(obj.scaleX * scaleStep) / scaleStep,
            //scaleY: Math.floor(obj.scaleY * scaleStep) / scaleStep
        });
        if (corner == 'tl' || corner == 'ml' || corner == 'bl') {
            obj.set({
                left: snap.left
            });
        }
        if (corner == 'tr' || corner == 'mr' || corner == 'br') {
            obj.set({
                right: snap.right
            });
        }
        if (corner == 'tl' || corner == 'mt' || corner == 'tr') {
            obj.set({
                top: snap.top
            });
        }
        if (corner == 'bl' || corner == 'mb' || corner == 'br') {
            obj.set({
                bottom: snap.bottom
            });
        }//*/
    });

    // Rotate object
    var angleStep = 45;
    canvas.on("object:rotating", function(o) {
        var obj = o.target;
        var angle = obj.angle;
        console.log(Math.round(angle / angleStep) * angleStep);
        var closestAngle = Math.round(angle / angleStep) * angleStep;
        obj.setAngle(closestAngle);
    });

    // Hover object
    canvas.on('object:over', function(o) {
        console.log(o.target);
        canvas.remove(builderTool);
        canvas.renderAll();
    });
    canvas.on('object:out', function(o) {
        console.log(o.target);
        canvas.add(builderTool);
        canvas.renderAll();
    });



    canvas.renderAll();
});