/* Countertop Ledger: picks the Amazon tracking ID by traffic source, so we can see which channel sells.
   Pinterest visits use countertopledpin-20, search engines use countertopledseo-20, everything else countertopled-20. */
(function () {
  var TAGS = { pin: 'countertopledpin-20', seo: 'countertopledseo-20', site: 'countertopled-20' };
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
  var links = document.querySelectorAll('a[href*="amazon.com"]');
  for (var i = 0; i < links.length; i++) {
    try {
      var u = new URL(links[i].href);
      u.searchParams.set('tag', tag);
      links[i].href = u.toString();
    } catch (e) {}
  }
})();
