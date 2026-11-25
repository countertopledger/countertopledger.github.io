/* Countertop Ledger: (1) picks the Amazon tracking ID by traffic source, so we can see which channel sells.
   Pinterest visits use countertopledpin-20, search engines use countertopledseo-20, everything else countertopled-20.
   (2) Counts page views and clicks on Amazon buttons with GoatCounter (the service says: no cookies, no persistent personal data), per page. */
(function () {
  var TAGS = { pin: 'countertopledpin-20', seo: 'countertopledseo-20', site: 'countertopled-20' };
  var GC_ENDPOINT = 'https://countertopledger.goatcounter.com/count';
  var source = null;
  try { source = sessionStorage.getItem('ctl_source'); } catch (e) {}
  if (!source) {
    var ref = (document.referrer || '').toLowerCase();
    var params = new URLSearchParams(location.search);
    var utm = (params.get('utm_source') || '').toLowerCase();
    if (utm.indexOf('pinterest') > -1 || /pinterest\.|pin\.it/.test(ref)) source = 'pin';
    else if (/google\.|bing\.|duckduckgo\.|yahoo\./.test(ref)) source = 'seo';
    else source = 'site';
    try { sessionStorage.setItem('ctl_source', source); } catch (e) {}
  }
  var tag = TAGS[source] || TAGS.site;
  var slug = (location.pathname.split('/').pop() || 'home').replace(/\.html$/, '') || 'home';
  var links = document.querySelectorAll('a[href*="amazon.com"]');
  for (var i = 0; i < links.length; i++) {
    try {
      var u = new URL(links[i].href);
      u.searchParams.set('tag', tag);
      links[i].href = u.toString();
      var m = u.pathname.match(/\/dp\/([A-Z0-9]{10})/);
      links[i].setAttribute('data-ctl-click', 'amazon/' + slug + '/' + (m ? m[1] : 'other'));
    } catch (e) {}
  }
  /* GoatCounter: page view on load; clicks are counted by our own handler below (no_events turns off its automatic one). */
  window.goatcounter = { no_events: true };
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://gc.zgo.at/count.js';
  s.setAttribute('data-goatcounter', GC_ENDPOINT);
  document.head.appendChild(s);
  document.addEventListener('click', function (ev) {
    try {
      var a = ev.target.closest && ev.target.closest('a[data-ctl-click]');
      if (!a || !window.goatcounter || typeof window.goatcounter.count !== 'function') return;
      window.goatcounter.count({ path: a.getAttribute('data-ctl-click'), title: source + ' | ' + slug, event: true });
    } catch (e) {}
  }, true);
})();
