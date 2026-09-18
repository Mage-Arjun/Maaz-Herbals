const products = [
  { id: 1, slug: 'magnolia-chembakam-shower-gel', name: 'Magnolia & Chembakam Shower Gel', category: 'Skin Care', price: 449, image: 'assets/products/Magnolia%20Chembakam%20Shower%20Gel%20with%20Hydrolyzed%20Silk%20Protein%20%26%20Vitamin%20E.jpg', description: 'A floral botanical body cleanser designed for a soft, unhurried everyday ritual.' },
  { id: 2, slug: 'neem-peppermint-shower-gel', name: 'Neem & Peppermint Shower Gel', category: 'Skin Care', price: 399, image: 'assets/products/Neem%20%26%20Peppermint%20Shower%20Gel.jpg', description: 'A fresh, nature-inspired cleansing essential for your daily routine.' },
  { id: 3, slug: 'onion-hibiscus-hair-gel', name: 'Onion & Hibiscus Hair Gel', category: 'Hair Care', price: 349, image: 'assets/products/Onion%20%26%20Hibiscus%20Hair%20Gel%20100gm.jpg', description: 'A botanical-inspired styling care essential made for everyday hair rituals.' },
  { id: 4, slug: 'rose-face-wash', name: 'Rose Face Wash', category: 'Skin Care', price: 449, image: 'assets/products/Rose%20Face%20Wash-%20Gentle%20Daily%20Cleanser%20with%20Organic%20Roses%2C%20Aloe%20Vera%2C%20Niacinamide%20and%20Rice%20Extract.jpg', description: 'A gentle daily cleanser inspired by roses, aloe vera, niacinamide and rice extract.' },
  { id: 5, slug: 'skin-bright-glow-oil', name: 'Skin Bright Glow Oil', category: 'Herbal Essentials', price: 499, image: 'assets/products/Skin%20Bright%20Glow%20Oil%20100ml%20%E2%80%93%20Kerala%20Ayurvedic%20Formula%20with%20Pure%20Ghee%2C%20Rice%20Extract%20%26%20Sesame%20Oil.jpg', description: 'A Kerala Ayurvedic-inspired glow oil with pure ghee, rice extract and sesame oil.' }
];

/* ── Helpers ── */
const q = s => document.querySelector(s);
const fmt = n => '\u20b9' + n.toLocaleString('en-IN');

/* ── Cart state ── */
let cart = JSON.parse(localStorage.getItem('maaz-cart') || '[]');

/* ── Image helper ── */
function img(p, c = 'product-image') {
  return '<img class="' + c + '" src="' + p.image + '" alt="' + p.name + '" loading="lazy">';
}

/* ── Product card ── */
function card(p, idx) {
  var num = String((idx !== undefined ? idx : 0) + 1).padStart(2, '0');
  return '<article class="card">'
    + '<span class="card-number" aria-hidden="true">N\u00b0 ' + num + '</span>'
    + '<button class="wish" aria-label="Add ' + p.name + ' to wishlist">\u2661</button>'
    + '<a href="product.html?slug=' + p.slug + '" class="product-visual">' + img(p) + '</a>'
    + '<p class="eyebrow">' + p.category + '</p>'
    + '<h3>' + p.name + '</h3>'
    + '<p class="price">' + fmt(p.price) + ' <small>\u2726 Botanical care</small></p>'
    + '<button class="add" data-add="' + p.id + '">Add to bag <span>+</span></button>'
    + '</article>';
}

/* ── Cart persistence ── */
function save() { localStorage.setItem('maaz-cart', JSON.stringify(cart)); }

/* ── Add to cart ── */
function add(id, qty) {
  qty = qty || 1;
  var p = products.find(function(x) { return x.id === +id; });
  if (!p) return;
  var existing = cart.find(function(x) { return x.id === p.id; });
  if (existing) { existing.qty += qty; } else { cart.push(Object.assign({}, p, { qty: qty })); }
  save();
  renderCart();
  toast(p.name + ' added to your bag');
}

/* ── Render cart sidebar ── */
function renderCart() {
  var t = q('#cartItems');
  if (!t) return;
  var count = cart.reduce(function(n, x) { return n + x.qty; }, 0);
  var total = cart.reduce(function(n, x) { return n + x.qty * x.price; }, 0);
  var navCount = q('#navCount');
  var cartCount = q('#cartCount');
  var subtotal = q('#subtotal');
  if (navCount) navCount.textContent = count;
  if (cartCount) cartCount.textContent = '(' + count + ')';
  if (subtotal) subtotal.textContent = fmt(total);
  if (cart.length) {
    t.innerHTML = cart.map(function(x) {
      return '<div class="cart-item">' + img(x)
        + '<div><strong>' + x.name + '</strong><small>' + fmt(x.price) + '</small>'
        + '<div class="qty">'
        + '<button data-qty="' + x.id + '" data-delta="-1">\u2212</button>'
        + '<span>' + x.qty + '</span>'
        + '<button data-qty="' + x.id + '" data-delta="1">+</button>'
        + '<button class="remove" data-remove="' + x.id + '">Remove</button>'
        + '</div></div></div>';
    }).join('');
  } else {
    t.innerHTML = '<div class="empty cart-empty"><strong>Your botanical basket is empty.</strong><p>Discover something naturally beautiful.</p></div>';
  }
}

