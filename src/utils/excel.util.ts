import xlsx from 'xlsx';

export default class Excel {
  static read<T>(buffer: Buffer): Array<T> {
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const data = xlsx.utils.sheet_to_json<T>(worksheet);

    return data;
  }
}
