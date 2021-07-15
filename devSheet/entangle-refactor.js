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

  checkValues() {
    for(var entangle of this.list)
      entangle.checkValues();
    //TODO test does this strringify the entangle object or just a reference?
    this.refRange.setValue(JSON.stringify(this));
  }

}

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
  constructor(proto, sheet) {
    this.list = []
    for(var i = 0; i < proto.length; i++) {
      this.list.push(sheet.getRange(proto[i]));
      if(i > 0) 
        this.list[i].setValue(this.list[0].getValue());
    } 
    this.value = list[0];
  }

  checkValues() {
    for(var e of this.list) {
      if(e.getValue() != this.value) {
        this.value = e.getValue();
        setValues();
        break;
      }
    }
  }

  setValues() {
    for(var e of this.list) {
      e.setValue(this.value);
    }
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
    if (En.offset.getValue() == "") {
      En.makeProtoEntangle();
      var EntangleList = new EntangleList(En.protoList, En.sheet, En.offset);
      entangleRunner(EntangleList);
    }
    else
      var EntangleList = JSON.parse(En.offset.getValue());
      EnL.checkValues();
  }
}

function entangleEdit() {
  for(var en of entangleArray) {
    var En = new Quantum(en);
    var EntangleList = JSON.parse(En.offset.getValue());
    EnL.checkValues();
  }
}
/***********************************************************************/





