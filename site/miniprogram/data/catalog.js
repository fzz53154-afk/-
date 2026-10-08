(function (root, factory) {
  const data = factory();
  if (typeof module === 'object' && module.exports) module.exports = data;
  else root.BakeryData = data;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  return {
    brand: { name: '恬梨', english: 'TIANLI BAKERY', tagline: '把新鲜，揉进每一天。', isSample: false },
    image: '/assets/bakery.jpg',
    categories: ['全部', '经典可颂', '手作欧包', '甜蜜点心'],
    banners: [
      { title: '恬梨面包\n新鲜每一天', subtitle: '每日新鲜出炉 · 手作的温度', label: 'FRESHLY BAKED, EVERY DAY', position: 'center', category: '全部' },
      { title: '层层酥香\n口口有回响', subtitle: '黄油可颂 · 酥脆与柔软的相遇', label: 'A LITTLE BUTTER, A LOT OF JOY', position: '70% 55%', category: '经典可颂' },
      { title: '慢慢发酵\n慢慢喜欢', subtitle: '天然酵种 · 品尝麦香本来的模样', label: 'GOOD THINGS TAKE TIME', position: 'right top', category: '手作欧包' }
    ],
    products: [
      { id: 'croissant', name: '原味黄油可颂', category: '经典可颂', price: 1800, label: '人气招牌', description: '黄油香气藏在层层酥皮里，轻轻一咬，外酥内柔。', ingredients: '小麦粉、黄油、牛奶、鸡蛋、酵母', allergens: '含小麦、乳制品、鸡蛋', position: '50% 58%', weight: '约 75g' },
      { id: 'sourdough', name: '乡村酸种欧包', category: '手作欧包', price: 3200, label: '天然酵种', description: '缓慢发酵的质朴麦香，酥脆外壳与柔韧内芯，适合分享。', ingredients: '小麦粉、水、天然酵种、海盐', allergens: '含小麦；同一厨房处理坚果、乳制品', position: '65% 10%', weight: '约 400g' },
      { id: 'chocolate', name: '巧克力丹麦酥', category: '经典可颂', price: 2200, label: '浓郁可可', description: '酥皮包裹巧克力，浓郁可可香伴着黄油香气一起醒来。', ingredients: '小麦粉、黄油、巧克力、牛奶、鸡蛋', allergens: '含小麦、乳制品、鸡蛋、大豆', position: '78% 70%', weight: '约 85g' },
      { id: 'raisin', name: '葡萄干蜗牛酥', category: '甜蜜点心', price: 2000, label: '午后甜点', description: '卷起香甜葡萄干与柔滑卡仕达，给下午留一点甜。', ingredients: '小麦粉、黄油、葡萄干、牛奶、鸡蛋', allergens: '含小麦、乳制品、鸡蛋', position: '88% 92%', weight: '约 90g' }
    ],
    rechargePlans: [{ amount: 10000, gift: 0 }, { amount: 20000, gift: 1000 }, { amount: 50000, gift: 3000 }, { amount: 100000, gift: 8000 }],
    stores: [
      { id: 'tianli-fuding', name: '恬梨 · 恒大未来城店', address: '福鼎恒大未来城15栋1单元0109', hours: '营业时间待公布', phone: '18659384298', latitude: null, longitude: null, isSample: false, services: ['到店自提', '每日现烤'] }
    ]
  };
});
