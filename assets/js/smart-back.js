// Any element tagged data-smart-back uses the browser's actual back history
// (preserving scroll position on the previous page) when one exists, and
// falls back to its normal href (e.g. the parent listing page) only when
// there's nothing to go back to — e.g. the page was opened directly via a
// bookmark, typed URL, or external link.
document.querySelectorAll('[data-smart-back]').forEach(function (el) {
  el.addEventListener('click', function (e) {
    if (window.history.length > 1) {
      e.preventDefault();
      window.history.back();
    }
  });
});
