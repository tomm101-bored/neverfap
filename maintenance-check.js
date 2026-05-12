(function () {
  if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) return;

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
