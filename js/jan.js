//***************************************************
//***************************************************
//
//               Assembly Line Animation
//
//***************************************************
//---------------------------------------------------
//                   Define variables 
//---------------------------------------------------
//
var i, j, k;
var box = {};
var ovenFrame = {};
//
var numberOfBoxes = 10;
ovenFrame.numberOfOvens = 10;
var boxHeight = 12 * 5.4;
var boxWidth = 12 * 5;
ovenFrame.ovenWidth = 12 * 7;
ovenFrame.ovenHeight = 12 * 7;
var conveyorSpeed = 1.4;
var firstCoatTime = 5/4;
var coatTime = 4/4;
var cureTime = 60/4;
var cycleTime = .3 * 1000;
ovenFrame.lineColor = "#555";
ovenFrame.circleColor = "#808080";
ovenFrame.svgBackgroundColor = "#fff";
ovenFrame.ovenColor = "rgba(40, 40, 40 ,0.3)";
//
var secondsPerIncrement = (ovenFrame.ovenWidth/12)/conveyorSpeed;
var firstCoatCount = Math.round(firstCoatTime*60/secondsPerIncrement);
var coatCount = Math.round(coatTime*60/secondsPerIncrement);
var cureCount = Math.round(cureTime*60/secondsPerIncrement);
ovenFrame.xShift = 0.75 * ovenFrame.ovenWidth;
ovenFrame.yShift = 0.75 * ovenFrame.ovenHeight;
ovenFrame.totalWidth = (ovenFrame.numberOfOvens + 1) * ovenFrame.ovenWidth;
ovenFrame.totalHeight = ovenFrame.ovenHeight * 4;
ovenFrame.SVGWidth = ovenFrame.totalWidth + ovenFrame.xShift * 2;
ovenFrame.SVGHeight = ovenFrame.totalHeight + ovenFrame.yShift * 2;
var positionIndex = [];
for (i = 0; i <= ovenFrame.numberOfOvens; i++) {
	for (j = 0; j < 4; j++)
		positionIndex[4*i + 6 +j] = [(ovenFrame.xShift + ovenFrame.totalWidth - ovenFrame.ovenWidth * i),(ovenFrame.yShift +ovenFrame.totalHeight - (j + 1) * ovenFrame.ovenHeight)];
}
positionIndex[0] = [(ovenFrame.xShift + ovenFrame.totalWidth),(ovenFrame.yShift + ovenFrame.totalHeight)];
positionIndex[1] = [(ovenFrame.xShift + ovenFrame.totalWidth - 2 * ovenFrame.ovenWidth),(ovenFrame.yShift + ovenFrame.totalHeight)];
positionIndex[2] = [(ovenFrame.xShift + ovenFrame.totalWidth - 4 * ovenFrame.ovenWidth),(ovenFrame.yShift + ovenFrame.totalHeight)];
positionIndex[3] = [(ovenFrame.xShift + ovenFrame.totalWidth - 6 * ovenFrame.ovenWidth),(ovenFrame.yShift + ovenFrame.totalHeight)];
positionIndex[4] = [(ovenFrame.xShift + ovenFrame.totalWidth - 8 * ovenFrame.ovenWidth),(ovenFrame.yShift + ovenFrame.totalHeight)];
positionIndex[5] = [ovenFrame.xShift,ovenFrame.yShift];
//
//---------------------------------------------------
//           Create svg inside of container
//---------------------------------------------------
//
d3.select("body").style("background", ovenFrame.svgBackgroundColor);
d3.select("#container").style("width", ovenFrame.SVGWidth + "px").style("margin", "50px auto 10px");
var animationSVG = d3.select("#container")         
    .append("svg")
    .attr("width", ovenFrame.SVGWidth)
    .attr("height", ovenFrame.SVGHeight)
    .style("background", ovenFrame.svgBackgroundColor);
//
//---------------------------------------------------
//             Draw tracks inside of svg
//---------------------------------------------------
//
ovenFrame.topLine = animationSVG.append("svg:line")	
	.attr("x1",ovenFrame.xShift)
	.attr("y1",ovenFrame.yShift)
	.attr("x2",ovenFrame.xShift + ovenFrame.totalWidth)
	.attr("y2",ovenFrame.yShift)
  	.attr("stroke", ovenFrame.lineColor)
  	.attr("stroke-width", "2");
