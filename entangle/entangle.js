/* entangle.gs
 * Entangle two cells so an
 * updated value in one also
 * updates in another
 * @author Jim DiCesare
 * 
 * To use entangle, add a javascript array in a random cell
 * in your google sheet. This array must be in the following
 * format:
 * Cell1,Cell2 Cell3,Cell4 Cell5,Cell6
 * So sets of cells to entangle separated by a space, 
 * Cells to entangle separated by a comma
 **************Set this variable:**********************/
 var entangleArray = "H1";
/* to the cell that contains the array
 * Then, set a trigger for the entangleRunner 
 * function.
 */

class Entangle {
  /* constructor 
   * Initializes a set of entangled cells 
   * if value in one but not the other, both set to 
   * that value else if both already have a value
   * value is set to cell1, else both set to 0
   * @param cell1 - first cell to entangle
   * @param cell2 - second cell to entangle
   * @param sheet - the sheet this particular entanglement 
   * set is for
   */
   constructor(...args) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    if(args.length == 2) {
        this.entangleList(sheet, args);
    } else if (args.length == 4) {
        this.entangleJSON(sheet, args);
    } else
        null;
  }
  entangleList(sheet, args) {
    this.cell1Pos = args[0];
    this.cell2Pos = args[1];
    this.cell1Val = sheet.getRange(args[0]).getValue();
    this.cell2Val = sheet.getRange(args[1]).getValue();
    if (this.cell1Val == "" && this.cell2Val == ""){
        this.cell1Val = 0;
        this.cell2Val = 0;
        sheet.getRange(this.cell1Pos).setValue(this.cell1Val);
        sheet.getRange(this.cell2Pos).setValue(this.cell2Val);
    } else if (this.cell1Val == "" && this.cell2Val != "") {
        this.updateCell1(sheet);
    } else if (this.cell2Val == "" && this.cell1Val != "") {
        this.updateCell2(sheet);
    } else {
        this.updateCell2(sheet);
    }
  }
  entangleJSON(sheet, args) {
    this.cell1Pos = args[0];
    this.cell2Pos = args[1];
    this.cell1Val = args[2];
    this.cell2Val = args[3];
    if (this.cell1Val == "" && this.cell2Val == ""){
        this.cell1Val = 0;
        this.cell2Val = 0;
        sheet.getRange(this.cell1Pos).setValue(this.cell1Val);
        sheet.getRange(this.cell2Pos).setValue(this.cell2Val);
    } else if (this.cell1Val == "" && this.cell2Val != "") {
        this.updateCell1(sheet);
    } else if (this.cell2Val == "" && this.cell1Val != "") {
        this.updateCell2(sheet);
    } /*else {
        this.updateCell2(sheet);
    } */
  }
  /* function updateCell1
   * If cell2 has been updated, change cell1
   * to reflect
   */
   updateCell1(sheet) {
      this.cell2Val = sheet.getRange(this.cell2Pos).getValue();
      this.cell1Val = this.cell2Val;
      sheet.getRange(this.cell1Pos).setValue(this.cell1Val);
   }

  /* function updateCell2
   * If cell1 has been updated, change cell2
   * to reflect
   */
   updateCell2(sheet) {
      this.cell1Val = sheet.getRange(this.cell1Pos).getValue();
      this.cell2Val = this.cell1Val;
      sheet.getRange(this.cell2Pos).setValue(this.cell2Val);
   }
}
/***********************************************************************/

function onOpen(e) {
  initEntangelementArray();
}

function onEdit(e) {
  entangleRunner();
}

/***********************************************************************/
function entangleRunner() { 
  sheet = SpreadsheetApp.getActiveSpreadsheet();
  var ens = parseEntangleJSON();
  for(var p of ens) {
    if(sheet.getRange(p.cell1Pos).getValue() != p.cell1Val) {
      p.updateCell2(sheet);
    } 
    if(sheet.getRange(p.cell2Pos).getValue() != p.cell2Val) {
      p.updateCell1(sheet);
    } 
  }
  getAdjacentCell().setValue(JSON.stringify(ens));
}

/***********************************************************************/
//constructs an array of Entanglements
function initEntangelementArray() {
 if(getAdjacentCell().getValue() == "")
    return parseEntangleList();
  else {
    getAdjacentCell().setValue(JSON.stringify(ens));
    return parseEntangleJSON();
  }
} 

function parseEntangleList() {
  var en = readArray();
  var ens = [];
  for(var i = 0; i < en.length; i++) 
    ens.push(new Entangle(en[i][0], en[i][1]));
  var cell = getAdjacentCell();
  cell.setValue(JSON.stringify(ens));
  return ens;
}

function parseEntangleJSON() {
  var cell = getAdjacentCell();
  var ob = JSON.parse(cell.getValue());
  var ens = [];
  for(var e of ob) {
    ens.push(new Entangle(e.cell1Pos, e.cell2Pos, e.cell1Val, e.cell2Val));
  }
  return ens;
}

//pulls in the list of cells that need to be entangled 
//and returns it as an array
function readArray() {
  var i = SpreadsheetApp.getActiveSpreadsheet().getRange(entangleArray).getValue();
  var i = i.split(" ");
  for(var j = 0; j < i.length; j++)
    i[j] = i[j].split(',');
  return i;
}

function getAdjacentCell() {
  return SpreadsheetApp.getActiveSpreadsheet().getRange(entangleArray).offset(0,1);
}




