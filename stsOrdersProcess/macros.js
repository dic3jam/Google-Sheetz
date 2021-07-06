/** @OnlyCurrentDoc */


function copyTabs() {
  var spreadsheet = SpreadsheetApp.getActive();
  var appSheet = spreadsheet.getSheetByName('Application');
  var bladeCount=appSheet.getRange("f10").getValue();
  var spacerCount=appSheet.getRange("f11").getValue();

  // Where should first duplicated tab be moved to?
  var TabSpot=7;

  // Make blade and spacer tabs
  for(var x=1;x<bladeCount;x++){
    var sheet = spreadsheet.getSheetByName('Blade1').copyTo(spreadsheet);
    var tabName = 'Blade' + (x+1);
    sheet.setName(tabName);
    sheet.getRange("A1").setValue(tabName);
    spreadsheet.setActiveSheet(sheet);
    spreadsheet.moveActiveSheet(TabSpot++);
  }
  TabSpot++;
  for(var x=1;x<spacerCount;x++){
    var sheet = spreadsheet.getSheetByName('Spacer1').copyTo(spreadsheet);
    var tabName = 'Spacer' + (x+1);
    sheet.setName(tabName);
    sheet.getRange("A1").setValue(tabName);
    spreadsheet.setActiveSheet(sheet);
    spreadsheet.moveActiveSheet(TabSpot++);
  }
  spreadsheet.setActiveSheet(appSheet);

};

// Delete 'Start' tab from quotes.
function macrosOpen(){
  var ui = SpreadsheetApp.getUi();
  var spreadsheet = SpreadsheetApp.getActive();
  var startSheet = spreadsheet.getSheetByName('Start');
  if(startSheet){
    var customerSheet = spreadsheet.getSheetByName('Customer');
    var qid=customerSheet.getRange("d1").getValue();
    if(qid != ""){
      //var result = ui.alert(
      //  'Start Tab Exists, qid not blank. Is this a new quote?',
      //    ui.ButtonSet.YES_NO);
      //if (result == ui.Button.YES) {
      //  result = ui.alert(
      //  'Delete Start Tab? (not needed except in template)',
      //    ui.ButtonSet.YES_NO);
      //  if (result == ui.Button.YES) {
          spreadsheet.deleteSheet(startSheet);
      //  }
      //}   
    }
  }
}

function getLinkValue() {
  return SpreadsheetApp.getRange("f5:f5").getValue();
}

function createNewQuote() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var startSheet = spreadsheet.getSheetByName('Start');
  // Destination folder ID is in cell G2 on Start tab
  var destid = startSheet.getRange("g2").getValue();
  var destFolder = DriveApp.getFolderById(destid);
  var custTab = spreadsheet.getSheetByName('Customer');
  var fname = spreadsheet.getRange("c8").getValue();
  var custCode = spreadsheet.getRange("g4").getValue();
  // Set quote ID and custcode on customer tab
  custTab.getRange("d1").setValue(fname);
  custTab.getRange("d3").setValue(custCode);
  SpreadsheetApp.flush();
  
  // Make copy
  var newQuote = DriveApp.getFileById(spreadsheet.getId()).makeCopy(fname, destFolder);
  var newUrl = newQuote.getUrl();
  
  // Popup with link to new quote
  var html='<input type=button value="Open Quote" onClick="window.open(\''+ newUrl + '\')" />';
  var userInterface=HtmlService.createHtmlOutput(html);

  SpreadsheetApp.getUi().showModelessDialog(userInterface, "Go To Link")
  custTab.getRange("d1").setValue("");
  custTab.getRange("d3").setValue("");  
  custTab.getRange("c4").setValue("-");
}
