ovenFrame.bottomLine = animationSVG.append("svg:line")	
	.attr("x1",ovenFrame.xShift + ovenFrame.ovenWidth)
	.attr("y1",ovenFrame.yShift + ovenFrame.totalHeight - ovenFrame.ovenHeight)
	.attr("x2",ovenFrame.xShift + ovenFrame.ovenWidth * (1 + ovenFrame.numberOfOvens))
	.attr("y2",ovenFrame.yShift + ovenFrame.totalHeight - ovenFrame.ovenHeight)
  	.attr("stroke", ovenFrame.lineColor)
  	.attr("stroke-width", "2");
ovenFrame.ovenLines = [];
for (i = 0; i <= ovenFrame.numberOfOvens; i++) {	
	ovenFrame.ovenLines[i] = animationSVG.append("svg:line")	
		.attr("x1",ovenFrame.xShift + (i + 1) * ovenFrame.ovenWidth)
		.attr("y1",ovenFrame.yShift)
		.attr("x2",ovenFrame.xShift + (i + 1) * ovenFrame.ovenWidth)
		.attr("y2",ovenFrame.yShift + ovenFrame.totalHeight - ovenFrame.ovenHeight)
	  	.attr("stroke", ovenFrame.lineColor)
	  	.attr("stroke-width", "2");
}
ovenFrame.coatingLines = [];
for (i = 0; i < 5; i++) {	
	ovenFrame.coatingLines[i] = animationSVG.append("svg:line")	
		.attr("x1",ovenFrame.xShift - (2*i) * ovenFrame.ovenWidth + ovenFrame.totalWidth)
		.attr("y1",ovenFrame.yShift + ovenFrame.totalHeight - ovenFrame.ovenHeight)
		.attr("x2",ovenFrame.xShift - (2*i) * ovenFrame.ovenWidth + ovenFrame.totalWidth)
		.attr("y2",ovenFrame.yShift + ovenFrame.totalHeight)
	  	.attr("stroke", ovenFrame.lineColor)
	  	.attr("stroke-width", "2");
}
//
//---------------------------------------------------
//   Mark index positions with circles and numbers
//---------------------------------------------------
//
for (i = 0; i <positionIndex.length; i++) {
	var circles = animationSVG.append("svg:circle")
		.attr("cx", positionIndex[i][0])
		.attr("cy", positionIndex[i][1])
		.attr("r", 4)
		.style("fill", ovenFrame.circleColor);
	//var labels = animationSVG.append("svg:text")
	//	.text(i)
	//	.attr("x", positionIndex[i][0] + 6)
	//	.attr("y", positionIndex[i][1] + 18)
	//	.style("fill", ovenFrame.circleColor);
}
//
//---------------------------------------------------
//           Add rectangles with text to svg
//---------------------------------------------------
//
var box = [];
for (i = 0; i < numberOfBoxes; i++) {						//create array of boxes
	box[i] = {};
	box[i].boxClass = "box-" + (i);
	box[i].textClass = "text-" + (i);
	box[i].layer = [];
	box[i].path = [];
	if (i <= 8) {											//adjust text position for double digits
		box[i].textShiftX = 10;
		} else {
		box[i].textShiftX = 20;
	}
	box[i].animate = animationSVG.append("rect") 			//append rectangles
		.attr("class", box[i].boxClass)
		.attr("width", boxWidth)
	   	.attr("height", boxHeight)
	   	.attr("x", positionIndex[[0]][0] - boxWidth/2)
		.attr("y", positionIndex[[0]][1] - boxHeight/2)
		.attr("fill", "rgba(68, 44, 252, 0.8)");
	box[i].boxText = animationSVG.append("text") 			//append text
		.attr("class", box[i].textClass)
		.text(i + 1)
		.attr("x", positionIndex[0][0] - box[i].textShiftX)
		.attr("y", positionIndex[0][1] + 12)
		.attr("fill", "#eee")
		.attr("font-size", "40px");
}
//
//---------------------------------------------------
//             Add timer/counter to svg
//---------------------------------------------------
//
var timer = animationSVG.append("svg:text")	
		.text("Minutes:")
		.attr("x",ovenFrame.xShift)
		.attr("y",ovenFrame.yShift + ovenFrame.totalHeight)
	  	.attr("font-size", "32px")
	  	.attr("font-family", "Helvetica")
	  	.attr("fill", ovenFrame.lineColor);

