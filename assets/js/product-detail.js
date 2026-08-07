(function () {
  'use strict';

  var S = window.ProductShared;

  var BEST_FOR = {
    RTX: 'RTX-class nodes are best suited for teams fine-tuning models, running small-scale training jobs, and serving inference workloads that don’t require multi-node scale.',
    A100: 'A100-class nodes are best suited for production teams running large-scale model training and high-throughput inference, including multi-GPU distributed workloads.',
    H800: 'H800-class nodes are best suited for organizations training the largest models and running multimodal inference across bare-metal, multi-node clusters.'
  };

  var statusEl = document.getElementById('detail-status');
  var rootEl = document.getElementById('detail-root');

  function setStatus(message) {
    if (!message) {
      statusEl.classList.add('is-hidden');
      statusEl.textContent = '';
      return;
    }
    statusEl.textContent = message;
    statusEl.classList.remove('is-hidden');
  }

  function getRequestedId() {
    var params = new URLSearchParams(window.location.search);
    return params.get('id');
  }

  function buildSectionWrapper(label, heading, extraClass) {
    var section = document.createElement('section');
    section.className = 'detail-section' + (extraClass ? ' ' + extraClass : '');

    if (label) {
      var labelEl = document.createElement('div');
      labelEl.className = 'label';
      labelEl.textContent = label;
      section.appendChild(labelEl);
    }

    if (heading) {
      var h2 = document.createElement('h2');
      h2.className = 'detail-section-title';
      h2.textContent = heading;
      section.appendChild(h2);
    }

    return section;
  }

  // Everything a visitor needs immediately — name, GPU family, deployment type, price,
  // primary specs, and the single Lease action — lives in this above-the-fold zone.
  // Full narrative, full spec tables, and deployment process detail all live further down.
  function buildAboveFold(product) {
    var wrap = document.createElement('div');
    wrap.className = 'detail-above-fold';

    if (product.category) {
      var label = document.createElement('div');
      label.className = 'label';
      label.textContent = '// ' + product.category.toUpperCase();
      wrap.appendChild(label);
    }

    var top = document.createElement('div');
    top.className = 'detail-hero-top';
    var h1 = document.createElement('h1');
    h1.textContent = product.name || 'GPU Server';
    top.appendChild(h1);
    wrap.appendChild(top);

    wrap.appendChild(S.buildBadgeRow(product));

    if (product.clusterScale) {
      var scale = document.createElement('div');
      scale.className = 'cluster-scale';
      scale.textContent = product.clusterScale;
      wrap.appendChild(scale);
    }

    var pricingTable = S.buildPricingTable(product);
    if (pricingTable) {
      pricingTable.classList.add('detail-hero-pricing');
      wrap.appendChild(pricingTable);
    }

    var highlightRows = [];
    if (product.gpuQuantity) {
      highlightRows.push(['GPU Count', String(product.gpuQuantity) + (product.clusterScale ? ' (cluster total)' : '')]);
    }
    if (product.memory) highlightRows.push(['Memory', product.memory]);
    if (product.storage) highlightRows.push(['Storage', product.storage]);
    if (product.network) highlightRows.push(['Network', product.network]);
    var highlights = S.buildKeySpecsGrid(highlightRows);
    if (highlights) wrap.appendChild(highlights);

    var cta = document.createElement('a');
    cta.className = 'btn-lease detail-cta';
    cta.href = S.LEASE_URL;
    cta.target = '_blank';
    cta.rel = 'noopener';
    cta.textContent = 'Lease Now';
    wrap.appendChild(cta);

    return wrap;
  }

  function buildOverview(product) {
    if (!product.description && !product.productLine) return null;
    var section = buildSectionWrapper('// OVERVIEW', 'Overview');

    if (product.productLine) {
      var line = document.createElement('div');
      line.className = 'product-category';
      line.textContent = product.productLine;
      section.appendChild(line);
    }

    if (product.description) {
      var p = document.createElement('p');
      p.className = 'product-description detail-copy';
      p.textContent = product.description;
      section.appendChild(p);
    }

    return section;
  }

  function buildBestFor(product) {
    var text = BEST_FOR[product.gpuFamily];
    if (!text) return null;

    var section = buildSectionWrapper('// BEST FOR', 'Best For');
    var p = document.createElement('p');
    p.className = 'product-description detail-copy';
    p.textContent = text;
    section.appendChild(p);

    return section;
  }

  function buildSpecifications(product) {
    var section = buildSectionWrapper('// SPECIFICATIONS', 'Specifications');
    section.appendChild(S.buildSpecs(product));

    var componentsTable = S.buildComponentsTable(product);
    if (componentsTable) {
      var h3a = document.createElement('div');
      h3a.className = 'full-specs-heading';
      h3a.textContent = 'Hardware Configuration';
      section.appendChild(h3a);
      section.appendChild(componentsTable);
    }

    var breakdownTable = S.buildDeploymentValueTable(product);
    if (breakdownTable) {
      var h3b = document.createElement('div');
      h3b.className = 'full-specs-heading';
      h3b.textContent = 'Estimated Enterprise Deployment Value';
      section.appendChild(h3b);
      section.appendChild(breakdownTable);
    }

    return section;
  }

  // Pricing itself already lives in the above-the-fold zone, so this section covers
  // process only — repeating the price table here would just duplicate it.
  function buildDeployment(product) {
    var section = buildSectionWrapper('// DEPLOYMENT', 'Deployment');

    var note = document.createElement('p');
    note.className = 'product-description detail-copy';
    if (product.clusterScale) {
      note.innerHTML = 'This is a multi-node cluster deployment. Provisioning follows the enterprise deployment process — consultation, custom cluster design, and a defined support SLA. <a href="/#enterprise-deploy">Learn more about enterprise deployment →</a>';
    } else {
      note.textContent = 'Leasing and billing are handled directly through the Cloud Leasing platform. Deployment begins once your lease is confirmed.';
    }
    section.appendChild(note);

    return section;
  }

  function render(product) {
    document.getElementById('page-title').textContent = (product.name || 'GPU Server') + ' | Cloud Leasing';

    var fragment = document.createDocumentFragment();
    fragment.appendChild(buildAboveFold(product));

    var overview = buildOverview(product);
    if (overview) fragment.appendChild(overview);

    var bestFor = buildBestFor(product);
    if (bestFor) fragment.appendChild(bestFor);

    fragment.appendChild(buildSpecifications(product));
    fragment.appendChild(buildDeployment(product));

    rootEl.appendChild(fragment);
  }

  var requestedId = getRequestedId();
  if (!requestedId) {
    setStatus('No product specified. Return to the GPU Servers page to choose one.');
  } else {
    setStatus('Loading product…');
    fetch(S.DATA_URL)
      .then(function (res) {
        if (!res.ok) throw new Error('Failed to load product data');
        return res.json();
      })
      .then(function (products) {
        var product = Array.isArray(products) ? products.filter(function (p) { return p.id === requestedId; })[0] : null;
        if (!product) {
          setStatus('This product could not be found. It may have been renamed or removed — see the full GPU Servers list instead.');
          return;
        }
        setStatus(null);
        render(product);
      })
      .catch(function () {
        setStatus('Unable to load product data right now. Please try again shortly.');
      });
  }
})();
