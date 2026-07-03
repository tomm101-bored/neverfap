(function () {
  if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) return;

  // Admin maintenance bypass: if an admin signed in through the maintenance
  // page, never redirect them to the maintenance screen for this session.
  // ?nfbp=1 carries the bypass across origins (the destination buttons use it),
  // then it's stored so it survives further same-origin navigation.
  try {
    if (new URLSearchParams(window.location.search).get('nfbp') === '1') {
      sessionStorage.setItem('nf_maint_bypass', '1');
      return;
    }
    if (sessionStorage.getItem('nf_maint_bypass') === '1') return;
  } catch (e) {}

  var html = document.documentElement;
  var prevVisibility = html.style.visibility;
  html.style.visibility = 'hidden';

  var revealTimer = setTimeout(function () {
    html.style.visibility = prevVisibility || '';
  }, 4000);

  fetch(window.SUPABASE_URL + '/rest/v1/site_settings?select=maintenance_mode&id=eq.1', {
    headers: {
      apikey: window.SUPABASE_ANON_KEY,
      Authorization: 'Bearer ' + window.SUPABASE_ANON_KEY
    },
    cache: 'no-store'
  })
    .then(function (r) { return r.json(); })
    .then(function (rows) {
      if (rows && rows[0] && rows[0].maintenance_mode === true) {
        clearTimeout(revealTimer);
        window.location.replace('./maintenance.html');
      } else {
        clearTimeout(revealTimer);
        html.style.visibility = prevVisibility || '';
      }
    })
    .catch(function () {
      clearTimeout(revealTimer);
      html.style.visibility = prevVisibility || '';
    });
})();