/* ── Render shop grid ── */
function renderShop() {
  var grid = q('#allProducts');
  if (!grid) return;
  var s = (q('#shopSearch') ? q('#shopSearch').value : '').toLowerCase();
  var c = q('#categoryFilter') ? q('#categoryFilter').value : 'All Products';
  var o = q('#sortFilter') ? q('#sortFilter').value : 'featured';
  var list = products.filter(function(p) {
    return (!s || (p.name + p.category).toLowerCase().indexOf(s) !== -1)
      && (c === 'All Products' || p.category === c);
  });
  if (o === 'low') list.sort(function(a, b) { return a.price - b.price; });
  if (o === 'high') list.sort(function(a, b) { return b.price - a.price; });
  if (o === 'name') list.sort(function(a, b) { return a.name.localeCompare(b.name); });
  grid.innerHTML = list.length ? list.map(function(p, i) { return card(p, i); }).join('') : '<p class="empty">No botanical essentials found. Try another search.</p>';
  var productCount = q('#productCount');
  if (productCount) productCount.textContent = list.length + ' products';
}

/* ── Toast notification ── */
function toast(m) {
  var t = q('#toast');
  if (!t) return;
  t.textContent = m;
  t.classList.add('show');
  setTimeout(function() { t.classList.remove('show'); }, 2400);
}

/* ── Panel toggle ── */
function toggle(id, on) {
  if (on === undefined) on = true;
  var el = q('#' + id);
  if (el) el.classList.toggle('open', on);
  var scrim = q('#scrim');
  // Determine if any panel is now open
  var cartOpen = q('#cart') && q('#cart').classList.contains('open');
  var searchOpen = q('#searchPanel') && q('#searchPanel').classList.contains('open');
  var menuOpen = q('.nav nav') && q('.nav nav').classList.contains('mobile-open');
  var anyOpen = cartOpen || searchOpen || menuOpen;
  if (scrim) scrim.classList.toggle('open', !!anyOpen);
  document.body.classList.toggle('locked', !!anyOpen);
}

/* ── Close all panels ── */
function closeAll() {
  var cart_el = q('#cart');
  var search_el = q('#searchPanel');
  var nav_el = q('.nav nav');
  var scrim = q('#scrim');
  if (cart_el) cart_el.classList.remove('open');
  if (search_el) search_el.classList.remove('open');
  if (nav_el) nav_el.classList.remove('mobile-open');
  if (scrim) scrim.classList.remove('open');
  document.body.classList.remove('locked');
}

/* ── Product page ── */
function renderProduct() {
  var h = q('#productPage');
  if (!h) return;
  var slug = new URLSearchParams(location.search).get('slug');
  var p = products.find(function(x) { return x.slug === slug; }) || products[0];
  var related = products.filter(function(x) { return x.id !== p.id; }).slice(0, 3);
  document.title = p.name + ' \u2014 MAAZ Herbals';
  h.innerHTML = '<section class="product-page section">'
    + '<a class="text-button" href="shop.html">\u2190 Back to shop</a>'
    + '<div class="product-page-grid">'
    + '<div class="page-image">' + img(p) + '</div>'
    + '<div class="page-copy">'
    + '<p class="eyebrow">' + p.category + '</p>'
    + '<h1>' + p.name + '</h1>'
    + '<p class="detail-price">' + fmt(p.price) + ' <small>\u2605\u2605\u2605\u2605\u2605 \u00b7 Botanical personal care</small></p>'
    + '<p>' + p.description + '</p>'
    + '<div class="detail-quantity"><span>Quantity</span><button id="minus">\u2212</button><b id="quantity">1</b><button id="plus">+</button></div>'
    + '<button class="button dark" id="productAdd">Add to bag</button>'
    + '<button class="button buy" id="buyNow">Buy now</button>'
    + '<details open><summary>Product highlights</summary><p>Herbal-inspired, thoughtfully chosen for a simple everyday routine.</p></details>'
    + '<details><summary>Ingredients</summary><p>See the product pack for its complete and current ingredient list.</p></details>'
    + '<details><summary>How to use</summary><p>Use as part of your preferred personal-care routine. Patch test where appropriate.</p></details>'
    + '<details><summary>Shipping &amp; returns</summary><p>Frontend demo \u2014 shipping details can be connected before production.</p></details>'
    + '</div></div></section>'
    + '<section class="section related">'
    + '<p class="eyebrow">Continue your ritual</p>'
    + '<h2>You may also <em>like.</em></h2>'
    + '<div class="product-grid">' + related.map(function(p, i) { return card(p, i); }).join('') + '</div>'
    + '</section>';

  var n = 1;
  q('#plus').onclick = function() { q('#quantity').textContent = ++n; };
  q('#minus').onclick = function() { n = Math.max(1, --n); q('#quantity').textContent = n; };
  q('#productAdd').onclick = function() { add(p.id, n); };
  q('#buyNow').onclick = function() { add(p.id, n); toggle('cart'); };

  /* Sticky buybar */
  var buybar = q('#buybar');
  var buybarName = q('#buybarName');
  var buybarPrice = q('#buybarPrice');
  var buybarAdd = q('#buybarAdd');
  if (buybar) {
    if (buybarName) buybarName.textContent = p.name;
    if (buybarPrice) buybarPrice.textContent = fmt(p.price);
    if (buybarAdd) buybarAdd.onclick = function() { add(p.id, n); };
    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function(entries) {
        buybar.classList.toggle('show', !entries[0].isIntersecting);
      }, { threshold: 0 });
      var productAddBtn = q('#productAdd');
      if (productAddBtn) obs.observe(productAddBtn);
    }
  }
}

