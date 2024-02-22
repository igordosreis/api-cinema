import xlsx from 'xlsx';
import { SUPERAPP_CINEMA_BASE_URL } from '../constants';

export default class ExcelUtil {
  public static read<T>(buffer: Buffer): Array<T> {
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const data = xlsx.utils.sheet_to_json<T>(worksheet);

    return data;
  }

  public static writeErrorFileWIthUrl(errorsArray: string[][]) {
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.aoa_to_sheet(errorsArray);
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Planilha 1');

    const fileName = `falha-registro-vouchers-${Number(new Date())}.xlsx`;
    const filePath = `uploads/dashboard/excel/${fileName}`;
    xlsx.writeFile(workbook, filePath);

    const fileUrl = `${SUPERAPP_CINEMA_BASE_URL}/dashboard/excel/${fileName}`;

    return fileUrl;
  }
}
