(function () {
  'use strict';

  var S = window.ProductShared;
  var UI = S.UI || {};
  var BEST_FOR = UI.bestForText || {
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
    h1.textContent = product.name || UI.gpuServerFallback || 'GPU Server';
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
      highlightRows.push([UI.gpuCount || 'GPU Count', String(product.gpuQuantity) + (product.clusterScale ? (UI.clusterTotalSuffix || ' (cluster total)') : '')]);
    }
    if (product.memory) highlightRows.push([(UI.specLabels && UI.specLabels.memory) || 'Memory', product.memory]);
    if (product.storage) highlightRows.push([(UI.specLabels && UI.specLabels.storage) || 'Storage', product.storage]);
    if (product.network) highlightRows.push([(UI.specLabels && UI.specLabels.network) || 'Network', product.network]);
    var highlights = S.buildKeySpecsGrid(highlightRows);
    if (highlights) wrap.appendChild(highlights);

    var cta = document.createElement('a');
    cta.className = 'btn-lease detail-cta';
    cta.href = S.LEASE_URL;
    cta.target = '_blank';
    cta.rel = 'noopener';
    cta.textContent = UI.leaseNow || 'Lease Now';
    wrap.appendChild(cta);

    return wrap;
  }

  function buildOverview(product) {
    if (!product.description && !product.productLine) return null;
    var section = buildSectionWrapper('// ' + (UI.overview || 'OVERVIEW').toUpperCase(), UI.overview || 'Overview');

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

    var section = buildSectionWrapper('// ' + (UI.bestFor || 'BEST FOR').toUpperCase(), UI.bestFor || 'Best For');
    var p = document.createElement('p');
    p.className = 'product-description detail-copy';
    p.textContent = text;
    section.appendChild(p);

    return section;
  }

  function buildSpecifications(product) {
    var section = buildSectionWrapper('// ' + (UI.specifications || 'SPECIFICATIONS').toUpperCase(), UI.specifications || 'Specifications');
    section.appendChild(S.buildSpecs(product));

    var componentsTable = S.buildComponentsTable(product);
    if (componentsTable) {
      var h3a = document.createElement('div');
      h3a.className = 'full-specs-heading';
      h3a.textContent = UI.hardwareConfiguration || 'Hardware Configuration';
      section.appendChild(h3a);
      section.appendChild(componentsTable);
    }

    var breakdownTable = S.buildDeploymentValueTable(product);
    if (breakdownTable) {
      var h3b = document.createElement('div');
      h3b.className = 'full-specs-heading';
      h3b.textContent = UI.estimatedDeploymentValue || 'Estimated Enterprise Deployment Value';
      section.appendChild(h3b);
      section.appendChild(breakdownTable);
    }

    return section;
  }

  // Pricing itself already lives in the above-the-fold zone, so this section covers
  // process only — repeating the price table here would just duplicate it.
  function buildDeployment(product) {
    var section = buildSectionWrapper('// ' + (UI.deployment || 'DEPLOYMENT').toUpperCase(), UI.deployment || 'Deployment');

    var note = document.createElement('p');
    note.className = 'product-description detail-copy';
    if (product.clusterScale) {
      var homeHref = (S.LOCALE === 'en' ? '' : '/' + S.LOCALE.replace('zh-CN', 'zh')) + '/#enterprise-deploy';
      var link = document.createElement('a');
      link.href = homeHref;
      link.textContent = UI.clusterDeployLink || 'Learn more about enterprise deployment →';
      note.textContent = UI.clusterDeployNote || 'This is a multi-node cluster deployment. Provisioning follows the enterprise deployment process — consultation, custom cluster design, and a defined support SLA. ';
      note.appendChild(link);
    } else {
      note.textContent = UI.singleDeployNote || 'Leasing and billing are handled directly through the Cloud Leasing platform. Deployment begins once your lease is confirmed.';
    }
    section.appendChild(note);

    return section;
  }

  function render(product) {
    document.getElementById('page-title').textContent = (product.name || UI.gpuServerFallback || 'GPU Server') + ' | Cloud Leasing';

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
    setStatus(UI.noProductSpecified || 'No product specified. Return to the GPU Servers page to choose one.');
  } else {
    setStatus(UI.loadingProduct || 'Loading product…');
    S.loadProducts()
      .then(function (products) {
        var product = Array.isArray(products) ? products.filter(function (p) { return p.id === requestedId; })[0] : null;
        if (!product) {
          setStatus(UI.productNotFound || 'This product could not be found. It may have been renamed or removed — see the full GPU Servers list instead.');
          return;
        }
        setStatus(null);
        render(product);
      })
      .catch(function () {
        setStatus(UI.unableToLoadProduct || 'Unable to load product data right now. Please try again shortly.');
      });
  }
})();
