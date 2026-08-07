(function () {
  'use strict';

  var S = window.ProductShared;

  var FAMILY_ORDER = ['RTX', 'A100', 'H800'];
  var FAMILY_META = {
    RTX: { title: 'RTX-Class Nodes', anchor: 'cat-rtx' },
    A100: { title: 'A100-Class Nodes', anchor: 'cat-a100' },
    H800: { title: 'H800-Class Nodes', anchor: 'cat-h800' }
  };

  var statusEl = document.getElementById('products-status');
  var sectionsEl = document.getElementById('products-sections');

  function setStatus(message) {
    if (!message) {
      statusEl.classList.add('is-hidden');
      statusEl.textContent = '';
      return;
    }
    statusEl.textContent = message;
    statusEl.classList.remove('is-hidden');
  }

  function buildCardKeySpecs(product) {
    var rows = [];
    if (product.gpuFamily) rows.push(['GPU Family', product.gpuFamily]);
    if (product.gpuQuantity) {
      rows.push(['GPU Count', String(product.gpuQuantity) + (product.clusterScale ? ' (cluster total)' : '')]);
    }
    if (product.memory) rows.push(['Memory', product.memory]);
    if (product.storage) rows.push(['Storage', product.storage]);
    if (product.network) rows.push(['Network', product.network]);
    if (Array.isArray(product.pricing) && product.pricing.length && product.pricing[0].leasePrice) {
      var tier = product.pricing[0];
      rows.push(['Lease Price', tier.leasePrice + (tier.leasePeriod ? ' / ' + tier.leasePeriod : '')]);
    }
    return rows;
  }

  // Card content always follows the same order: Title, Status, Short description, Key specs, Primary CTA.
  // "View Full Specifications" stays as an optional, collapsed-by-default extra below the CTA — it adds
  // genuinely new detail (full component/pricing breakdown) rather than repeating the summary above it.
  function buildCard(product) {
    var card = document.createElement('article');
    card.className = 'product-card';

    var imageLink = document.createElement('a');
    imageLink.href = S.detailUrl(product);
    imageLink.className = 'product-card-image-link';
    imageLink.appendChild(S.buildImage(product));
    card.appendChild(imageLink);

    var body = document.createElement('div');
    body.className = 'product-card-body';

    // 1. Title + 2. Status
    var top = document.createElement('div');
    top.className = 'product-card-top';

    var name = document.createElement('h3');
    name.className = 'product-name';
    var nameLink = document.createElement('a');
    nameLink.href = S.detailUrl(product);
    nameLink.className = 'product-name-link';
    nameLink.textContent = product.name || 'Unnamed GPU Node';
    name.appendChild(nameLink);
    top.appendChild(name);
    body.appendChild(top);

    body.appendChild(S.buildBadgeRow(product));

    // 3. Short description
    if (product.description) {
      var desc = document.createElement('p');
      desc.className = 'product-description card-description';
      desc.textContent = product.description;
      body.appendChild(desc);
    }

    // 4. Key specs
    var keySpecs = S.buildKeySpecsGrid(buildCardKeySpecs(product));
    if (keySpecs) body.appendChild(keySpecs);

    // 5. Primary CTA
    var cta = document.createElement('a');
    cta.className = 'btn-lease';
    cta.href = S.LEASE_URL;
    cta.target = '_blank';
    cta.rel = 'noopener';
    cta.textContent = 'Lease Now';
    body.appendChild(cta);

    // Optional supplementary detail, collapsed by default
    var fullSpecs = S.buildFullSpecs(product);
    if (fullSpecs) body.appendChild(fullSpecs);

    card.appendChild(body);
    return card;
  }

  function buildSection(familyKey, familyProducts) {
    var meta = FAMILY_META[familyKey];

    var section = document.createElement('section');
    section.className = 'product-family-section';
    section.id = meta.anchor;

    var label = document.createElement('div');
    label.className = 'product-family-label';
    label.textContent = '// ' + familyKey + ' FAMILY';
    section.appendChild(label);

    var title = document.createElement('h2');
    title.className = 'product-family-title';
    title.textContent = meta.title;
    section.appendChild(title);

    var grid = document.createElement('div');
    grid.className = 'products-grid';
    familyProducts.forEach(function (product) {
      grid.appendChild(buildCard(product));
    });
    section.appendChild(grid);

    return section;
  }

  function render(products) {
    if (!Array.isArray(products) || products.length === 0) {
      setStatus('No GPU nodes currently listed — check back soon.');
      return;
    }

    var byFamily = {};
    products.forEach(function (product) {
      var key = product.gpuFamily;
      if (!FAMILY_META[key]) return;
      if (!byFamily[key]) byFamily[key] = [];
      byFamily[key].push(product);
    });

    var hasAny = FAMILY_ORDER.some(function (key) { return byFamily[key] && byFamily[key].length; });
    if (!hasAny) {
      setStatus('No GPU nodes currently listed — check back soon.');
      return;
    }

    setStatus(null);
    var fragment = document.createDocumentFragment();
    FAMILY_ORDER.forEach(function (key) {
      if (byFamily[key] && byFamily[key].length) {
        fragment.appendChild(buildSection(key, byFamily[key]));
      }
    });
    sectionsEl.appendChild(fragment);
  }

  setStatus('Loading available GPUs…');

  fetch(S.DATA_URL)
    .then(function (res) {
      if (!res.ok) throw new Error('Failed to load product data');
      return res.json();
    })
    .then(render)
    .catch(function () {
      setStatus('Unable to load GPU listings right now. Please try again shortly.');
    });
})();
