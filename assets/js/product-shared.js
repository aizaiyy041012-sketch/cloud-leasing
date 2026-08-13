(function () {
  'use strict';

  var DATA_URL = '/assets/data/products.json';
  var TRANSLATIONS_URL = '/assets/data/products.translations.json';
  // Sourced from assets/js/config.js, which must load before this file.
  var LEASE_URL = window.LEASING_SYSTEM_URL;
  // Sourced from assets/js/i18n.js + i18n-dictionary.js, which must load before this file.
  var LOCALE = (window.CloudLeasingI18n && window.CloudLeasingI18n.locale) || 'en';
  var UI = window.CloudLeasingUI || {};

  var SPEC_FIELDS = [
    { key: 'gpu', label: (UI.specLabels && UI.specLabels.gpu) || 'GPU' },
    { key: 'cpu', label: (UI.specLabels && UI.specLabels.cpu) || 'CPU' },
    { key: 'memory', label: (UI.specLabels && UI.specLabels.memory) || 'Memory' },
    { key: 'storage', label: (UI.specLabels && UI.specLabels.storage) || 'Storage' },
    { key: 'network', label: (UI.specLabels && UI.specLabels.network) || 'Network' },
    { key: 'interconnect', label: (UI.specLabels && UI.specLabels.interconnect) || 'Interconnect' }
  ];

  // Product listing/spec data (assets/data/products.json) stays single-sourced in
  // English — technical fields (brand names, part numbers, prices) don't need
  // translating and would just drift if duplicated per locale. Only the
  // human-language fields (name/category/description/clusterScale) get a
  // per-locale overlay merged in here before anything renders.
  var translationsPromise = null;
  function loadProducts() {
    var productsPromise = fetch(DATA_URL).then(function (res) {
      if (!res.ok) throw new Error('Failed to load product data');
      return res.json();
    });

    if (LOCALE === 'en') return productsPromise;

    if (!translationsPromise) {
      translationsPromise = fetch(TRANSLATIONS_URL)
        .then(function (res) { return res.ok ? res.json() : null; })
        .catch(function () { return null; });
    }

    return Promise.all([productsPromise, translationsPromise]).then(function (results) {
      var products = results[0];
      var translations = results[1];
      if (!translations) return products;
      return products.map(function (product) {
        var entry = translations.products && translations.products[product.id];
        var override = entry && entry[LOCALE];
        return override ? Object.assign({}, product, override) : product;
      });
    });
  }

  function translateLabel(dict, value) {
    if (!value) return value;
    return (dict && dict[value]) || value;
  }

  function statusSlug(status) {
    return String(status || 'unknown').trim().toLowerCase().replace(/\s+/g, '-');
  }

  function buildImage(product) {
    var wrap = document.createElement('div');
    wrap.className = 'product-card-image';

    function showPlaceholder() {
      wrap.classList.add('is-placeholder');
      wrap.innerHTML = '';
      var span = document.createElement('span');
      span.textContent = product.name || UI.gpuNodeFallback || 'GPU Node';
      wrap.appendChild(span);
    }

    var src = product.image || ('/assets/images/products/' + product.id + '.svg');

    if (src) {
      var img = document.createElement('img');
      img.src = src;
      img.alt = (product.name || UI.gpuServerFallback || 'GPU server') + (UI.gpuServerAltSuffix || ' architecture diagram');
      img.loading = 'lazy';
      img.addEventListener('error', showPlaceholder);
      wrap.appendChild(img);
    } else {
      showPlaceholder();
    }

    return wrap;
  }

  function buildSpecs(product) {
    var dl = document.createElement('dl');
    dl.className = 'product-specs';

    SPEC_FIELDS.forEach(function (field) {
      var value = product[field.key];
      if (!value) return;

      var row = document.createElement('div');
      row.className = 'spec-row';

      var dt = document.createElement('dt');
      dt.textContent = field.label;

      var dd = document.createElement('dd');
      dd.textContent = value;

      row.appendChild(dt);
      row.appendChild(dd);
      dl.appendChild(row);
    });

    if (product.gpuQuantity) {
      var row = document.createElement('div');
      row.className = 'spec-row';
      var dt = document.createElement('dt');
      dt.textContent = UI.gpuCount || 'GPU Count';
      var dd = document.createElement('dd');
      dd.textContent = product.gpuQuantity + (product.clusterScale ? (UI.clusterTotalSuffix || ' (cluster total)') : '');
      row.appendChild(dt);
      row.appendChild(dd);
      dl.appendChild(row);
    }

    return dl;
  }

  function buildPricingTable(product) {
    if (!Array.isArray(product.pricing) || product.pricing.length === 0) return null;

    var wrap = document.createElement('div');
    wrap.className = 'pricing-table';

    product.pricing.forEach(function (tier) {
      var row = document.createElement('div');
      row.className = 'pricing-row';

      if (tier.leasePrice) {
        var price = document.createElement('span');
        price.className = 'pricing-cell pricing-price';
        price.textContent = tier.leasePrice;
        row.appendChild(price);
      }
      if (tier.leasePeriod) {
        var period = document.createElement('span');
        period.className = 'pricing-cell pricing-period';
        period.textContent = translateLabel(UI.leasePeriods, tier.leasePeriod);
        row.appendChild(period);
      }
      if (tier.returnValue) {
        var ret = document.createElement('span');
        ret.className = 'pricing-cell pricing-return';
        ret.textContent = translateLabel(UI.returnLabels, tier.returnLabel || 'Return') + ': ' + tier.returnValue;
        row.appendChild(ret);
      }

      wrap.appendChild(row);
    });

    if (product.hardwareSubtotal) {
      var deployRow = document.createElement('div');
      deployRow.className = 'pricing-deployment-row';

      var deployLabel = document.createElement('span');
      deployLabel.className = 'pricing-deployment-label';
      deployLabel.textContent = UI.deploymentValueLabel || 'Deployment Value';

      var deployValue = document.createElement('span');
      deployValue.className = 'pricing-deployment-value';
      deployValue.textContent = product.hardwareSubtotal;

      deployRow.appendChild(deployLabel);
      deployRow.appendChild(deployValue);
      wrap.appendChild(deployRow);
    }

    return wrap;
  }

  // Returns { key, label }: key is the stable English identifier (used for the
  // CSS status-slug so class names stay ASCII and stable across locales), label
  // is the translated display text shown in the badge.
  function deploymentType(product) {
    var key = null;
    if (product.clusterScale) key = 'Cluster';
    else if (product.gpuFamily === 'RTX') key = 'Workstation';
    else if (product.gpuQuantity === 1) key = 'Single GPU';
    else if (product.gpuQuantity > 1) key = 'Multi GPU';
    if (!key) return null;
    return { key: key, label: (UI.deployTypeLabels && UI.deployTypeLabels[key]) || key };
  }

  function deploymentTypeLabel(product) {
    var type = deploymentType(product);
    return type ? type.label : null;
  }

  function buildKeySpecsGrid(rows) {
    if (!rows || !rows.length) return null;

    var grid = document.createElement('div');
    grid.className = 'key-specs-grid';

    rows.forEach(function (pair) {
      var tile = document.createElement('div');
      tile.className = 'key-spec-tile';

      var label = document.createElement('div');
      label.className = 'key-spec-label';
      label.textContent = pair[0];

      var value = document.createElement('div');
      value.className = 'key-spec-value';
      value.textContent = pair[1];

      tile.appendChild(label);
      tile.appendChild(value);
      grid.appendChild(tile);
    });

    return grid;
  }

  function buildBadgeRow(product) {
    var wrap = document.createElement('div');
    wrap.className = 'badge-row';

    var statusBadge = document.createElement('span');
    var statusSlugVal = statusSlug(product.status);
    statusBadge.className = 'product-status-badge status-' + statusSlugVal;
    statusBadge.textContent = translateLabel(UI.statuses, product.status) || 'Unknown';
    wrap.appendChild(statusBadge);

    var type = deploymentType(product);
    if (type) {
      var typeBadge = document.createElement('span');
      typeBadge.className = 'product-status-badge status-' + statusSlug(type.key);
      typeBadge.textContent = type.label;
      wrap.appendChild(typeBadge);
    }

    return wrap;
  }

  function buildComponentsTable(product) {
    if (!Array.isArray(product.components) || product.components.length === 0) return null;

    var scroll = document.createElement('div');
    scroll.className = 'table-scroll';

    var table = document.createElement('table');
    table.className = 'component-table';

    var headers = UI.tableHeaders || {};
    var thead = document.createElement('thead');
    var headRow = document.createElement('tr');
    [headers.component || 'Component', headers.brand || 'Brand', headers.configuration || 'Configuration', headers.price || 'Price'].forEach(function (text) {
      var th = document.createElement('th');
      th.textContent = text;
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    table.appendChild(thead);

    var tbody = document.createElement('tbody');
    product.components.forEach(function (c) {
      var tr = document.createElement('tr');

      var tdItem = document.createElement('td');
      tdItem.textContent = translateLabel(UI.componentItems, c.item) || '';
      var tdBrand = document.createElement('td');
      tdBrand.textContent = c.brand || '';
      var tdConfig = document.createElement('td');
      tdConfig.textContent = c.config || '';
      var tdPrice = document.createElement('td');
      tdPrice.textContent = c.price || '';
      if (c.priceDetail) {
        var small = document.createElement('span');
        small.className = 'price-detail';
        small.textContent = ' (' + c.priceDetail + ')';
        tdPrice.appendChild(small);
      }

      tr.appendChild(tdItem);
      tr.appendChild(tdBrand);
      tr.appendChild(tdConfig);
      tr.appendChild(tdPrice);
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    scroll.appendChild(table);
    return scroll;
  }

  function buildDeploymentValueTable(product) {
    var hasBreakdown = Array.isArray(product.deploymentBreakdown) && product.deploymentBreakdown.length > 0;
    if (!hasBreakdown && !product.hardwareSubtotal && !product.deploymentValue) return null;

    var scroll = document.createElement('div');
    scroll.className = 'table-scroll';

    var table = document.createElement('table');
    table.className = 'breakdown-table';

    var tbody = document.createElement('tbody');

    function addRow(label, detail, price, isSubtotal, isTotal) {
      var tr = document.createElement('tr');
      if (isSubtotal) tr.className = 'row-subtotal';
      if (isTotal) tr.className = 'row-total';

      var tdLabel = document.createElement('td');
      tdLabel.textContent = detail ? label + ' — ' + detail : label;
      var tdPrice = document.createElement('td');
      tdPrice.textContent = price || '';

      tr.appendChild(tdLabel);
      tr.appendChild(tdPrice);
      tbody.appendChild(tr);
    }

    if (product.hardwareSubtotal) {
      addRow(UI.hardwareSubtotal || 'Hardware Subtotal', null, product.hardwareSubtotal, true, false);
    }
    if (hasBreakdown) {
      product.deploymentBreakdown.forEach(function (row) {
        addRow(translateLabel(UI.deployItems, row.item), row.detail, row.price, false, false);
      });
    }
    if (product.fabricServicesSubtotal) {
      addRow(UI.fabricServicesSubtotal || 'Fabric / Software / Services Subtotal', null, product.fabricServicesSubtotal, true, false);
    }
    if (product.deploymentValue) {
      addRow(UI.estimatedDeploymentValue || 'Estimated Enterprise Deployment Value', null, product.deploymentValue, false, true);
    }

    table.appendChild(tbody);
    scroll.appendChild(table);
    return scroll;
  }

  function buildFullSpecs(product) {
    var componentsTable = buildComponentsTable(product);
    var breakdownTable = buildDeploymentValueTable(product);
    if (!componentsTable && !breakdownTable) return null;

    var details = document.createElement('details');
    details.className = 'full-specs';

    var summary = document.createElement('summary');
    summary.textContent = UI.viewFullSpecs || 'View Full Specifications';
    details.appendChild(summary);

    if (componentsTable) {
      var h4a = document.createElement('div');
      h4a.className = 'full-specs-heading';
      h4a.textContent = UI.hardwareConfiguration || 'Hardware Configuration';
      details.appendChild(h4a);
      details.appendChild(componentsTable);
    }

    if (breakdownTable) {
      var h4b = document.createElement('div');
      h4b.className = 'full-specs-heading';
      h4b.textContent = UI.estimatedDeploymentValue || 'Estimated Enterprise Deployment Value';
      details.appendChild(h4b);
      details.appendChild(breakdownTable);
    }

    return details;
  }

  function detailUrl(product) {
    var prefix = LOCALE === 'en' ? '' : '/' + LOCALE.replace('zh-CN', 'zh');
    return prefix + '/products/detail.html?id=' + encodeURIComponent(product.id);
  }

  window.ProductShared = {
    DATA_URL: DATA_URL,
    LEASE_URL: LEASE_URL,
    LOCALE: LOCALE,
    UI: UI,
    SPEC_FIELDS: SPEC_FIELDS,
    loadProducts: loadProducts,
    translateLabel: translateLabel,
    statusSlug: statusSlug,
    deploymentType: deploymentType,
    deploymentTypeLabel: deploymentTypeLabel,
    buildKeySpecsGrid: buildKeySpecsGrid,
    buildBadgeRow: buildBadgeRow,
    buildImage: buildImage,
    buildSpecs: buildSpecs,
    buildPricingTable: buildPricingTable,
    buildComponentsTable: buildComponentsTable,
    buildDeploymentValueTable: buildDeploymentValueTable,
    buildFullSpecs: buildFullSpecs,
    detailUrl: detailUrl
  };
})();
