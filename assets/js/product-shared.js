(function () {
  'use strict';

  var DATA_URL = '/assets/data/products.json';
  var LEASE_URL = 'https://vig-compute.net/vig/index.html#/';

  var SPEC_FIELDS = [
    { key: 'gpu', label: 'GPU' },
    { key: 'cpu', label: 'CPU' },
    { key: 'memory', label: 'Memory' },
    { key: 'storage', label: 'Storage' },
    { key: 'network', label: 'Network' },
    { key: 'interconnect', label: 'Interconnect' }
  ];

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
      span.textContent = product.name || 'GPU Node';
      wrap.appendChild(span);
    }

    if (product.image) {
      var img = document.createElement('img');
      img.src = product.image;
      img.alt = product.name || 'GPU server';
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
      dt.textContent = 'GPU Count';
      var dd = document.createElement('dd');
      dd.textContent = product.gpuQuantity + (product.clusterScale ? ' (cluster total)' : '');
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
        period.textContent = tier.leasePeriod;
        row.appendChild(period);
      }
      if (tier.returnValue) {
        var ret = document.createElement('span');
        ret.className = 'pricing-cell pricing-return';
        ret.textContent = (tier.returnLabel || 'Return') + ': ' + tier.returnValue;
        row.appendChild(ret);
      }

      wrap.appendChild(row);
    });

    return wrap;
  }

  function deploymentTypeLabel(product) {
    if (product.clusterScale) return 'Cluster';
    if (product.gpuFamily === 'RTX') return 'Workstation';
    if (product.gpuQuantity === 1) return 'Single GPU';
    if (product.gpuQuantity > 1) return 'Multi GPU';
    return null;
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
    statusBadge.textContent = product.status || 'Unknown';
    wrap.appendChild(statusBadge);

    var typeLabel = deploymentTypeLabel(product);
    if (typeLabel) {
      var typeBadge = document.createElement('span');
      typeBadge.className = 'product-status-badge status-' + statusSlug(typeLabel);
      typeBadge.textContent = typeLabel;
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

    var thead = document.createElement('thead');
    thead.innerHTML = '<tr><th>Component</th><th>Brand</th><th>Configuration</th><th>Price</th></tr>';
    table.appendChild(thead);

    var tbody = document.createElement('tbody');
    product.components.forEach(function (c) {
      var tr = document.createElement('tr');

      var tdItem = document.createElement('td');
      tdItem.textContent = c.item || '';
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
      addRow('Hardware Subtotal', null, product.hardwareSubtotal, true, false);
    }
    if (hasBreakdown) {
      product.deploymentBreakdown.forEach(function (row) {
        addRow(row.item, row.detail, row.price, false, false);
      });
    }
    if (product.fabricServicesSubtotal) {
      addRow('Fabric / Software / Services Subtotal', null, product.fabricServicesSubtotal, true, false);
    }
    if (product.deploymentValue) {
      addRow('Estimated Enterprise Deployment Value', null, product.deploymentValue, false, true);
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
    summary.textContent = 'View Full Specifications';
    details.appendChild(summary);

    if (componentsTable) {
      var h4a = document.createElement('div');
      h4a.className = 'full-specs-heading';
      h4a.textContent = 'Hardware Configuration';
      details.appendChild(h4a);
      details.appendChild(componentsTable);
    }

    if (breakdownTable) {
      var h4b = document.createElement('div');
      h4b.className = 'full-specs-heading';
      h4b.textContent = 'Estimated Enterprise Deployment Value';
      details.appendChild(h4b);
      details.appendChild(breakdownTable);
    }

    return details;
  }

  function detailUrl(product) {
    return '/products/detail.html?id=' + encodeURIComponent(product.id);
  }

  window.ProductShared = {
    DATA_URL: DATA_URL,
    LEASE_URL: LEASE_URL,
    SPEC_FIELDS: SPEC_FIELDS,
    statusSlug: statusSlug,
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
