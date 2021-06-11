/* entangle.gs
 * Entangle two cells so an
 * updated value in one also
 * updates in another
 * @author Jim DiCesare
 * 
 * To use entanglement, add a javascript array in a random cell
 * in your google sheet. This array must be in the following
 * format:
 * [['Cell1','Cell2'],['Cell3','Cell4']]
 */

//Add which cell holds the array here:
var entangleArray = "";

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
   constructor(cell1, cell2, sheet) {
    this.sheet = sheet;
    this.cell1Pos = cell1.getA1Notation();
    this.cell2Pos = cell2.getA1Notation();
    this.cell1Val = cell1.getValue();
    this.cell2Val = cell2.getValue();
    if (this.cell1Val == "" && this.cell2Val == ""){
      this.cell1Val = 0;
      this.cell2Val = 0;
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
      this.cell2Val = this.sheet.getValue(this.cell2Pos);
      this.cell1Val = this.cell2Val;
   }

  /* function updateCell2
   * If cell1 has been updated, change cell1
   * to reflect
   */
   updateCell2() {
      this.cell1Val = this.sheet.getValue(this.cell1Pos);
      this.cell2Val = this.cell1Val;
   }

   
}

//helpers
function initEntangelementArray(entangleArray) {
     var en = []
     foreach(e in entangeArray) 
      en.append(Entangle(e[0], e[1], SpreadsheetApp.getActiveSpreadsheet())); 
     return en;
} 

function entangleRunner(entangleArray) {

}

//script
var en = initEntangelementArray(entangleArray);
entangleRunner(en);


