/* entangle.gs
 * Entangle two cells so an
 * updated value in one also
 * updates in another
 * @author Jim DiCesare
 * @email jimdicesare@gmail.com
 * 
 * To use entangle, add a list in a random cell
 * in your google sheet. This array must be in the following
 * format:
 * Cell1,Cell2 Cell3,Cell4 Cell5,Cell6
 * So sets of cells to entangle separated by a space, 
 * Cells to entangle separated by a comma
 **************Set this variable:**********************/
 var entangleArray = null;/*[{
                        set:"",
                        sheet:""
                      },
                      {
                        set:"",
                        sheet:""
                      }]*/

/* to the cell that contains the array
 */

class Entangle {
  /* constructor 
   * Initializes a set of entangled cells 
   * if value in one but not the other, both set to 
   * that value else if both already have a value
   * value is set to cell1, else both set to 0
   * Can construct with 2 named locations (list being passed it)
   * or receive a parsed JSON version of entangled cells
   * returns the Entangle OR null if wrong number of arguments inputted
   */
   constructor(sheet, ...args) {
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

/* class Quantum
 * container for the current spreadsheet
 * the cell containing the entangle sets
 * 
 * Particle.sheet - A Spreadsheet object of the current sheet
 * Particle.set - A range object of the entangleArray cell
 * Particle.offset - Range of the offset cell (where JSON could or 
 * would be)
 * 
 * @param en - the object containing the location of the 
 * entangleArray, and the name of the sheet it is on
 */
class Quantum {
  constructor(en) {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    this.sheet = spreadsheet.getSheetByName(en.sheet);
    this.set = this.sheet.getRange(en.set)
    this.offset = this.set.offset(0,1);
  }
}
/***********************************************************************/
//triggers
function entangleOpen() {
  if(entangleArray == null)
    return;
  for(var en of entangleArray) {
    var En = new Quantum(en);
    if (En.offset.getValue() == "") 
      parseEntangleList(En);
    else
      parseEntangleJSON(En);
  }
}

function entangleEdit() {
  for(var en of entangleArray) {
    var En = new Quantum(en);
    entangleRunner(En);
  }
}
/***********************************************************************/
//runner functions

/* function entangleRunner
 * Triggered by an Edit event, gets the JSON version of
 * the Entanglement Array, checks the current state of the
 * Entangled cells. If cell2 updated, it updates cell1 and vice
 * versa
 * @param En - Quantum for current entangle set
 */
function entangleRunner(En) { 
  var ens = JSON.parse(En.offset.getValue());
  for(var p of ens) {
    var check1Val = En.sheet.getRange(p.cell1Pos).getValue()
    var check2Val = En.sheet.getRange(p.cell2Pos).getValue()
    if(p.cell1Val != check1Val) {
      En.sheet.getRange(p.cell2Pos).setValue(check1Val);
      p.cell1Val = check1Val;
      p.cell2Val = check1Val;
      check2Val = check1Val;
    } 
    if(p.cell2Val != check2Val) {
      En.sheet.getRange(p.cell1Pos).setValue(check2Val);
      p.cell1Val = check2Val;
      p.cell2Val = check2Val;
    } 
  }
  En.offset.setValue(JSON.stringify(ens));
}

/***********************************************************************/
//helper functions

/* function parseEntangleList
 * used to read in the initial entangled pairs
 * cells to entangle are declared at the top of this file
 * by setting the "entangleArray" variable to the cell with
 * pairs constructed in the following format:
 * A1,B1 C2,D2, E5,J6
 * So cell comma cell space cell comma space .....
 * Very important
 * @param Q - Quantum for current sheet
 * @return an array of Entangle objects
 */
function parseEntangleList(Q) {
  var en = readArray(Q.set);
  var ens = [];
  for(var i = 0; i < en.length; i++) 
    ens.push(new Entangle(Q.sheet, en[i][0], en[i][1]));
  Q.offset.setValue(JSON.stringify(ens));
  return ens;
}

/* function parseEntangleJSON
 * reads the cell adjacent to entangleArray 
 * parses the content and builds a new Entangle
 * object array 
 * @param Q Quantum used to access the location of the JSON string
 * @return array of Entangle objects
 */
function parseEntangleJSON(Q) {
  var ob = JSON.parse(Q.offset.getValue());
  var ens = [];
  for(var e of ob) {
    ens.push(new Entangle(Q.sheet, e.cell1Pos, e.cell2Pos, e.cell1Val, e.cell2Val));
  }
  return ens;
}

/* function readArray
 * pulls in the list of cells that need to be entangled 
 * and returns it as an array that can interface with the Entangle
 * constructor
 * @param range - range to read in
 * @return double array of cells[0-1][cellName]
 */
function readArray(range) {
  var i = range.getValue();
  var i = i.split(" ");
  for(var j = 0; j < i.length; j++)
    i[j] = i[j].split(',');
  return i;
}