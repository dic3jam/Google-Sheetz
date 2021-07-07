/* sideNav
 * Script behind the side
 * navigation for the blade sheets
 * @author Jim DiCesare
 * @email jimdicesare@gmail.com
 */

function sideNavOpen() {
	var nSheet = SpreadsheetApp.getActiveSheet().getName();
	//var nSheet = e.source.getName(); 
	SpreadsheetApp.getUi()
	.createMenu("NavBar")
	.addItem('Navigation', 'showSidebar')
	.addToUi();
}

function showSidebar() {
	var sidebar = HtmlService.createHtmlOutputFromFile('sideNavStruct')
		.setTitle("Blade Sheet Navigation")
	SpreadsheetApp.getUi().showSidebar(sidebar);	
}

function goToIndex(ind) {
	var indices = getIndices();	
	var sheet = SpreadsheetApp.getActive();
	sheet.setActiveRange(sheet.getRange(indices[ind]));
}

function getIndices() {
	var indices = {
		ind0: "A21",
		ind1: "A52",
		ind2: "A100",
		ind3: "A125",
		ind4: "A155",
		ind5: "A202",
		ind6: "A243",
		ind7: "A288",
		ind8: "A340",
		ind9: "A363",
		indA: "A385",
		indB: "A403",
		indC: "A428",
		indD: "A458",
		indE: "A490",
		indF: "A518"
	}
	return indices;
}
