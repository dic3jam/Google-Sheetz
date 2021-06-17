/* sideNav
 * Script behind the side
 * navigation for the blade sheets
 * @author Jim DiCesare
 * @email jimdicesare@gmail.com
 */

function onOpen(e) {
	var nSheet = SpreadsheetApp.getActiveSheet().getName();
	//var nSheet = e.source.getName(); 
	if(nSheet.includes("Blade")) {
		SpreadsheetApp.getUi()
		.createMenu("NavBar")
		.addItem('Navigation', 'showSidebar')
		.addToUi();
	}
}

function showSidebar() {
	var sidebar = HtmlService.createHtmlOutputFromFile('sideNavStruct')
		.setTitle("Blade Sheet Navigation")
	SpreadsheetApp.getUi().showSidebar(sidebar);	
}

function goToIndex() {
  var ind = 'indF';
	var indices = getIndices();	
	var sheet = SpreadsheetApp.getActive();
	sheet.setActiveRange(sheet.getRange(indices[ind]));
}

function getIndices() {
	var indices = {
		ind0: "A7",
		ind1: "A39",
		ind2: "A85",
		ind3: "A115",
		ind4: "A138",
		ind5: "A185",
		ind6: "A230",
		ind7: "A273",
		ind8: "A340",
		ind9: "A352",
		indA: "A384",
		indB: "A397",
		indC: "A424",
		indD: "A450",
		indE: "A476",
		indF: "A505"
	}
	return indices;
}
