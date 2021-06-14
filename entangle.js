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
 var entangleArray = "";
/* to the cell that contains the array
 * Then, set a trigger for the entangleRunner 
 * function.
 */

//For some reason Google Sheets does not like passing
//in values by reference.... so here are some other globals
//if entanglement was already initialized, will not run initEntanglementArray()
var init = false;
//your current sheet
var sheet = SpreadsheetApp.getActiveSpreadsheet();
//the array that will hold all Entangle objects
var entanglements = []

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
   constructor(cell1, cell2) {
    this._sheet = sheet;
    this.cell1Pos = cell1;
    this.cell2Pos = cell2;
    this.cell1Val = this._sheet.getRange(cell1).getValue();
    this.cell2Val = this._sheet.getRange(cell2).getValue();
    if (this.cell1Val == "" && this.cell2Val == ""){
      this.cell1Val = 0;
      this.cell2Val = 0;
      sheet.getRange(this.cell1Pos).setValue(this.cell1Val);
      sheet.getRange(this.cell2Pos).setValue(this.cell2Val);
    } else if (this.cell1Val == "" && this.cell2Val != "") {
      this.cell1Val = this.cell2Val;
    } else if (this.cell2Val == "" && this.cell1Val != "") {
      this.cell2Val = this.cell1Val;
    } else {
      this.cell2Val = this.cell1Val;
    }
  }

  /* function updateCell1
   * If cell2 has been updated, change cell1
   * to reflect
   */
   updateCell1() {
      this.cell2Val = this._sheet.getRange(this.cell2Pos).getValue();
      this.cell1Val = this.cell2Val;
      this._sheet.getRange(this.cell1Pos).setValue(this.cell1Val);
   }

  /* function updateCell2
   * If cell1 has been updated, change cell1
   * to reflect
   */
   updateCell2() {
      this.cell1Val = this._sheet.getRange(this.cell1Pos).getValue();
      this.cell2Val = this.cell1Val;
      this._sheet.getRange(this.cell2Pos).setValue(this.cell2Val);
   }
}

;
//main function for running entanglement
function entangleRunner() {
  if(!init)
    entanglements = initEntangelementArray();
  for(var p of entanglements) {
    if(sheet.getRange(p.cell1Pos).getValue() != p.cell1Val) {
      p.updateCell2();
    } else if(sheet.getRange(p.cell2Pos).getValue() != p.cell2Val) {
      p.updateCell1();
    } 
  }
}

//constructs an array of Entanglements
function initEntangelementArray() {
  var en = readArray();
  var ens = [];
  for(var i = 0; i < en.length; i++) 
    ens.push(new Entangle(en[i][0], en[i][1]));
  init = true;
  return ens;
} 

//pulls in the list of cells that need to be entangled 
//and returns it as an array
function readArray() {
  var i = sheet.getRange(entangleArray).getValue();
  var i = i.split(" ");
  for(var j = 0; j < i.length; j++)
    i[j] = i[j].split(',');
  return i;
}




