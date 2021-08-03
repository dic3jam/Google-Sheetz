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
 var entangleArray = /*[{
                        set:"AE8",
                        sheet:"Blade1"
                      },
                      {
                        set:"AC7",
                        sheet:"Spacer1"
                      }];*/

/* to the cell that contains the array
 */

/***********************************************************************/
//Classes

/* class EntangleList
 * A list of entanglements per sheet
 * 
 * EntangleList.list - the physical list of Entangles
 * EntangleList.sheet - the sheet object this applies to
 * EntangleList.reRange - the cell to write out the JSON to
 * 
 * @param protoList - list of cells to entangle if initializing,
 * or a set of already existing entanglements (cells plus value)
 * @param sheet - the current sheet this particular EntangleList 
 * applies to
 * @param offset - the cell to write the JSON output to
 * @init - Boolean if initializing for first time
 */
class EntangleList {
  constructor(protoList, sheet, offset, init) {  
    this.list = [];
    for(var proto of protoList) {
      if(init) {       
          var entangle = new Entangle(proto, sheet);
      } else {
          var entangle = new Entangle(proto.Entangle, sheet, proto.value);
      }   
      this.list.push(entangle);
    }
    this.sheet = sheet;
    this.refRange = offset;
  }

  /* function checkListValues
   * iterate through the Entangles and run their 
   * respective checkValue()
   */
  checkListValues() {
    for(var entangle of this.list)
      entangle.checkValues(this.sheet);
  }

  /* function checkListValues
   * iterate through the Entangles and run their 
   * respective checkValue()
   */
  setValues() {
    for(var entangle of this.list)
      entangle.setValues();
  }
  /* function toJSON()
   * JSON string contains the list of entangles in JSON 
   * (recursively stringifies), the name of the sheet,
   * the refRange cell notation
   */
  toJSON() {
    return { EntangleList: this.list, sheet: this.sheet.getSheetName(), refRange: this.refRange.getA1Notation() }
  }

}

/* class Entangle
 * A list of the Range objects
 * to entangle
 * 
 * Entangle.list - list of Range objects
 * Entangle.value - the value all Range objects
 * should reflect
 * 
 * @param proto - the set of cells to entangle
 * @param sheet - sheet object of protos origin
 * @param value - value of this entanglement
 */
class Entangle {
  constructor(proto, sheet, value = 0) {
    this.list = []
    for(var i = 0; i < proto.length; i++) {
      this.list.push(sheet.getRange(proto[i]));
    } 
    this.value = value;
  }

  /* function checkValues
   * iterates through the cells in the entangle, 
   * if a cell has a different value, call
   * setValues to change the value of all cells
   * in the Entangle
   */
  checkValues(sheet) {
    for(var e of this.list) {
      var newVal = sheet.getRange(e.getA1Notation()).getValue();
      if(newVal != this.value) {
        this.value = newVal;
        this.setValues();
        break;
      }
    }
  }

  /* function setValues
   * grabs each Range and changes 
   * the value
   */
  setValues() {
    for(var e of this.list) {
      e.setValue(this.value);
    }
  }

  /* function toJSON
   * makes a new list of this
   * that just captures the A1 notation of each
   * Range, tacks on the value and 
   * @return JSON representation of this
   */
  toJSON() {
    var outList = [];
    for(var e of this.list) {
      outList.push(e.getA1Notation());
    }
    return { Entangle: outList, value: this.value };
  }

}

/* class Quantum
 * container for the current spreadsheet
 * the cell containing the entangle sets
 * 
 * Quantum.sheet - A Spreadsheet object of the current sheet
 * Quantum.set - A range object of the entangleArray cell
 * Quantum.offset - Range of the offset cell (where JSON could or 
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

/* function makeProtoEntangle
 * pulls in the list of cells that need to be entangled 
 * and returns it as an array that can interface with the Entangle
 * constructor
 * @return double array of lists of lists of cells
 */
  makeProtoEntangle() {
    var protoList = this.set.getValue();
    protoList = protoList.split(" ");
    for(var i = 0; i < protoList.length; i++)
      protoList[i] = protoList[i].split(",");
    this.protoList = protoList;
  }
}
/***********************************************************************/
//triggers

/* function entangleOpen
 * called when the order form is first 
 * opened finds the "entangleArray" if
 * filled out, constructs the Entanglement
 * and maintains state by writing a JSON
 * representation to an offset cell
 */
function entangleOpen() {
  if(entangleArray == null)
    return;
  for(var en of entangleArray) {
    var En = new Quantum(en);
    if (En.offset.getValue() == "") {
      En.makeProtoEntangle();
      var entangleList = new EntangleList(En.protoList, En.sheet, En.offset, true);
      entangleList.setValues();
      entangleList.refRange.setValue(JSON.stringify(entangleList));
    }
    else {
      entangleRunner(En);
    }
  }
}

/* function entangleEdit
 * called upon cell edit, iterates
 * through the assigned entanglements
 * and calls entangleRunner to update
 * as necessary
 */
function entangleEdit() {
  for(var en of entangleArray) {
    var En = new Quantum(en);
    entangleRunner(En);
  }
}

/***********************************************************************/
//helpers

/* function entangleRunner
 * parses the JSON string on this sheet,
 * builds a new entanglelist to update values
 * and reacquires state by writing to the adjacent cell
 * @param En - Quantum 
 */
function entangleRunner(En) {
  var tempList = JSON.parse(En.offset.getValue());
  var entangleList = new EntangleList(tempList.EntangleList, En.sheet, En.offset, false);
  entangleList.checkListValues();
  entangleList.refRange.setValue(JSON.stringify(entangleList));
}