/* ── Scroll reveal via IntersectionObserver ── */
function initReveal() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(function(el) { el.classList.add('in'); });
    return;
  }
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(function(el) { observer.observe(el); });
}

/* ── Global click delegation ── */
document.addEventListener('click', function(e) {
  var addBtn = e.target.closest('[data-add]');
  if (addBtn) { e.preventDefault(); add(addBtn.dataset.add); return; }

  if (e.target.matches('[data-close]')) { toggle(e.target.dataset.close, false); return; }

  if (e.target.id === 'scrim') { closeAll(); return; }

  if (e.target.matches('[data-qty]')) {
    var item = cart.find(function(x) { return x.id === +e.target.dataset.qty; });
    if (item) {
      item.qty += +e.target.dataset.delta;
      if (item.qty < 1) cart = cart.filter(function(y) { return y !== item; });
      save();
      renderCart();
    }
    return;
  }

  if (e.target.matches('[data-remove]')) {
    cart = cart.filter(function(x) { return x.id !== +e.target.dataset.remove; });
    save();
    renderCart();
    return;
  }
});

/* ── UI bindings ── */
q('#openCart') && q('#openCart').addEventListener('click', function() { toggle('cart'); });
q('#openSearch') && q('#openSearch').addEventListener('click', function() { toggle('searchPanel'); });
q('#checkout') && q('#checkout').addEventListener('click', function() { toast('This is a frontend demo. Checkout can be connected later.'); });

/* Mobile menu toggle */
q('#mobileMenu') && q('#mobileMenu').addEventListener('click', function() {
  var menu = q('.nav nav');
  if (menu) {
    var isOpen = menu.classList.contains('mobile-open');
    menu.classList.toggle('mobile-open', !isOpen);
    
    var scrim = q('#scrim');
    var cartOpen = q('#cart') && q('#cart').classList.contains('open');
    var searchOpen = q('#searchPanel') && q('#searchPanel').classList.contains('open');
    var anyOpen = cartOpen || searchOpen || !isOpen;
    if (scrim) scrim.classList.toggle('open', !!anyOpen);
    document.body.classList.toggle('locked', !!anyOpen);
  }
});

/* Close mobile menu when a nav link is tapped */
document.querySelectorAll('.nav nav a').forEach(function(a) {
  a.addEventListener('click', function() {
    closeAll();
  });
});

/* Search input */
q('#searchInput') && q('#searchInput').addEventListener('input', function(e) {
  var val = e.target.value.toLowerCase();
  var l = products.filter(function(p) { return (p.name + p.category).toLowerCase().indexOf(val) !== -1; });
  q('#searchResults').innerHTML = l.map(function(p) {
    return '<a href="product.html?slug=' + p.slug + '">' + img(p) + '<span>' + p.name + '<small>' + p.category + ' \u00b7 ' + fmt(p.price) + '</small></span></a>';
  }).join('') || '<p class="empty">No botanical essentials found.</p>';
});

/* Shop filters */
['#shopSearch', '#categoryFilter', '#sortFilter'].forEach(function(s) {
  q(s) && q(s).addEventListener('input', renderShop);
});

/* Newsletter */
q('#newsletterForm') && q('#newsletterForm').addEventListener('submit', function(e) {
  e.preventDefault();
  var msg = q('#formMessage');
  if (msg) msg.textContent = 'Thank you \u2014 your ritual notes are on their way.';
  e.target.reset();
});

/* Nav scroll state */
window.addEventListener('scroll', function() {
  q('#nav') && q('#nav').classList.toggle('scrolled', scrollY > 50);
});

/* ── Initialise ── */
document.documentElement.classList.add('js');

if (q('#featuredProducts')) q('#featuredProducts').innerHTML = products.slice(0, 4).map(function(p, i) { return card(p, i); }).join('');

if (q('.hero-art img')) {
  q('.hero-art').classList.add('campaign-hero');
  q('.hero-art img').src = 'assets/campaign/glow-oil-hero.png';
  q('.hero-art img').alt = 'MAAZ Herbals Skin Bright Glow Oil botanical campaign';
}

if (q('.feature-image img')) {
  q('.feature-image img').src = products[0].image;
  q('.feature-image img').alt = products[0].name;
}

renderShop();
renderCart();
renderProduct();

requestAnimationFrame(initReveal);

setTimeout(function() { q('#loader') && q('#loader').classList.add('done'); }, 1800);
