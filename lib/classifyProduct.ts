type DeliveryType = 'A' | '8' | '0';

const rules: { keyword: string; itemName: string; deliveryType: DeliveryType }[] = [
  { keyword: 'fitグローブ', itemName: 'FITグローブ', deliveryType: 'A' },
  { keyword: 'ニースリーブpro', itemName: 'ニースリーブPRO', deliveryType: '0' },
  { keyword: 'ニースリーブ', itemName: 'ニースリーブ', deliveryType: 'A' },
  { keyword: '3mm エルボースリーブ', itemName: '3mm エルボースリーブ', deliveryType: 'A' },
  { keyword: '7mm エルボースリーブ', itemName: '7mm エルボースリーブ', deliveryType: 'A' },
  { keyword: '8の字', itemName: '8の字リストストラップ', deliveryType: 'A' },
  { keyword: 'トレーニングベルト az7', itemName: 'トレーニングベルト AZ7', deliveryType: '0' },
  { keyword: 'トライセップロープ', itemName: 'トライセップロープ', deliveryType: '8' },
  { keyword: 'プーリーハンドル', itemName: 'プーリーハンドル', deliveryType: '0' },
  { keyword: '手首サポーター', itemName: 'リストラップ', deliveryType: '8' },
  { keyword: 'リフティングベルトair', itemName: 'リフティングベルトAIR', deliveryType: '0' },
  { keyword: 'スタンダード', itemName: 'レバーベルトLEX Standard', deliveryType: '0' },
  { keyword: 'テパード', itemName: 'レバーベルトLEX Tapered', deliveryType: '0' },
  { keyword: 'ジムバッグ', itemName: 'ジムバッグCREWZ1', deliveryType: '0' },
  { keyword: 'angles90', itemName: 'Angles90', deliveryType: '8' },
  { keyword: 'リフティングストラップ', itemName: 'リフティングストラップ', deliveryType: 'A' },
  // 必要に応じて追加
];

export function classifyProduct(productNameRaw: string): {
  itemName: string;
  deliveryType: DeliveryType;
} {
  const name = productNameRaw.toLowerCase();

  for (const rule of rules) {
    if (name.includes(rule.keyword)) {
      return {
        itemName: rule.itemName,
        deliveryType: rule.deliveryType,
      };
    }
  }

  // マッチしない場合はネコポス
  return {
    itemName: productNameRaw,
    deliveryType: 'A',
  };
}
