(() => {
  const data = window.BakeryData;
  const app = document.getElementById('app');
  const modal = document.getElementById('modal');
  const money = cents => (cents / 100).toFixed(2);
  const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const icon = name => `<i data-lucide="${name}"></i>`;
  const image = './miniprogram' + data.image;
  const productImage = product => './miniprogram/assets/' + product.id + '.jpg';
  const store = data.stores[0];
  const state = { category: '全部', query: '', slide: 0, amount: 20000, agreed: false, cart: {} };
  try {
    const raw = JSON.parse(localStorage.getItem('tianliCart')) || {};
    data.products.forEach(p => { if (Number.isInteger(raw[p.id]) && raw[p.id] > 0) state.cart[p.id] = Math.min(99, raw[p.id]); });
  } catch { state.cart = {}; }
  let toastTimer;
  let modalType = '';
  const route = () => ['home', 'products', 'stores', 'wallet'].includes(location.hash.slice(1)) ? location.hash.slice(1) : 'home';
  const paintIcons = () => window.lucide.createIcons();
  const cartItems = () => data.products.filter(p => state.cart[p.id]).map(p => ({ ...p, quantity: state.cart[p.id] }));
  const cartCount = () => cartItems().reduce((sum, p) => sum + p.quantity, 0);
  const cartTotal = () => cartItems().reduce((sum, p) => sum + p.price * p.quantity, 0);
  function toast(message) {
    const element = document.getElementById('toast');
    element.textContent = message; element.classList.add('visible');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => element.classList.remove('visible'), 2300);
  }
  function changeCart(id, delta) {
    if (!data.products.some(p => p.id === id)) return;
    const quantity = Math.max(0, Math.min(99, (state.cart[id] || 0) + delta));
    if (quantity) state.cart[id] = quantity; else delete state.cart[id];
    try { localStorage.setItem('tianliCart', JSON.stringify(state.cart)); } catch { toast('浏览器无法保存购物袋，请勿关闭页面'); }
    document.getElementById('bag-count').textContent = cartCount();
    const summary = document.querySelector('.cart-summary');
    if (summary) summary.innerHTML = cartSummaryContent();
    if (modal.open && modalType === 'cart') showCart();
    paintIcons();
  }
  const head = (eyebrow, title, copy) => `<div class="page-title"><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p>${copy}</p></div>`;
  function productCard(p) {
    return `<article class="product"><button class="product-photo" data-action="detail" data-id="${p.id}" aria-label="查看${p.name}"><img src="${productImage(p)}" alt="${p.name}主题示意图" loading="lazy"><span class="badge">${p.label}</span></button><h3><a href="#" data-action="detail" data-id="${p.id}">${p.name}</a></h3><p>${p.weight} · 每日现烤</p><div class="product-bottom"><span class="price"><small>¥</small>${money(p.price)}</span><button class="add" data-action="add" data-id="${p.id}" aria-label="添加${p.name}" title="加入购物袋">${icon('plus')}</button></div></article>`;
  }
  function home() {
    return `<section class="hero" aria-roledescription="轮播图"><img class="hero-image" src="${image}" alt="新鲜出炉的可颂与手作欧包"><div class="hero-inner"><div id="hero-copy"></div><div class="hero-dots">${data.banners.map((_, i) => `<button data-action="slide" data-index="${i}" aria-label="第${i + 1}张海报"></button>`).join('')}</div><div class="hero-counter"><button data-action="previous" aria-label="上一张">${icon('chevron-left')}</button><span id="slide-number"></span><button data-action="next" aria-label="下一张">${icon('chevron-right')}</button></div></div></section><div class="promise"><span>${icon('wheat')}每日现烤</span><span>${icon('leaf')}精选原料</span><span>${icon('heart')}用心手作</span></div><div class="container"><div class="quick-links"><button data-action="shop"><span class="quick-icon">${icon('croissant')}</span><div><h3>挑选面包</h3><p>新鲜好味，随心选</p></div>${icon('arrow-up-right')}</button><button data-action="wallet"><span class="quick-icon">${icon('wallet')}</span><div><h3>会员充值</h3><p>储值礼遇，每日相伴</p></div>${icon('arrow-up-right')}</button><button data-action="stores"><span class="quick-icon">${icon('map-pin')}</span><div><h3>附近门店</h3><p>来店里，闻闻麦香</p></div>${icon('arrow-up-right')}</button></div><section class="section"><div class="section-head"><div><p class="eyebrow">BAKED WITH LOVE</p><h2>今日好面包</h2></div><a class="text-link" href="#products">全部产品 ${icon('arrow-right')}</a></div><div class="product-grid">${data.products.map(productCard).join('')}</div></section></div><section class="membership"><div class="container"><div><p class="eyebrow">A LITTLE MORE EVERY DAY</p><h2>让每一天，多一点甜</h2><p>加入恬梨会员，享受专属储值礼遇</p></div><a class="primary" href="#wallet">查看会员礼遇 ${icon('arrow-right')}</a></div></section><div class="container"><section class="section"><div class="section-head"><div><p class="eyebrow">YOUR NEIGHBORHOOD BAKERY</p><h2>在这里，遇见恬梨</h2></div><a class="text-link" href="#stores">查看门店 ${icon('arrow-right')}</a></div><div class="store-teaser"><div class="store-pin">${icon('map-pin')}<div><h3>${store.name}</h3><p>${store.address}</p><p>${store.hours}</p></div></div><a class="text-link" href="tel:${store.phone}">${icon('phone')} ${store.phone}</a></div></section></div>`;
  }
  function paintSlide() {
    if (route() !== 'home') return;
    const banner = data.banners[state.slide];
    document.getElementById('hero-copy').innerHTML = `<p class="eyebrow">${banner.label}</p><h1>${banner.title}</h1><p>${banner.subtitle}</p><button class="primary" data-action="shop" data-category="${banner.category}">挑选今日面包 ${icon('arrow-right')}</button>`;
    document.querySelectorAll('.hero-dots button').forEach((button, index) => { button.classList.toggle('active', index === state.slide); button.setAttribute('aria-current', String(index === state.slide)); });
    document.getElementById('slide-number').textContent = `0${state.slide + 1} / 03`;
    paintIcons();
  }
  function cartSummaryContent() { return `<button data-action="cart">${icon('shopping-bag')}购物袋 · ${cartCount()}</button><span class="price">¥${money(cartTotal())}</span><button class="text-link" data-action="cart">到店自提 ${icon('arrow-right')}</button>`; }
  function products() {
    return `<div class="container catalog-section">${head('FRESH FROM THE OVEN', '挑选你的好面包', '每日现烤，给生活一点刚刚好的香气。')}<div class="catalog-tools"><div class="categories" role="tablist" aria-label="产品类别">${data.categories.map(c => `<button role="tab" aria-selected="${c === state.category}" class="${c === state.category ? 'active' : ''}" data-action="category" data-category="${c}">${c}</button>`).join('')}</div><label class="search-box">${icon('search')}<input id="search" placeholder="搜索喜欢的面包" aria-label="搜索面包" value="${escape(state.query)}" maxlength="40"></label></div><div id="product-results"></div><div class="cart-summary">${cartSummaryContent()}</div></div>`;
  }
  function paintProducts() {
    const products = data.products.filter(p => (state.category === '全部' || state.category === p.category) && (p.name + p.description).includes(state.query.trim()));
    document.getElementById('product-results').innerHTML = `<p class="results">共 ${products.length} 款好面包</p><div class="product-grid">${products.map(productCard).join('')}</div>${products.length ? '' : '<div class="empty">没有找到这款面包，换个关键词试试。</div>'}`;
    paintIcons();
  }
  function stores() {
    return `<div class="container">${head('YOUR NEIGHBORHOOD BAKERY', '循着麦香，来见面', '推开门，是面包刚出炉的香气。')}<div class="store-layout"><img class="store-image" src="${image}" alt="恬梨面包主题海报"><section class="store-card"><h2>${store.name}</h2><div class="store-field"><span>门店地址</span><p>${store.address}</p></div><div class="store-field"><span>营业时间</span><p>${store.hours}</p></div><div class="store-field"><span>联系电话</span><p><a href="tel:${store.phone}">${store.phone}</a></p></div><div class="store-services">${store.services.map(s => `<span class="badge">${s}</span>`).join('')}</div><div class="store-actions"><button class="primary" data-action="navigate">${icon('navigation')}地图找店</button><a class="secondary" href="tel:${store.phone}">${icon('phone')}联系门店</a><button class="text-link" data-action="copy">${icon('copy')}复制地址</button></div></section></div></div>`;
  }
  function wallet() {
    return `<div class="container">${head('A LITTLE MORE EVERY DAY', '我的恬梨时光', '让喜欢的味道，陪你更久一点。')}<div class="wallet-layout"><section><div class="member-header"><span class="avatar">恬</span><div><h3>你好，面包爱好者</h3><p>登录后查看专属账户</p></div><button class="text-link" data-action="login">微信登录 ${icon('arrow-right')}</button></div><div class="balance"><div class="balance-top"><span>我的储值余额（元）</span><span class="eyebrow">TIANLI CLUB</span></div><div class="balance-number">—</div><p class="balance-bottom">新鲜好味，日日相伴</p></div><h2 class="records-title">充值记录</h2><div class="empty">登录后查看充值记录</div></section><section><div class="section-head"><h2>会员充值</h2><span class="badge">即将开放</span></div><div class="plans">${data.rechargePlans.map(p => `<button class="plan ${p.amount === state.amount ? 'active' : ''}" aria-pressed="${p.amount === state.amount}" data-action="amount" data-amount="${p.amount}"><span class="plan-amount">¥${p.amount / 100}</span><span class="plan-gift">${p.gift ? '赠 ¥' + p.gift / 100 : '轻享储值'}</span></button>`).join('')}</div><p class="plan-note">储值方案为示例，实际活动以门店公布为准。</p><div class="agreement"><label><input id="agree" type="checkbox" ${state.agreed ? 'checked' : ''}>我已阅读并同意</label><button class="text-link" data-action="terms">《储值须知》</button></div><button class="primary recharge" data-action="recharge">${icon('wallet')}微信支付充值 · ¥${state.amount / 100}</button></section></div></div>`;
  }
  function render() {
    const page = route();
    app.innerHTML = ({ home, products, stores, wallet })[page]();
    document.querySelectorAll('[data-nav]').forEach(a => { a.classList.toggle('active', a.dataset.nav === page); if (a.dataset.nav === page) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    document.getElementById('bag-count').textContent = cartCount();
    if (page === 'home') paintSlide();
    if (page === 'products') paintProducts();
    paintIcons();
  }
  function showModal(html, type = '') {
    const open = modal.open;
    modalType = type; modal.innerHTML = html;
    if (!open) modal.showModal();
    paintIcons();
  }
  const modalHead = title => `<div class="modal-head"><h2>${title}</h2><button class="icon-button" data-action="close" aria-label="关闭" title="关闭">${icon('x')}</button></div>`;
  const notice = (title, message) => showModal(`${modalHead(title)}<p class="notice-text">${escape(message)}</p><button class="primary" data-action="close">知道了</button>`);
  function showCart() {
    showModal(`${modalHead('我的购物袋 · ' + cartCount())}${cartItems().map(p => `<div class="cart-item"><div><h3>${p.name}</h3><p>¥${money(p.price)} / 个</p></div><div class="stepper"><button data-action="subtract" data-id="${p.id}" aria-label="减少${p.name}">${icon('minus')}</button><span>${p.quantity}</span><button data-action="add" data-id="${p.id}" aria-label="增加${p.name}">${icon('plus')}</button></div></div>`).join('')}${cartCount() ? '' : '<div class="empty">购物袋还是空的，选一份新鲜好味吧。</div>'}<div class="cart-total"><span>合计</span><span class="price">¥${money(cartTotal())}</span></div><div class="pickup-store">到店自提 · ${store.name}<br>${store.address}</div><button class="primary" data-action="checkout" ${cartCount() ? '' : 'disabled'}>到店自提 ${icon('arrow-right')}</button>`, 'cart');
  }
  function checkout() {
    showModal(`${modalHead('确认到店自提')}<div class="pickup-store">${store.name}<br>${store.address}<br>商品 ${cartCount()} 件 · 合计 ¥${money(cartTotal())}</div><form id="pickup-form" class="checkout-form"><label>取货姓名<input name="name" autocomplete="name" required maxlength="20" placeholder="请输入姓名"></label><label>联系电话<input name="phone" type="tel" autocomplete="tel" required pattern="1[3-9][0-9]{9}" maxlength="11" placeholder="请输入11位手机号"></label><p class="checkout-note">线上下单即将开放。可先联系门店确认商品及取货时间。</p><button class="primary" type="submit">确认自提信息</button></form>`, 'checkout');
  }
  document.addEventListener('input', event => { if (event.target.id === 'search') { state.query = event.target.value; paintProducts(); } });
  document.addEventListener('change', event => { if (event.target.id === 'agree') state.agreed = event.target.checked; });
  document.addEventListener('submit', event => {
    if (event.target.id !== 'pickup-form') return;
    event.preventDefault();
    showModal(`${modalHead('线上下单暂未开放')}<p class="notice-text">请联系恬梨确认商品和取货时间，购物袋已为你保留。当前未生成订单，也未扣款。</p><a class="primary" href="tel:${store.phone}">${icon('phone')}联系门店 · ${store.phone}</a>`);
  });
  document.addEventListener('click', async event => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    event.preventDefault();
    const { action, id } = button.dataset;
    if (action === 'shop') { state.category = button.dataset.category || '全部'; location.hash = 'products'; if (route() === 'products') render(); }
    if (action === 'wallet' || action === 'stores') location.hash = action;
    if (action === 'close') modal.close();
    if (action === 'cart') showCart();
    if (action === 'add') { changeCart(id, 1); if (modalType !== 'cart' || !modal.open) toast('已加入购物袋'); }
    if (action === 'subtract') changeCart(id, -1);
    if (action === 'checkout') checkout();
    if (action === 'category') { state.category = button.dataset.category; document.querySelectorAll('.categories button').forEach(b => { b.classList.toggle('active', b.dataset.category === state.category); b.setAttribute('aria-selected', String(b.dataset.category === state.category)); }); paintProducts(); }
    if (action === 'detail') {
      const p = data.products.find(p => p.id === id);
      if (p) showModal(`${modalHead(p.name)}<img class="modal-photo" src="${productImage(p)}" alt="${p.name}主题示意图"><p class="modal-desc">${p.description}</p><p class="modal-small">配料：${p.ingredients}<br>过敏原：${p.allergens}<br>${p.weight}</p><button class="primary" data-action="add" data-id="${p.id}">加入购物袋 · ¥${money(p.price)}</button>`, 'detail');
    }
    if (['slide', 'next', 'previous'].includes(action)) { state.slide = action === 'slide' ? Number(button.dataset.index) : (state.slide + (action === 'next' ? 1 : 2)) % 3; paintSlide(); }
    if (action === 'amount') { state.amount = Number(button.dataset.amount); document.querySelectorAll('.plan').forEach(b => { b.classList.toggle('active', Number(b.dataset.amount) === state.amount); b.setAttribute('aria-pressed', String(Number(b.dataset.amount) === state.amount)); }); document.querySelector('.recharge').innerHTML = `${icon('wallet')}微信支付充值 · ¥${state.amount / 100}`; paintIcons(); }
    if (action === 'terms') notice('储值须知', '储值规则、赠送金额和退款政策以上线后门店正式协议为准。当前金额方案为示例，会员服务尚未开通时不收款。支付成功后，以服务器确认的余额为准。');
    if (action === 'recharge') notice('会员充值暂未开放', '门店正在准备会员服务，暂不收款。开通后即可在微信小程序中使用微信支付充值。');
    if (action === 'login') notice('微信会员登录', '会员服务开通后，请在微信小程序中登录并查看储值账户。');
    if (action === 'navigate') window.open('https://apis.map.qq.com/uri/v1/search?keyword=' + encodeURIComponent(store.address) + '&region=' + encodeURIComponent('福鼎') + '&referer=tianli', '_blank', 'noopener,noreferrer');
    if (action === 'copy') { try { await navigator.clipboard.writeText(store.address); toast('门店地址已复制'); } catch { notice('门店地址', store.address); } }
  });
  modal.addEventListener('click', event => { if (event.target === modal) { const bounds = modal.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) modal.close(); } });
  window.addEventListener('hashchange', () => { modal.close(); render(); window.scrollTo(0, 0); });
  setInterval(() => { if (route() === 'home' && !document.hidden && !modal.open && !matchMedia('(prefers-reduced-motion: reduce)').matches) { state.slide = (state.slide + 1) % 3; paintSlide(); } }, 6000);
  render();
})();
