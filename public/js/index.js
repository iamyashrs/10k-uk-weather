// The MIT License (MIT)

// Copyright (c) 2015 Zagagy

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

SimpleChartJS = function() {
	
	/***************************
	       Private members
	****************************/ 
	
	var _x_dupFactor = 30;
	var _y_dupFactor = 10;
	var _axis_extra_size = 10;
	
	/***************************
	       Private methods
	****************************/ 

	HighlightInfo = function(id,shouldHighlight)
	{
		var element = document.getElementById(id);
		if (shouldHighlight)
		{
			element.className += " Highlighted ";
		}
		else
		{
			element.className = element.className.replace("Highlighted","");
		}
	},
	
	AddPointToList = function(pt,pointListElement)
	{
		var currElement = document.createElement('li');
		currElement.className = "data-year-li";
		currElement.innerHTML = pt.info;
		currElement.id = pt.infoDivId;
		pointListElement.appendChild(currElement);
	},
	
	DrawPoint = function(pt,chartBoardElement,pointListElement)
	{
		var pointDiv = document.createElement('div');
		pointDiv.id = pt.pointDivId;

		pointDiv.style.left = pt.x + "px";
		pointDiv.style.top = pt.y + "px";
		pointDiv.className = "ChartPoint";
		
		pointDiv.title = pt.info;
		pointDiv.onmouseover = function() { HighlightInfo(pt.infoDivId,true); };
		pointDiv.onmouseout = function() { HighlightInfo(pt.infoDivId,false); };
		
		if (isValid(pointListElement))
		{
			AddPointToList(pt,pointListElement);
		}
		
		chartBoardElement.appendChild(pointDiv);
	},
		
	DrawLine = function(pt1,pt2,chartBoardElement,isUsedForAxis)
	{
		if(pt1.y < pt2.y){
			var pom = pt1.y;
			pt1.y = pt2.y;
			pt2.y = pom;
			pom = pt1.x;
			pt1.x = pt2.x;
			pt2.x = pom;
		}

		var a = Math.abs(pt1.x-pt2.x);
		var b = Math.abs(pt1.y-pt2.y);
		var c;
		var sx = (pt1.x+pt2.x)/2 ;
		var sy = (pt1.y+pt2.y)/2 ;
		var width = Math.sqrt(a*a + b*b ) ;
		var x = sx - width/2;
		var y = sy;

		a = width / 2;

		c = Math.abs(sx-x);

		b = Math.sqrt(Math.abs(pt1.x-x)*Math.abs(pt1.x-x)+Math.abs(pt1.y-y)*Math.abs(pt1.y-y) );

		var cosb = (b*b - a*a - c*c) / (2*a*c);
		var rad = Math.acos(cosb);
		var deg = (rad*180)/Math.PI
		var extraClasses = "";
		if (isUsedForAxis)
		{
			extraClasses = "AxisLine";
		}
		

		var lineDiv = document.createElement('div');
		lineDiv.className = "ChartLine " + extraClasses
		lineDiv.style.width = width+'px';		
		lineDiv.style.webkitTransform = 'rotate('+deg+'deg)';
		lineDiv.style.MozTransform = 'rotate('+deg+'deg)';
		lineDiv.style.msTransform = 'rotate('+deg+'deg)';
		lineDiv.style.OTransform = 'rotate('+deg+'deg)';
		lineDiv.style.transform = 'rotate('+deg+'deg)';
		lineDiv.style.top = (y+5) + "px";
		lineDiv.style.left = (x+5) + "px";
		lineDiv.id = "line_between_"+pt1.Num+"_and_"+pt2.Num;
		chartBoardElement.appendChild(lineDiv);
	},
	
	DrawAxis = function(chartData)
	{
		var chartBoardElement = document.getElementById("chartBoard");
		var boundingRect = chartBoardElement.getBoundingClientRect();
		var lastX = chartData[chartData.length-1].x * _x_dupFactor;
		//draw x axis:
		var xAxis_left = {x:-_axis_extra_size,y:0};
		var xAxis_Right = {x:lastX+_axis_extra_size,y:0};
		DrawLine(xAxis_left,xAxis_Right,chartBoardElement,true);

		console.log(boundingRect);
		
		//draw y axis:
		// var yAxis_top = {x:lastX/2,y:boundingRect.bottom/6-_axis_extra_size};
		var yAxis_top = {x:lastX/2,y:0};
		var xAxis_bottom = {x:lastX/2,y:-boundingRect.bottom/6-_axis_extra_size};
		// var xAxis_bottom = {x:lastX/2,y:-20};
		DrawLine(yAxis_top,xAxis_bottom,chartBoardElement,true);
		
	},
	
	parsePoint = function(pt)
	{
		var output = cloneObject(pt);
		output.x *= _x_dupFactor;
		output.y *= _y_dupFactor;
		return output;
	},
	
	cloneObject = function(srcObj) {
		var output = {};
		for(var i in srcObj) 
		{
			if(typeof(srcObj[i])=="object" && srcObj[i] != null)
			{
				output[i] = cloneObject(srcObj[i]);
			}
			else
			{
				output[i] = srcObj[i];
			}
		}
		return output;
	},
	
	clearBoard = function(chartBoardElement,pointListElement)
	{
		chartBoardElement.innerHTML = "";
		if (isValid(pointListElement))
		{
			pointListElement.innerHTML = "";
		}
	},
	
	isValid = function(obj)
	{
		if (obj != "" && obj != undefined && obj != null)
		{
			return true;
		}
		return false;
	},
	
		
	DrawChart = function(chartdata,chartBoardId,chartListId)
	{
		if (isValid(chartBoardId))
		{
			var chartBoardElement = document.getElementById(chartBoardId);
			var pointListElement;
			if (isValid(chartBoardElement))
			{
				if (isValid(chartListId))
				{
					pointListElement = document.getElementById(chartListId);
				}
				clearBoard(chartBoardElement,pointListElement);
				for (var i=0;i<chartdata.length;i++)
				{
					var currPoint = parsePoint(chartdata[i]);
					if(currPoint.y > 1000){
						currPoint.y = currPoint.y/100;
					}
					currPoint.y = -currPoint.y;	

					DrawPoint(currPoint,chartBoardElement,pointListElement,false);
					if (i > 0)
					{
						var lastPoint = parsePoint(chartdata[i-1]);
						if(lastPoint.y > 1000){
							lastPoint.y = lastPoint.y/100;
						}
						lastPoint.y = -lastPoint.y;	
						DrawLine(currPoint,lastPoint,chartBoardElement);
					}
				}
			}
			DrawAxis(chartdata);
		}
	};

	return {

	/***************************
	       Public methods
	****************************/ 

		DrawChart: function(chartdata,chartBoardId,chartListId)
		{
			if (isValid(chartBoardId))
			{
				var chartBoardElement = document.getElementById(chartBoardId);
				var pointListElement;
				if (isValid(chartBoardElement))
				{
					if (isValid(chartListId))
					{
						pointListElement = document.getElementById(chartListId);
					}
					clearBoard(chartBoardElement,pointListElement);
					for (var i=0;i<chartdata.length;i++)
					{
						var currPoint = parsePoint(chartdata[i]);
						if(currPoint.y > 1000){
							currPoint.y = currPoint.y/100;
						}
						currPoint.y = -currPoint.y;	
						DrawPoint(currPoint,chartBoardElement,pointListElement,false);
						if (i > 0)
						{
							var lastPoint = parsePoint(chartdata[i-1]);
							if(lastPoint.y > 1000){
								lastPoint.y = lastPoint.y/100;
							}
							lastPoint.y = -lastPoint.y;	
							DrawLine(currPoint,lastPoint,chartBoardElement);
						}
					}
				}
				DrawAxis(chartdata);
			}
		}
	};
}