var timerText = animationSVG.append("text").attr("class", "timer-text");
//
//---------------------------------------------------
//                 Calculate paths
//---------------------------------------------------
//

for (j = 0; j < numberOfBoxes; j++) {	// All boxes start with first color
	box[j].layerColor = [];
	for (i = 0; i < box[0].path.length; i++) {
		box[j].layerColor.push(color1);
	}
}
box[0].endPauseCycles = 30+26;					//need to wait at beginning and end for other boxes to cycle
box[1].endPauseCycles = 32+19;					//these values are for differences in travel time for 3 cycles
box[2].endPauseCycles = 28+14;
box[3].endPauseCycles = 24+12;
box[4].endPauseCycles = 20+10;
box[5].endPauseCycles = 16+8;
box[6].endPauseCycles = 12+6;
box[7].endPauseCycles = 8+4;
box[8].endPauseCycles = 4+2;
box[9].endPauseCycles = 0;
box[0].beginPauseCycles = 0;					//need to wait at beginning and end for other boxes to cycle
box[1].beginPauseCycles = 5+2;					//these values are for differences in travel time for 3 cycles
box[2].beginPauseCycles = 7+5;
box[3].beginPauseCycles = 9+5;
box[4].beginPauseCycles = 11+5;
box[5].beginPauseCycles = 13+5;
box[6].beginPauseCycles = 15+5;
box[7].beginPauseCycles = 17+5;
box[8].beginPauseCycles = 19+5;
box[9].beginPauseCycles = 21+5;
for (i = 0; i < numberOfBoxes; i++) {					//calculate number of cycles to add at begin and end								
	box[i].beginPauseCycles += firstCoatCount * i;		//for each box
	box[i].endPauseCycles += firstCoatCount * (9 - i);
}
box[0].beginPauseCycles = 0;
for (i = 0; i < numberOfBoxes; i++) {						
	box[i].beginPause = [];
	box[i].endPause = [];
	var beginCycles = box[i].beginPauseCycles;
	var endCycles = box[i].endPauseCycles;	
	for (j = 0; j < beginCycles; j++) {
		box[i].beginPause.push(0);
	}
	for (j = 0; j < endCycles; j++) {
		box[i].endPause.push(5);
	}
}

box[0].path = box[0].path.concat(box[0].beginPause,enterCoatingLine(),coatOne(),toOvenOne(), coatTwoPlus(), toOvenOne(), coatTwoPlus(), toOvenOne("end"), box[0].endPause);
box[1].path = box[1].path.concat(box[1].beginPause,enterCoatingLine(),coatOne(),toOvenTwo(), coatTwoPlus(), toOvenTwo(), coatTwoPlus(), toOvenTwo("end"), box[1].endPause);
box[2].path = box[2].path.concat(box[2].beginPause,enterCoatingLine(),coatOne(),toOvenThree(), coatTwoPlus(), toOvenThree(), coatTwoPlus(), toOvenThree("end"), box[2].endPause);
box[3].path = box[3].path.concat(box[3].beginPause,enterCoatingLine(),coatOne(),toOvenFour(), coatTwoPlus(), toOvenFour(), coatTwoPlus(), toOvenFour("end"), box[3].endPause);
box[4].path = box[4].path.concat(box[4].beginPause,enterCoatingLine(),coatOne(),toOvenFive(), coatTwoPlus(), toOvenFive(), coatTwoPlus(), toOvenFive("end"), box[4].endPause);
box[5].path = box[5].path.concat(box[5].beginPause,enterCoatingLine(),coatOne(),toOvenSix(), coatTwoPlus(), toOvenSix(), coatTwoPlus(), toOvenSix("end"), box[5].endPause);
box[6].path = box[6].path.concat(box[6].beginPause,enterCoatingLine(),coatOne(),toOvenSeven(), coatTwoPlus(), toOvenSeven(), coatTwoPlus(), toOvenSeven("end"), box[6].endPause);
box[7].path = box[7].path.concat(box[7].beginPause,enterCoatingLine(),coatOne(),toOvenEight(), coatTwoPlus(), toOvenEight(), coatTwoPlus(), toOvenEight("end"), box[7].endPause);
box[8].path = box[8].path.concat(box[8].beginPause,enterCoatingLine(),coatOne(),toOvenNine(), coatTwoPlus(), toOvenNine(), coatTwoPlus(), toOvenNine("end"), box[8].endPause);
box[9].path = box[9].path.concat(box[9].beginPause,enterCoatingLine(),coatOne(),toOvenTen(), coatTwoPlus(), toOvenTen(), coatTwoPlus(), toOvenTen("end"), box[9].endPause);

