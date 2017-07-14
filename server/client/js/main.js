var app = angular.module('liveDraw', []);

app.controller('drawCtrl', drawCtrl);
app.directive('toolbox', toolbox);
app.directive('pallete', pallete);

    function toolbox() {
    return {
        restrict: 'E',
        templateUrl: 'template/toolbox.html',
        replace: true,
        link: function (scope, iElement, iAttrs) {
            
        }
    };
}

function pallete() {
    return {
        restrict: 'E',
        templateUrl: 'template/pallete.html',
        replace: true,
        link: function (scope, iElement, iAttrs) {
            
        }
    };
}

function drawCtrl($scope){
	var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var offsetTop = canvas.parentElement.offsetTop;
    var offsetLeft = canvas.parentElement.offsetLeft;
    canvas.width = canvas.parentElement.offsetWidth-40;
	canvas.height = window.innerHeight-offsetTop-30;
    var current = {
        color: 'red'
    };

    var stopCircle = false;
    var stopLine = false;

    $scope.eraser = function()
    {
	    canvas.addEventListener('mousedown', onMouseDown, false);
	    canvas.addEventListener('mouseup', onMouseUp, false);
	    canvas.addEventListener('mouseout', onMouseUp, false);
	    canvas.addEventListener('mousemove', throttle(onMouseMove, 1), false);

	    function drawLine(x0, y0, x1, y1, emit){
	        context.beginPath();
	        x0 = x0-offsetLeft;
	        x1 = x1-offsetLeft;
	        y0 = x0-offsetTop;
	        y1 = y1-offsetTop;
	        context.moveTo(x0, y0);
	        context.lineTo(x1, y1);
	        context.strokeStyle = 'white';
	        context.lineWidth = 5;
	        context.stroke();
	        context.closePath();
	    }

	    function onMouseDown(e){
	        current.x = e.clientX;
	        current.y = e.clientY;
	    }

	    function onMouseUp(e){
	        drawLine(current.x, current.y, e.clientX, e.clientY, true);
	    }

	    function onMouseMove(e){
	        drawLine(current.x, current.y, e.clientX, e.clientY, true);
	        current.x = e.clientX;
	        current.y = e.clientY;
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
	}

	$scope.circle = function()
	{
		stopCircle = false;
		stopLine = true;
		if(stopCircle)
			return;
		canvas.addEventListener('click', onClick,false);
		canvas.addEventListener('click', throttle(onClick, 1), false);

		function onClick(e)
		{
			if(stopCircle)
				return;
			current.x = e.clientX;
			current.y = e.clientY;
			context.beginPath();
			context.arc(current.x,current.y,20,0,Math.PI*2);
			context.stroke();
			context.closePath();
		}
		

		function throttle(callback, delay) {
			if(stopCircle)
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
	}

	$scope.line = function()
	{
		stopLine = false;
		stopCircle = true;
		
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
}
