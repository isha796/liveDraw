$scope.line = function()
	{
		stopLine = false;
		stopCircle = true;

		if(stopLine)
			return;
		var drawing = false;
	    canvas.addEventListener('mousedown', onMouseDown, false);
	    canvas.addEventListener('mouseup', onMouseUp, false);
	    canvas.addEventListener('mouseout', onMouseUp, false);
	    canvas.addEventListener('mousemove', throttle(onMouseMove, 1), false);

	    function drawLine(x0, y0, x1, y1, color, emit){
	        context.beginPath();
	        x0 = x0-offsetLeft;
	        x1 = x1-offsetLeft;
	        y0 = y0-offsetTop;
	        y1 = y1-offsetTop;
	        context.moveTo(x0, y0);
	        context.lineTo(x1, y1);
	        context.strokeStyle = color;
	        context.lineWidth = 2;
	        context.stroke();
	        context.closePath();
	    }

	    function onMouseDown(e){
	        drawing = true;
	        current.x = e.clientX;
	        current.y = e.clientY;
	    }

	    function onMouseUp(e){
	        if (!drawing) { return; }
	        drawing = false;
	        if(!stopLine){
	        	drawLine(current.x, current.y, e.clientX, e.clientY, current.color, true);
	        }
	    }

	    function onMouseMove(e){
	        if (!drawing) { return; }
	        if(!stopLine){
	        	drawLine(current.x, current.y, e.clientX, e.clientY, current.color, true);
		        current.x = e.clientX;
		        current.y = e.clientY;
	    	}
	    }

	    function onColorUpdate(e){
	        current.color = e.target.className.split(' ')[1];
	    }

	    // limit the number of events per second
	    function throttle(callback, delay) {
	    	if(stopLine)
	    		return;

	        var previousCall = new Date().getTime();
	        return function() {
	        var time = new Date().getTime();

	        if ((time - previousCall) >= delay) {
	            previousCall = time;
	            callback.apply(null, arguments);
	        }
	        };
	    }

	    function onDrawingEvent(data){
	        var w = canvas.width;
	        var h = canvas.height;
	        drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color);
	    }
	}