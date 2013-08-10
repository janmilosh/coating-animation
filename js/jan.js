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
var firstCoatTime = 12;
var coatTime = 4;
var cureTime = 60;
var cycleTime = .2 * 1000;
var loadPauseCycles = 18;						// The arrays take a few seconds to load, this keeps the first box from
ovenFrame.lineColor = "#555";																				// suddenly jumping to the paint station
ovenFrame.circleColor = "#808080";
ovenFrame.svgBackgroundColor = "#fff";
ovenFrame.ovenColor = "rgba(40, 40, 40 ,0.3)";
//
var secondsPerIncrement = (ovenFrame.ovenWidth/12)/conveyorSpeed;
var firstCoatCount = Math.round(firstCoatTime*60/secondsPerIncrement);
var coatCount = Math.round(coatTime*60/secondsPerIncrement);
var cureCount = Math.round(cureTime*60/secondsPerIncrement);
ovenFrame.xShift = 0.75 * ovenFrame.ovenWidth;
ovenFrame.yShift = ovenFrame.ovenHeight;
ovenFrame.totalWidth = (ovenFrame.numberOfOvens + 1) * ovenFrame.ovenWidth;
ovenFrame.totalHeight = ovenFrame.ovenHeight * 3;
ovenFrame.SVGWidth = ovenFrame.totalWidth + ovenFrame.xShift * 2;
ovenFrame.SVGHeight = ovenFrame.totalHeight + ovenFrame.yShift * 2;
var positionIndex = [];
for (i = 0; i <= ovenFrame.numberOfOvens; i++) {
	for (j = 0; j < 3; j++)
		positionIndex[3*i + 1 +j] = [(ovenFrame.xShift + ovenFrame.totalWidth - ovenFrame.ovenWidth * (i + 1)),(ovenFrame.yShift +ovenFrame.totalHeight - (j + 1) * ovenFrame.ovenHeight)];
}
positionIndex[0] = [(ovenFrame.xShift + ovenFrame.totalWidth),(ovenFrame.yShift + 2 * ovenFrame.ovenHeight)];
positionIndex[31] = [(ovenFrame.xShift +  6 * ovenFrame.ovenWidth),(ovenFrame.yShift + ovenFrame.totalHeight)];
positionIndex[32] = [(ovenFrame.xShift + 4 * ovenFrame.ovenWidth),(ovenFrame.yShift + ovenFrame.totalHeight)];
positionIndex[33] = [(ovenFrame.xShift),(ovenFrame.yShift + 2 * ovenFrame.ovenHeight)];
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

ovenFrame.bottomLine = animationSVG.append("svg:line")	
	.attr("x1",ovenFrame.xShift)
	.attr("y1",ovenFrame.yShift + ovenFrame.ovenHeight * 2)
	.attr("x2",ovenFrame.xShift + ovenFrame.totalWidth)
	.attr("y2",ovenFrame.yShift + ovenFrame.ovenHeight * 2)
  	.attr("stroke", ovenFrame.lineColor)
  	.attr("stroke-width", "2");
