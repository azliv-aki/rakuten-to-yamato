import { classifyProduct } from './classifyProduct';

export function convertRakutenToYamato(rawRows: string[][]): string[][] {
  const header = rawRows[0].map((h) => h.trim().replace(/^"|"$/g, ''));
  const dataRows = rawRows.slice(1);

  const today = new Date();
  const todayStr = `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`;

  const safeGet = (row: string[], columnName: string) => {
    const index = header.indexOf(columnName);
    if (index === -1) {
      console.warn(`⚠️ ヘッダー「${columnName}」が見つかりません`);
      return '';
    }
    return (row[index] || '').trim().replace(/^"|"$/g, '');
  };

  const yamatoHeader = [
    'お客様管理番号',
    '送り状種別',
    '温度区分',
    '予備4',
    '出荷予定日',
    '配達指定日',
    '配達時間帯区分',
    '届け先コード',
    '届け先電話番号',
    '届け先電話番号(枝番)',
    '届け先郵便番号',
    '届け先住所',
    'お届け先建物名（ｱﾊﾟｰﾄﾏﾝｼｮﾝ名）',
    '会社・部門名１',
    '会社・部門名２',
    '届け先名',
    '届け先名(カナ)',
    '敬称',
    '依頼主コード',
    '依頼主電話番号',
    '依頼主電話番号(枝番)',
    '依頼主郵便番号',
    '依頼主住所',
    '依頼主建物名（ｱﾊﾟｰﾄﾏﾝｼｮﾝ名）',
    '依頼主名（漢字）',
    '依頼主名(カナ)',
    '品名コード１',
    '品名１',
    '品名コード２',
    '品名2',
    '荷扱い１',
    '荷扱い２',
    '記事',
    'コレクト代金引換額(税込)',
    'コレクト内消費税額',
    '営業所止置き',
    '止め置き営業所コード',
    '発行枚数',
    '個数口枠の印字',
    '請求先顧客コード',
    '請求先分類コード',
    '運賃管理番号',
  ];

  const yamatoData: string[][] = [yamatoHeader];

  for (const row of dataRows) {
    const orderNumber = safeGet(row, '受注番号');
    const zip = `${safeGet(row, '送付先郵便番号１')}${safeGet(row, '送付先郵便番号２')}`;
    const name = `${safeGet(row, '送付先名字')} ${safeGet(row, '送付先名前')}`;
    const phone = `${safeGet(row, '送付先電話番号１')}-${safeGet(row, '送付先電話番号２')}-${safeGet(row, '送付先電話番号３')}`;
    const productNameRaw = safeGet(row, '商品名');

    const { itemName, deliveryType } = classifyProduct(productNameRaw);

    const utils = deliveryType + '  ' + name;

    // 住所分割
    const pref = safeGet(row, '送付先住所：都道府県');
    const city = safeGet(row, '送付先住所：都市区') || '';
    const town = safeGet(row, '送付先住所：町以降');

    const townParts = town.split(' ');
    const address1 = pref + city + (townParts[0] || '');
    const address2 = townParts[1] || '';
    const address3 = townParts[2] || '';
    const address4 = townParts[3] || '';

    const line = [
      orderNumber, // ✅ お客様管理番号（受注番号）
      deliveryType,         // ✅ 送り状種別
      '', '',      // 温度区分, 予備4
      todayStr,    // ✅ 出荷予定日
      '', '',      // 配達指定日, 時間帯
      '',          // 届け先コード
      phone, '',   // 電話番号と枝番
      zip,
      address1,
      address2, address3, address4,  // 建物・会社・部門
      name, '',    // 名前、カナ
      '様',
      '', '053-545-5033', '', '4350035', '静岡県浜松市中央区西伝寺町72', 'オギスビル2階', 'AZLIV公式オンラインストア', '', // 依頼主情報
      utils, itemName, '', '',        // 品名1のみ使用
      '', '',                         // 荷扱い
      '', '',                         // コレクト
      '', '',                         // 営業所止置き
      '',                            // 発行枚数
      '', '',                             // 個数印字
      '090646923639',                 // ✅ 請求先顧客コード（仮に固定）
      '',                             // 請求先分類コード
      '01',                            // ✅ 運賃管理番号（仮に固定）
    ];

    yamatoData.push(line);
  }

  return yamatoData;
}
