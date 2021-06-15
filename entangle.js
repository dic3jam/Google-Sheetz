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
   constructor(cell1, cell2) {
    this._sheet = SpreadsheetApp.getActiveSpreadsheet();
    this.cell1Pos = cell1;
    this.cell2Pos = cell2;
    this.cell1Val = this._sheet.getRange(cell1).getValue();
    this.cell2Val = this._sheet.getRange(cell2).getValue();
    if (this.cell1Val == "" && this.cell2Val == ""){
      this.cell1Val = 0;
      this.cell2Val = 0;
      this._sheet.getRange(this.cell1Pos).setValue(this.cell1Val);
      this._sheet.getRange(this.cell2Pos).setValue(this.cell2Val);
    } else if (this.cell1Val == "" && this.cell2Val != "") {
      this.updateCell1();
    } else if (this.cell2Val == "" && this.cell1Val != "") {
      this.updateCell2();
    } else {
      this.updateCell2();
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
   * If cell1 has been updated, change cell2
   * to reflect
   */
   updateCell2() {
      this.cell1Val = this._sheet.getRange(this.cell1Pos).getValue();
      this.cell2Val = this.cell1Val;
      this._sheet.getRange(this.cell2Pos).setValue(this.cell2Val);
   }
}
/***********************************************************************/
function getAdjacentCell() {
  return SpreadsheetApp.getActiveSpreadsheet().getRange(entangleArray.getRow(), entangleArray.getColumn()+1);
}

function onOpen(e) {
  initEntangelementArray();
}

function onEdit(e) {
  entangleRunner();
}

/***********************************************************************/
function entangleRunner() {
  var entanglements = getEntangleArray();
  if(!entanglements)
    entanglements = initEntangelementArray();
  for(var p of entanglements) {
    if(sheet.getRange(p.cell1Pos).getValue() != p.cell1Val) {
      p.updateCell2();
    } else if(sheet.getRange(p.cell2Pos).getValue() != p.cell2Val) {
      p.updateCell1();
    } 
  }
}

//finds the stored entangleArray, if it exists
function getEntangleArray() {
  var cell = getAdjacentCell();
  if(cell.getValue() == "")
    return false;
  else 
    return JSON.parse(cell.getValue());
}

/***********************************************************************/
//constructs an array of Entanglements
function initEntangelementArray() {
  var en = readArray();
  var ens = [];
  for(var i = 0; i < en.length; i++) 
    ens.push(new Entangle(en[i][0], en[i][1]));
  var cell = getAdjacentCell();
  cell.setValue(JSON.stringify(ens));
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