function enterCoatingLine() {
	var enterLine = [0,6,10,14];
	return enterLine;
}
function coatOne() {
	var firstCoat = [];
	for (i = 0; i < firstCoatCount; i++) {
		firstCoat.push(1);
	}
	return firstCoat;
}
function coatTwoPlus() {
	var coating = [];
	for (i = 0; i < coatCount; i++) {
		coating.push(1);
	}
	return coating;
}
function toOvenOne(end) {
	var goToOvenOne = [];
	var ovenOneReturn = [];
	goToOvenOne = [14,10];
	for (i = 0; i < cureCount; i++) {
		goToOvenOne.push(11);
	}
	if (end === "end") {
		ovenOneReturn = [12,13,17,21,25,29,33,37,41,45,49,5];
	} else {
		ovenOneReturn = [12,13,9,8,7,6,10,14];
	}
	goToOvenOne = goToOvenOne.concat(ovenOneReturn);
	return goToOvenOne;
}
function toOvenTwo(end) {
	var goToOvenTwo = [];
	var ovenTwoReturn = [];
	goToOvenTwo = [14];
	for (i = 0; i < cureCount; i++) {
		goToOvenTwo.push(15);
	}
	if (end === "end") {
		ovenTwoReturn = [16,17,21,25,29,33,37,41,45,49,5];
	} else {
		ovenTwoReturn = [16,17,13,9,8,7,6,10,14];
	}
	goToOvenTwo = goToOvenTwo.concat(ovenTwoReturn);
	return goToOvenTwo;
}
function toOvenThree(end) {
	var goToOvenThree = [];
	var ovenThreeReturn = [];
	goToOvenThree = [14,18];
	for (i = 0; i < cureCount; i++) {
		goToOvenThree.push(19);
	}
	if (end === "end") {
		ovenThreeReturn = [20,21,25,29,33,37,41,45,49,5];
	} else {
		ovenThreeReturn = [20,21,17,13,9,8,7,6,10,14];
	}
	goToOvenThree = goToOvenThree.concat(ovenThreeReturn);
	return goToOvenThree;
}
function toOvenFour(end) {
	var goToOvenFour = [];
	var ovenFourReturn = [];
	goToOvenFour = [14,18,22];
	for (i = 0; i < cureCount; i++) {
		goToOvenFour.push(23);
	}
	if (end === "end") {
		ovenFourReturn = [24,25,29,33,37,41,45,49,5];
	} else {
		ovenFourReturn = [24,25,21,17,13,9,8,7,6,10,14];
	}
	goToOvenFour = goToOvenFour.concat(ovenFourReturn);
	return goToOvenFour;
}
function toOvenFive(end) {
	var goToOvenFive = [];
	var ovenFiveReturn = [];
	goToOvenFive = [14,18,22,26];
	for (i = 0; i < cureCount; i++) {
		goToOvenFive.push(27);
	}
	if (end === "end") {
		ovenFiveReturn = [28,29,33,37,41,45,49,5];
	} else {
		ovenFiveReturn = [28,29,25,21,17,13,9,8,7,6,10,14];
	}
	goToOvenFive = goToOvenFive.concat(ovenFiveReturn);
	return goToOvenFive;
}
function toOvenSix(end) {
	var goToOvenSix = [];
	var ovenSixReturn = [];
	goToOvenSix = [14,18,22,26,30];
	for (i = 0; i < cureCount; i++) {
		goToOvenSix.push(31);
	}
	if (end === "end") {
		ovenSixReturn = [32,33,37,41,45,49,5];
	} else {
		ovenSixReturn = [32,33,29,25,21,17,13,9,8,7,6,10,14];
	}
	goToOvenSix = goToOvenSix.concat(ovenSixReturn);
	return goToOvenSix;
}
function toOvenSeven(end) {
	var goToOvenSeven = [];
	var ovenSevenReturn = [];
	goToOvenSeven = [14,18,22,26,30,34];
	for (i = 0; i < cureCount; i++) {
		goToOvenSeven.push(35);
	}
	if (end === "end") {
		ovenSevenReturn = [36,37,41,45,49,5];
	} else {
		ovenSevenReturn = [36,37,33,29,25,21,17,13,9,8,7,6,10,14];
	}
	goToOvenSeven = goToOvenSeven.concat(ovenSevenReturn);
	return goToOvenSeven;
}
function toOvenEight(end) {
	var goToOvenEight = [];
	var ovenEightReturn = [];
	goToOvenEight = [14,18,22,26,30,34,38];
	for (i = 0; i < cureCount; i++) {
		goToOvenEight.push(39);
	}
	if (end === "end") {
		ovenEightReturn = [40,41,45,49,5];
	} else {
		ovenEightReturn = [40,41,37,33,29,25,21,17,13,9,8,7,6,10,14];
	}
	goToOvenEight = goToOvenEight.concat(ovenEightReturn);
	return goToOvenEight;
}
function toOvenNine(end) {
	var goToOvenNine = [];
	var ovenNineReturn = [];
	goToOvenNine = [14,18,22,26,30,34,38,42];
	for (i = 0; i < cureCount; i++) {
		goToOvenNine.push(43);
	}
	if (end === "end") {
		ovenNineReturn = [44,45,49,5];
	} else {
		ovenNineReturn = [44,45,41,37,33,29,25,21,17,13,9,8,7,6,10,14];
	}
	goToOvenNine = goToOvenNine.concat(ovenNineReturn);
	return goToOvenNine;
}
function toOvenTen(end) {
	var goToOvenTen = [];
	var ovenTenReturn = [];
	goToOvenTen = [14,18,22,26,30,34,38,42,46];
	for (i = 0; i < cureCount; i++) {
		goToOvenTen.push(47);
	}
	if (end === "end") {
		ovenTenReturn = [48,49,5];
	} else {
		ovenTenReturn = [48,49,45,41,37,33,29,25,21,17,13,9,8,7,6,10,14];
	}
	goToOvenTen = goToOvenTen.concat(ovenTenReturn);
	return goToOvenTen;
}

