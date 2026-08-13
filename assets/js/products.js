(function () {
  'use strict';

  var S = window.ProductShared;
  var UI = S.UI || {};

  var FAMILY_ORDER = ['RTX', 'A100', 'H800'];
  var FAMILY_TITLES = UI.familyTitles || { RTX: 'RTX-Class Nodes', A100: 'A100-Class Nodes', H800: 'H800-Class Nodes' };
  var FAMILY_META = {
    RTX: { title: FAMILY_TITLES.RTX, anchor: 'cat-rtx' },
    A100: { title: FAMILY_TITLES.A100, anchor: 'cat-a100' },
    H800: { title: FAMILY_TITLES.H800, anchor: 'cat-h800' }
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
    if (product.gpuFamily) rows.push([UI.gpuFamilyLabel || 'GPU Family', product.gpuFamily]);
    if (product.gpuQuantity) {
      rows.push([UI.gpuCount || 'GPU Count', String(product.gpuQuantity) + (product.clusterScale ? (UI.clusterTotalSuffix || ' (cluster total)') : '')]);
    }
    if (product.memory) rows.push([(UI.specLabels && UI.specLabels.memory) || 'Memory', product.memory]);
    if (product.storage) rows.push([(UI.specLabels && UI.specLabels.storage) || 'Storage', product.storage]);
    if (product.network) rows.push([(UI.specLabels && UI.specLabels.network) || 'Network', product.network]);
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
    nameLink.textContent = product.name || UI.unnamedNode || 'Unnamed GPU Node';
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

    var pricingTable = S.buildPricingTable(product);
    if (pricingTable) body.appendChild(pricingTable);

    // 5. Primary CTA
    var cta = document.createElement('a');
    cta.className = 'btn-lease';
    cta.href = S.LEASE_URL;
    cta.target = '_blank';
    cta.rel = 'noopener';
    cta.textContent = UI.leaseNow || 'Lease Now';
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
    label.textContent = '// ' + familyKey + ' ' + (UI.familySuffix || 'FAMILY');
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
      setStatus(UI.noGpusListed || 'No GPU nodes currently listed — check back soon.');
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
      setStatus(UI.noGpusListed || 'No GPU nodes currently listed — check back soon.');
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

  setStatus(UI.loadingGpus || 'Loading available GPUs…');

  S.loadProducts()
    .then(render)
    .catch(function () {
      setStatus(UI.unableToLoadListings || 'Unable to load GPU listings right now. Please try again shortly.');
    });
})();
