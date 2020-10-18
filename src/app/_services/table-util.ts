import * as XLSX from 'xlsx';
import * as moment from 'moment';

const getFileName = (name: string) => {
  let now = moment();
  let sheetName = name || 'GdpPrcCompareList';
  let fileName = `${sheetName} ${now.format('DD-MM-YYYY')}`;
  return {
    sheetName,
    fileName
  };
};
export class TableUtil {
  static exportTableToExcel(tableId: string, name?: string) {
    let { sheetName, fileName } = getFileName(name);
    let targetTableElm = document.getElementById(tableId);
    let wb = XLSX.utils.table_to_book(targetTableElm, <XLSX.Table2SheetOpts>{
      sheet: sheetName,
      raw: true
    });
    const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(targetTableElm,  {raw:true});
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');
    XLSX.writeFile(wb, `${fileName}.xlsx`,<XLSX.WritingOptions>{ bookType: 'xlsx', type: 'buffer' });
  }

  static exportArrayToExcel(arr: any[], name?: string) {
    let { sheetName, fileName } = getFileName(name);

    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(arr);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }
}
