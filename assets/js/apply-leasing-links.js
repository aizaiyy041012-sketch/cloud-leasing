// Applies the single configured leasing-system URL (assets/js/config.js) to every
// static anchor tagged with data-leasing-link. Must load after config.js and after
// the tagged anchors already exist in the DOM (i.e. placed near the end of <body>).
document.querySelectorAll('[data-leasing-link]').forEach(function (el) {
  el.href = window.LEASING_SYSTEM_URL;
});