var _simpleChartJS = new SimpleChartJS();

var data = [];
var years = [];
var mode, region;

function loadDATA() {
	mode = document.getElementById("mode").value;
	region = document.getElementById("region").value;
	var x = document.getElementsByClassName("table-data-annual");
	var y = document.getElementsByClassName("table-data-year");
	var i;
	for(i=0; i<x.length; i++){
	  var text = x[i].innerText || x[i].textContent;
	  var year = y[i].innerText || y[i].textContent;
	  data.push(parseFloat(text));
	  years.push(parseInt(year));
	}
	data.pop();
}

function GenerateChart()
{
	loadDATA();

	var h2Elem = document.getElementById("chart-data-list-heading");
	h2Elem.innerHTML = "Data set for Visualization";

	var _amount_of_points = years.length-1;

	var dup_factor = 15;
	var data_ch = [];
	var x = 0;
	for (var i=0;i<_amount_of_points;i++)
	{
	  var currObj = [];
	  var size = data[i];
	  currObj.x = (x+i);
	  currObj.y = size;
	  
	  // currObj.info = "In year " + years[i] + ", " + region +  " had a " + mode + " of " + size + ".";

	  currObj.info = "<strong>" + years[i] + "</strong>" + "->" + size;
	  currObj.pointDivId = "pt"+"_x_" + currObj.x + "_y_" + currObj.y + "_Num_"+ i;
	  currObj.infoDivId = "pt_Info_"+"_x_" + currObj.x + "_y_" + currObj.y + "_Num_"+ i;
	  currObj.Num = i;
	  
	  data_ch.push(currObj);
	}
	_simpleChartJS.DrawChart(data_ch, "chartBoard", "chartList");
}