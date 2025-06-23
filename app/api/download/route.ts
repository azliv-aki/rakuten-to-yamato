export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import { convertRakutenToYamato } from '@/lib/rakutenToYamato';
import iconv from 'iconv-lite';
import { parse } from 'csv-parse/sync';

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'ファイルが送信されていません' }, { status: 400 });
  }

  // Shift_JIS（cp932）でデコード
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const text = iconv.decode(buffer, 'cp932');

  // CSVパース
  const rawLines: string[][] = parse(text, {
    relax_column_count: true,
    skip_empty_lines: true,
  });

  // 楽天CSVをヤマト形式に変換
  const yamatoData = convertRakutenToYamato(rawLines);

  // ExcelJSでxlsx生成
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('送り状');

  const fontStyle = {
    name: '游ゴシック',
    size: 12,
    color: { argb: 'FF000000' },
  };

  // 書き込み処理
  yamatoData.forEach((row, rowIndex) => {
    const excelRow = sheet.getRow(rowIndex + 1);
    row.forEach((cell, colIndex) => {
      const cellRef = excelRow.getCell(colIndex + 1);
      cellRef.value = cell;
      cellRef.font = fontStyle;
    });
    excelRow.commit();
  });

  // .xlsx バッファとして出力
  const bufferOut = await workbook.xlsx.writeBuffer();

  return new Response(bufferOut, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="yamato.xlsx"',
    },
  });
}