ovenFrame.ovenLines = [];
for (i = 0; i < ovenFrame.numberOfOvens; i++) {	
	ovenFrame.ovenLines[i] = animationSVG.append("svg:line")	
		.attr("x1",ovenFrame.xShift + (i + 1) * ovenFrame.ovenWidth)
		.attr("y1",ovenFrame.yShift)
		.attr("x2",ovenFrame.xShift + (i + 1) * ovenFrame.ovenWidth)
		.attr("y2",ovenFrame.yShift + ovenFrame.ovenHeight * 2)
	  	.attr("stroke", ovenFrame.lineColor)
	  	.attr("stroke-width", "2");
}
ovenFrame.coatingLines = [];
for (i = 0; i < 2; i++) {	
	ovenFrame.coatingLines[i] = animationSVG.append("svg:line")	
		.attr("x1",ovenFrame.xShift + (4 + 2 * i) * ovenFrame.ovenWidth)
		.attr("y1",ovenFrame.yShift + ovenFrame.totalHeight - ovenFrame.ovenHeight)
		.attr("x2",ovenFrame.xShift + (4 + 2 * i) * ovenFrame.ovenWidth)
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
//        Add timer/counter and labels to svg
//---------------------------------------------------
//
var timer = animationSVG.append("svg:text")	
	.text("Time:")
	.attr("x",ovenFrame.xShift + ovenFrame.totalWidth - 320)
	.attr("y",ovenFrame.yShift + ovenFrame.totalHeight + 0.25 * ovenFrame.ovenHeight)
	.attr("font-size", "32px")
	.attr("font-family", "Helvetica")
	.attr("fill", ovenFrame.lineColor);
var timerText = animationSVG.append("text")
	.attr("class", "timer-text")
	.attr("x", ovenFrame.xShift + ovenFrame.totalWidth - 220)
	.attr("y", ovenFrame.yShift + ovenFrame.totalHeight + 0.25 * ovenFrame.ovenHeight)
	.attr("font-size", "32px")
  .attr("font-family", "Helvetica")
  .attr("fill", ovenFrame.lineColor);
var timer = animationSVG.append("svg:text")	
	.text("minutes")
	.attr("x",ovenFrame.xShift + ovenFrame.totalWidth - 130)
	.attr("y",ovenFrame.yShift + ovenFrame.totalHeight + 0.25 * ovenFrame.ovenHeight)
	.attr("font-size", "32px")
	.attr("font-family", "Helvetica")
	.attr("fill", ovenFrame.lineColor);
var ovenText = animationSVG.append("svg:text")	
	.text("Drying/curing ovens")
	.attr("x",ovenFrame.xShift + ovenFrame.totalWidth/2 - 88)
	.attr("y",ovenFrame.yShift - ovenFrame.ovenHeight/1.45)
	.attr("font-size", "20px")
	.attr("font-family", "Helvetica")
	.attr("fill", ovenFrame.lineColor);
var ovenText = animationSVG.append("svg:text")	
	.text("Outfeed stacker")
	.attr("x",ovenFrame.xShift - 50)
	.attr("y",ovenFrame.yShift + ovenFrame.totalHeight - 25)
	.attr("font-size", "20px")
	.attr("font-family", "Helvetica")
	.attr("fill", ovenFrame.lineColor);
var ovenText = animationSVG.append("svg:text")	
	.text("Infeed de-stacker")
	.attr("x",ovenFrame.xShift + ovenFrame.totalWidth - 100)
	.attr("y",ovenFrame.yShift + ovenFrame.totalHeight - 25)
	.attr("font-size", "20px")
	.attr("font-family", "Helvetica")
	.attr("fill", ovenFrame.lineColor);
var ovenText = animationSVG.append("svg:text")	
	.text("Coating-1")
	.attr("x",ovenFrame.xShift +  6 * ovenFrame.ovenWidth - 42)
	.attr("y",ovenFrame.yShift + ovenFrame.totalHeight + 60)
	.attr("font-size", "20px")
	.attr("font-family", "Helvetica")
	.attr("fill", ovenFrame.lineColor);
var ovenText = animationSVG.append("svg:text")	
	.text("Coating-2")
	.attr("x",ovenFrame.xShift + 4 * ovenFrame.ovenWidth - 42)
	.attr("y",ovenFrame.yShift + ovenFrame.totalHeight + 60)
	.attr("font-size", "20px")
	.attr("font-family", "Helvetica")
	.attr("fill", ovenFrame.lineColor);
	var ovenText = animationSVG.append("svg:text")	
	.text("First coat:  " + firstCoatTime + " minutes")
	.attr("x",ovenFrame.xShift)
	.attr("y", ovenFrame.yShift + ovenFrame.totalHeight + 0.25 * ovenFrame.ovenHeight)
	.attr("font-size", "18px")
	.attr("font-family", "Helvetica")
	.attr("fill", ovenFrame.lineColor);
	var ovenText = animationSVG.append("svg:text")	
	.text("Subsequent coats:  " + coatTime + " minutes")
	.attr("x",ovenFrame.xShift)
	.attr("y", ovenFrame.yShift + ovenFrame.totalHeight + 0.25 * ovenFrame.ovenHeight + 20)
	.attr("font-size", "18px")
	.attr("font-family", "Helvetica")
	.attr("fill", ovenFrame.lineColor);
	var ovenText = animationSVG.append("svg:text")	
	.text("Cure:  " + cureTime + " minutes")
	.attr("x",ovenFrame.xShift)
	.attr("y", ovenFrame.yShift + ovenFrame.totalHeight + 0.25 * ovenFrame.ovenHeight + 40)
	.attr("font-size", "18px")
	.attr("font-family", "Helvetica")
	.attr("fill", ovenFrame.lineColor);
	var ovenText = animationSVG.append("svg:text")	
	.text("Three coating cycles")
	.attr("x",ovenFrame.xShift)
	.attr("y", ovenFrame.yShift + ovenFrame.totalHeight + 0.25 * ovenFrame.ovenHeight + 60)
	.attr("font-size", "18px")
	.attr("font-family", "Helvetica")
	.attr("fill", ovenFrame.lineColor);
//
//---------------------------------------------------
//                 Calculate paths
//---------------------------------------------------
//
box[0].endPauseCycles = 18;					//need to wait at end for other boxes to cycle
box[1].endPauseCycles = -2;					//these values are for differences in travel time for 3 cycles
box[2].endPauseCycles = 9;
box[3].endPauseCycles = 0;
box[4].endPauseCycles = -2;
box[5].endPauseCycles = 2;
box[6].endPauseCycles = -15;
box[7].endPauseCycles = 4;
box[8].endPauseCycles = -30;
box[9].endPauseCycles = 0;
box[0].beginPauseCycles = loadPauseCycles;					//need to wait at beginning for other boxes to cycle
box[1].beginPauseCycles = loadPauseCycles;					
box[2].beginPauseCycles = loadPauseCycles + 3;
box[3].beginPauseCycles = loadPauseCycles + 2;
box[4].beginPauseCycles = loadPauseCycles + 8;
box[5].beginPauseCycles = loadPauseCycles + 4;
box[6].beginPauseCycles = loadPauseCycles + 15;
box[7].beginPauseCycles = loadPauseCycles + 6;
box[8].beginPauseCycles = loadPauseCycles + 24;
box[9].beginPauseCycles = loadPauseCycles + 9;
for (i = 0; i < numberOfBoxes; i++) {									//calculate number of cycles to add at begin and end for each box					
	box[i].beginPauseCycles += firstCoatCount * i/2;
	box[i].endPauseCycles += firstCoatCount * (9 - i)/2;
}
for (i = 0; i < numberOfBoxes; i++) {									// add pause to beginning and end of animation for each box					
	box[i].beginPause = [];
	box[i].endPause = [];
	var beginCycles = box[i].beginPauseCycles;
	var endCycles = box[i].endPauseCycles;	
	for (j = 0; j < beginCycles; j++) {
		box[i].beginPause.push(0);
	}
	for (j = 0; j < endCycles; j++) {
		box[i].endPause.push(33);
	}
}

box[0].path = box[0].path.concat(box[0].beginPause,enterCoatingLineOne(),coatOneOne(),toOvenFiveFromOne(), coatOnePlus(), toOvenFiveFromOne(), coatOnePlus(), toOvenFiveFromOne("end"), box[0].endPause);
box[1].path = box[1].path.concat(box[1].beginPause,enterCoatingLineTwo(),coatOneTwo(),toOvenTenFromTwo(), coatOnePlus(), toOvenTenFromOne(), coatOnePlus(), toOvenTenFromOne("end"), box[1].endPause);
box[2].path = box[2].path.concat(box[2].beginPause,enterCoatingLineOne(),coatOneOne(),toOvenFourFromOne(), coatOnePlus(), toOvenFourFromOne(), coatOnePlus(), toOvenFourFromOne("end"), box[2].endPause);
box[3].path = box[3].path.concat(box[3].beginPause,enterCoatingLineTwo(),coatOneTwo(),toOvenNineFromTwo(), coatOnePlus(), toOvenNineFromOne(), coatOnePlus(), toOvenNineFromOne("end"), box[3].endPause);
box[4].path = box[4].path.concat(box[4].beginPause,enterCoatingLineOne(),coatOneOne(),toOvenThreeFromOne(), coatOnePlus(), toOvenThreeFromOne(), coatOnePlus(), toOvenThreeFromOne("end"), box[4].endPause);
box[5].path = box[5].path.concat(box[5].beginPause,enterCoatingLineTwo(),coatOneTwo(),toOvenEightFromTwo(), coatOnePlus(), toOvenEightFromOne(), coatOnePlus(), toOvenEightFromOne("end"), box[5].endPause);
box[6].path = box[6].path.concat(box[6].beginPause,enterCoatingLineOne(),coatOneOne(),toOvenTwoFromOne(), coatOnePlus(), toOvenTwoFromOne(), coatOnePlus(), toOvenTwoFromOne("end"), box[6].endPause);
box[7].path = box[7].path.concat(box[7].beginPause,enterCoatingLineTwo(),coatOneTwo(),toOvenSevenFromTwo(), coatOnePlus(), toOvenSevenFromOne(), coatOnePlus(), toOvenSevenFromOne("end"), box[7].endPause);
box[8].path = box[8].path.concat(box[8].beginPause,enterCoatingLineOne(),coatOneOne(),toOvenOneFromOne(), coatOnePlus(), toOvenOneFromOne(), coatOnePlus(), toOvenOneFromOne("end"), box[8].endPause);
box[9].path = box[9].path.concat(box[9].beginPause,enterCoatingLineTwo(),coatOneTwo(),toOvenSixFromTwo(), coatOnePlus(), toOvenSixFromOne("pause"), coatOnePlus(), toOvenSixFromOne("end"), box[9].endPause);
for (i = 0; i < numberOfBoxes; i++) {
//console.log(i + " = " + box[i].path.length + "  ")
}
function enterCoatingLineOne() {
	var enterLine = [0,1,4,7,10,13];
	return enterLine;
}
function enterCoatingLineTwo() {
	var enterLine = [0,1,4,7,10,13,16,19];
	return enterLine;
}
function coatOneOne() {											// coat one in coating station one
	var firstCoat = [];
	for (i = 0; i < firstCoatCount; i++) {
		firstCoat.push(31);
	}
	return firstCoat;
}
function coatOneTwo() {											// coat one in coating station two
	var firstCoat = [];
	for (i = 0; i < firstCoatCount; i++) {
		firstCoat.push(32);
	}
	return firstCoat;
}
function coatOnePlus() {									// after coat one in coating station one
	var coating = [];
	for (i = 0; i < coatCount; i++) {
		coating.push(31);
	}
	return coating;
}
function toOvenOneFromOne(end) {
	var goToOvenOne = [];
	var ovenOneReturn = [];
	goToOvenOne = [13,10,7,4,1,2];
	for (i = 0; i < cureCount; i++) {
		goToOvenOne.push(3);
	}
	if (end === "end") {
		ovenOneReturn = [2,1,4,7,10,13,16,19,22,25,28,33];
	} else {
		ovenOneReturn = [2,1,4,7,10,13];
	}
	goToOvenOne = goToOvenOne.concat(ovenOneReturn);
	return goToOvenOne;
}
function toOvenTwoFromOne(end) {
	var goToOvenTwo = [];
	var ovenTwoReturn = [];
	goToOvenTwo = [13,10,7,4,5];
	for (i = 0; i < cureCount; i++) {
		goToOvenTwo.push(6);
	}
	if (end === "end") {
		ovenTwoReturn = [5,4,7,10,13,16,19,22,25,28,33];
	} else {
		ovenTwoReturn = [5,4,7,10,13];
	}
	goToOvenTwo = goToOvenTwo.concat(ovenTwoReturn);
	return goToOvenTwo;
}
function toOvenThreeFromOne(end) {
	var goToOvenThree = [];
	var ovenThreeReturn = [];
	goToOvenThree = [13,10,7,8];
	for (i = 0; i < cureCount; i++) {
		goToOvenThree.push(9);
	}
	if (end === "end") {
		ovenThreeReturn = [8,7,10,13,16,19,22,25,28,33];
	} else {
		ovenThreeReturn = [8,7,10,13];
	}
	goToOvenThree = goToOvenThree.concat(ovenThreeReturn);
	return goToOvenThree;
}
function toOvenFourFromOne(end) {
	var goToOvenFour = [];
	var ovenFourReturn = [];
	goToOvenFour = [13,10,11];
	for (i = 0; i < cureCount; i++) {
		goToOvenFour.push(12);
	}
	if (end === "end") {
		ovenFourReturn = [11,10,13,16,19,22,25,28,33];
	} else {
		ovenFourReturn = [11,10,13];
	}
	goToOvenFour = goToOvenFour.concat(ovenFourReturn);
	return goToOvenFour;
}
function toOvenFiveFromOne(end) {
	var goToOvenFive = [];
	var ovenFiveReturn = [];
	goToOvenFive = [13,14];
	for (i = 0; i < cureCount; i++) {
		goToOvenFive.push(15);
	}
	if (end === "end") {
		ovenFiveReturn = [14,13,16,19,22,25,28,33];
	} else {
		ovenFiveReturn = [14,13];
	}
	goToOvenFive = goToOvenFive.concat(ovenFiveReturn);
	return goToOvenFive;
}
function toOvenSixFromOne(end) {
	var goToOvenSix = [];
	var ovenSixReturn = [];
	goToOvenSix = [13,16,17];
	for (i = 0; i < cureCount; i++) {
		goToOvenSix.push(18);
	}
	if (end === "end") {
		ovenSixReturn = [17,16,19,22,25,28,33];
	} else if (end === "pause") {
		ovenSixReturn = [17,16,16,16,16,13];
	} else {
		ovenSixReturn = [17,16,13];
	}
	goToOvenSix = goToOvenSix.concat(ovenSixReturn);
	return goToOvenSix;
}
function toOvenSixFromTwo() {
	var goToOvenSix = [];
	var ovenSixReturn = [];
	goToOvenSix = [19,16,17];
	for (i = 0; i < cureCount; i++) {
		goToOvenSix.push(18);
	}
	ovenSixReturn = [17,16,13];
	goToOvenSix = goToOvenSix.concat(ovenSixReturn);
	return goToOvenSix;
}
function toOvenSevenFromOne(end) {
	var goToOvenSeven = [];
	var ovenSevenReturn = [];
	goToOvenSeven = [13,16,19,20];
	for (i = 0; i < cureCount; i++) {
		goToOvenSeven.push(21);
	}
	if (end === "end") {
		ovenSevenReturn = [20,19,22,25,28,33];
	} else {
		ovenSevenReturn = [20,19,16,13];
	}
	goToOvenSeven = goToOvenSeven.concat(ovenSevenReturn);
	return goToOvenSeven;
}
function toOvenSevenFromTwo() {
	var goToOvenSeven = [];
	var ovenSevenReturn = [];
	goToOvenSeven = [19,20];
	for (i = 0; i < cureCount; i++) {
		goToOvenSeven.push(21);
	}
	ovenSevenReturn = [20,19,16,13];
	goToOvenSeven = goToOvenSeven.concat(ovenSevenReturn);
	return goToOvenSeven;
}
function toOvenEightFromOne(end) {
	var goToOvenEight = [];
	var ovenEightReturn = [];
	goToOvenEight = [13,16,19,22,23];
	for (i = 0; i < cureCount; i++) {
		goToOvenEight.push(24);
	}
	if (end === "end") {
		ovenEightReturn = [23,22,25,28,33];
	} else {
		ovenEightReturn = [23,22,19,16,13];
	}
	goToOvenEight = goToOvenEight.concat(ovenEightReturn);
	return goToOvenEight;
}
function toOvenEightFromTwo() {
	var goToOvenEight = [];
	var ovenEightReturn = [];
	goToOvenEight = [19,22,23];
	for (i = 0; i < cureCount; i++) {
		goToOvenEight.push(24);
	}
	ovenEightReturn = [23,22,19,16,13];
	goToOvenEight = goToOvenEight.concat(ovenEightReturn);
	return goToOvenEight;
}
function toOvenNineFromOne(end) {
	var goToOvenNine = [];
	var ovenNineReturn = [];
	goToOvenNine = [13,16,19,22,25,26];
	for (i = 0; i < cureCount; i++) {
		goToOvenNine.push(27);
	}
	if (end === "end") {
		ovenNineReturn = [26,25,28,33];
	} else {
		ovenNineReturn = [26,25,22,19,16,13];
	}
	goToOvenNine = goToOvenNine.concat(ovenNineReturn);
	return goToOvenNine;
}
function toOvenNineFromTwo() {
	var goToOvenNine = [];
	var ovenNineReturn = [];
	goToOvenNine = [19,22,25,26];
	for (i = 0; i < cureCount; i++) {
		goToOvenNine.push(27);
	}
	ovenNineReturn = [26,25,22,19,16,13];
	goToOvenNine = goToOvenNine.concat(ovenNineReturn);
	return goToOvenNine;
}
function toOvenTenFromOne(end) {
	var goToOvenTen = [];
	var ovenTenReturn = [];
	goToOvenTen = [13,16,19,22,25,28,29];
	for (i = 0; i < cureCount; i++) {
		goToOvenTen.push(30);
	}
	if (end === "end") {
		ovenTenReturn = [29,28,33];
	} else {
		ovenTenReturn = [29,28,25,22,19,16,13];
	}
	goToOvenTen = goToOvenTen.concat(ovenTenReturn);
	return goToOvenTen;
}
function toOvenTenFromTwo() {
	var goToOvenTen = [];
	var ovenTenReturn = [];
	goToOvenTen = [19,22,25,28,29];
	for (i = 0; i < cureCount; i++) {
		goToOvenTen.push(30);
	}
	ovenTenReturn = [29,28,25,22,19,16,13];
	goToOvenTen = goToOvenTen.concat(ovenTenReturn);
	return goToOvenTen;
}

//
//---------------------------------------------------
//                 Animate boxes
//---------------------------------------------------
//
function animation() {
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
			var normalizedTime = j - loadPauseCycles;							//This is added to sync the timer so start time is zero
			if (normalizedTime < 0) normalizedTime = 0;						//because a delay is added for loading of the arrays
			animationSVG.selectAll(".timer-text")	
				.transition()
				.delay(j * cycleTime)
				.duration(cycleTime)
				.text((Math.round(((normalizedTime)* secondsPerIncrement/60) * 10) / 10).toFixed(1));
		}
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
	.attr("y", ovenFrame.yShift - ovenFrame.ovenHeight/2)
	.attr("fill", ovenFrame.ovenColor);
}