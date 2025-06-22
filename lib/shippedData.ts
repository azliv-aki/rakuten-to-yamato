'use client';

import iconv from 'iconv-lite'
import { parse } from 'csv-parse/sync'
import { format } from 'date-fns'

export async function generateShippedCSV(file: File): Promise<{
  filename: string;
  csvBuffer: Buffer;
}> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const decoded = iconv.decode(buffer, 'utf-8')

  const records = parse(decoded, { skip_empty_lines: true })

  const result: string[][] = []
  const today = format(new Date(), 'yyyy-MM-dd')
  const outputDate = format(new Date(), 'yyyyMMdd')
  const orderIdRegex = /^\d{6}-\d{8}-\d{10}$/


  // ヘッダー
  result.push([
    '注文番号',
    '送付先ID',
    '発送明細ID',
    'お荷物伝票番号',
    '配送会社',
    '発送日'
  ])

  for (const row of records) {
    const colA = (row[0] || '').trim()
    const colD = (row[3] || '').trim()

    if (orderIdRegex.test(colA) && colD !== '') {
      result.push([colA, '', '', colD, '1001', outputDate])
    }
  }

  const csvString = result.map(row => row.join(',')).join('\r\n')
  const csvBuffer = iconv.encode(csvString, 'shift_jis')
  const filename = `rakuten-発送完了報告-${outputDate}.csv`

  return { filename, csvBuffer }
}
