var app = angular.module('liveDraw', []);
app.controller('drawCtrl', drawCtrl);
app.directive('toolbox', toolbox);
app.directive('pallete', pallete);

    function toolbox() {
    return {
        restrict: 'E',
        templateUrl: 'template/toolbox.html',
        replace: true,
    };
}

function pallete() {
    return {
        restrict: 'E',
        templateUrl: 'template/pallete.html',
        replace: true,
        link: function (scope, elem, attrs){
            scope.changePaint = function(indx){
                scope.color = scope.colors[indx];
                scope.selected = indx;
            }
        }
    };
}

function drawCtrl($scope){
    var socket = io();

    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    var offsetTop = canvas.parentElement.offsetTop;
    var offsetLeft = canvas.parentElement.offsetLeft;
    canvas.width = canvas.parentElement.offsetWidth-50;
    canvas.height = window.innerHeight-offsetTop-30;

    $scope.size = 2;
    
    var current ={};
    $scope.color = 'black';
    $scope.colors=["#ffffff","#060606","#263238","#bdbdbd","#4e342e","#dd2c00","#ef6c00","#ffff00","#ffeb3b","#aeea00","#64dd17","#1b5e20","#4caf50","#dce775","#64ffda","#00b0ff","#0277bd","#03a9f4","#311b92","#6200ea","#9575cd","#f50057","#ff1744","#ad1457","#e91e63","#ffcdd2","#f3e5f5"];

       socket.on('drawing', draw);

    function draw(data){
        if(data.type == 0 || data.type == 1){
            $scope.line(data.type,data.size);
            $scope.line.drawLine(data.x0, data.y0, data.x1, data.y1, data.color, data.size);
        }
        else if(data.type == 2){
            $scope.circle(data.type,data.size);
            $scope.circle.drawCircle(data.x0, data.y0, data.color, data.size);
        }
    }

    $scope.line = function(val,size){

        $scope.type = val;
        $scope.size = size;

        canvas.addEventListener('mousedown', onMouseDown, false);
        canvas.addEventListener('mouseup', onMouseUp, false);
        canvas.addEventListener('mouseout', onMouseUp, false);
        canvas.addEventListener('mousemove', throttle(onMouseMove, 1), false);
            
        var drawing = false;

        function drawLine(x0, y0, x1, y1,color,size, emit){
            var typeVal = $scope.type;
            data = {x0 : x0, x1 : x1, y0: y0, y1: y1,color: color,size: size, type: typeVal};
            context.beginPath();
            x0 = x0-offsetLeft;
            x1 = x1-offsetLeft;
            y0 = y0-offsetTop;
            y1 = y1-offsetTop;
            context.moveTo(x0, y0);
            context.lineTo(x1, y1);
            context.strokeStyle = color;
            context.lineWidth = size;
            context.stroke();
            context.closePath();

            if(drawing)
                socket.emit('drawing',data);
        }
        $scope.line.drawLine = drawLine;

        function onMouseDown(e){
            drawing = true;
            current.x = e.clientX;
            current.y = e.clientY;
        }

        function onMouseUp(e){
            if (!drawing) { return; }
            drawing = false;
            if($scope.type==1 || $scope.type==0){
                drawLine(current.x, current.y, e.clientX, e.clientY, $scope.color, $scope.size, true);
            }
        }

        function onMouseMove(e){
            if (!drawing) { return; }
            if($scope.type==1 || $scope.type==0){
                drawLine(current.x, current.y, e.clientX, e.clientY, $scope.color, $scope.size, true);
            }
            current.x = e.clientX;
            current.y = e.clientY;
        }

        // limit the number of events per second
        function throttle(callback, delay) {
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

    $scope.circle = function(val,size)
    {
        $scope.type = val;
        $scope.size = size;

        canvas.addEventListener('click', onClick,false);
        canvas.addEventListener('click', throttle(onClick, 1), false);

        function onClick(e)
        {
            if($scope.type == 2){
                current.x = e.clientX;
                current.y = e.clientY;
                drawCircle(current.x,current.y,$scope.color,$scope.size);
                var color = $scope.color;
                var size = $scope.size;
                var type = $scope.type;
                data ={x0 : current.x, y0:current.y, x1:0, y1:0,color:color,size:size, type:type};
                socket.emit('drawing',data);
            }
        }

        function drawCircle(x,y,color,size)
        {
            if($scope.type == 2){
                x = x-offsetLeft;
                y = y-offsetTop;
                context.beginPath();
                context.arc(x,y,30,0,Math.PI*2);
                context.strokeStyle = color;
                context.lineWidth = size;
                context.stroke();
                context.closePath();
            }
        }
        $scope.circle.drawCircle = drawCircle;
        

        function throttle(callback, delay) {
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

    $scope.eraser = function(){
        $scope.color = 'white';
        $scope.selected = -1;
        $scope.line(0,20);
    }    
}