//
//---------------------------------------------------
//                 Animate boxes
//---------------------------------------------------
//
function animation() {
	setTimeout(function(){
		for (var j = 0; j < box[0].path.length; j++) {
			for (var k = 0; k < numberOfBoxes; k++) {
				animationSVG.selectAll("." + box[k].boxClass)	
					.transition()
					.delay(j * cycleTime)
					.duration(cycleTime)
					.ease("linear")
					.attr("x", positionIndex[box[k].path[j]][0] - boxWidth/2)
					.attr("y", positionIndex[box[k].path[j]][1] - boxHeight/2);
				animationSVG.selectAll("." + box[k].textClass)	
					.transition()
					.delay(j * cycleTime)
					.duration(cycleTime)
					.ease("linear")
					.attr("x", positionIndex[box[k].path[j]][0] - box[k].textShiftX)
					.attr("y", positionIndex[box[k].path[j]][1] + 12);
			}
			animationSVG.selectAll(".timer-text")	
				.transition()
				.delay(j * cycleTime)
				.duration(cycleTime)
				.text((Math.round((j * secondsPerIncrement/15) * 10) / 10).toFixed(1))
				.attr("x", ovenFrame.xShift + 135)
				.attr("y", ovenFrame.yShift + ovenFrame.totalHeight)
				.attr("font-size", "32px")
			  	.attr("font-family", "Helvetica")
			  	.attr("fill", ovenFrame.lineColor);
		}
	
	},500);
}
animation();
//
//---------------------------------------------------
//                    Add ovens
//---------------------------------------------------
//
ovenFrame.ovens = [];
for (i = 0; i < ovenFrame.numberOfOvens; i++) {
	ovenFrame.ovens[i] = animationSVG.append("svg:rect")			
	.attr("width", ovenFrame.ovenWidth - 2)
   	.attr("height", ovenFrame.ovenHeight -2)		
	.attr("x", ovenFrame.xShift + (i + 1) * ovenFrame.ovenWidth - ovenFrame.ovenWidth/2)
	.attr("y", ovenFrame.yShift + ovenFrame.ovenHeight * 2 - ovenFrame.ovenHeight/2)
	.attr("fill", ovenFrame.ovenColor);
}