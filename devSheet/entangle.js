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
 var entangleArray = [{
                        set:"AE8",
                        sheet:"Blade1"
                      }]/*,
                      {
                        set:"",
                        sheet:""
                      }]*/

/* to the cell that contains the array
 */

/***********************************************************************/
//Classes

class EntangleList {

  constructor(protoList, sheet, offset) {  
    this.list = []
    for(var proto of protoList) {
      var entangle = new Entangle(proto, sheet)
      this.list.push(entangle);
    }
    this.sheet = sheet;
    this.refRange = offset;
  }

  checkListValues() {
    for(var entangle of this.list)
      entangle.checkValues(this.sheet);
  }

  toJSON() {
    return { list: this.list, sheet: this.sheet.getSheetName(), refRange: this.refRange.getA1Notation() }
  }

}

class Entangle {
  constructor(proto, sheet, value = 0) {
    this.list = []
    for(var i = 0; i < proto.length; i++) {
      this.list.push(sheet.getRange(proto[i]));
    } 
    if(value) {
        this.value = value;
        this.setValues(sheet)
      } else {

    }
  }

  checkValues(sheet) {
    for(var e of this.list) {
      var newVal = sheet.getRange(e.getA1Notation()).getValue();
      if( newVal != this.value) {
        this.value = newVal;
        setValues(sheet);
        break;
      }
    }
  }

  setValues(sheet) {
    for(var e of this.list) {
      e.setValue(this.value);
    }
  }

  toJSON() {
    var outList = []
    for(var e of this.list) {
      outList.push(e.getA1Notation());
    }
    return { list: outList, value: this.value };
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

function entangleOpen() {
  if(entangleArray == null)
    return;
  for(var en of entangleArray) {
    var En = new Quantum(en);
    var test = En.offset.getValue();
    if (En.offset.getValue() == "") {
      En.makeProtoEntangle();
      var entangleList = new EntangleList(En.protoList, En.sheet, En.offset);
      entangleList.refRange.setValue(JSON.stringify(entangleList));
    }
    else {
      entangleRunner(En);
    }
  }
}

function entangleEdit() {
  for(var en of entangleArray) {
    var En = new Quantum(en);
    entangleRunner(En);
  }
}

/***********************************************************************/
//helpers

/* function entangleRunner
 *
 * @param En - Quantum 
 */
function entangleRunner(En) {
  var tempList = JSON.parse(En.offset.getValue());
  var protoList = []
  for(var e of tempList.list)
    protoList.push(e.list);
  var entangleList = new EntangleList(protoList, En.sheet, En.offset);
  entangleList.checkListValues();
  entangleList.refRange.setValue(JSON.stringify(entangleList));
}