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
