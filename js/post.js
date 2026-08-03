(function() {
  var params = new URLSearchParams(window.location.search);
  var slug = params.get('slug');

  if (!slug) {
    window.location.href = 'index.html';
    return;
  }

  var basePath = 'posts/' + slug + '/';

  fetch(basePath + 'index.md')
    .then(function(res) {
      if (!res.ok) throw new Error('Post not found');
      return res.text();
    })
    .then(function(text) {
      var parsed = parseFrontmatter(text);
      var meta = parsed.meta;
      var body = parsed.body;

      document.title = meta.title + ' — 새벽을 달리는 여자';
      var descMeta = document.querySelector('meta[name="description"]');
      if (descMeta && meta.description) {
        descMeta.setAttribute('content', meta.description);
      }

      var tagsHtml = '';
      if (meta.tags && meta.tags.length) {
        tagsHtml = '<div class="post-tags">' +
          meta.tags.map(function(tag) {
            return '<span class="tag">' + tag + '</span>';
          }).join('') +
          '</div>';
      }

      var heroHtml = '';
      if (meta.thumbnail) {
        heroHtml = '<img class="post-hero" src="' + meta.thumbnail + '" alt="' + (meta.title || '') + '">';
      }

      var dateStr = '';
      if (meta.date) {
        var parts = meta.date.split('-');
        dateStr = parts[0] + '년 ' + parseInt(parts[1]) + '월 ' + parseInt(parts[2]) + '일';
      }

      var contentHtml = parseMarkdown(body);

      contentHtml = contentHtml.replace(/src="(?!https?:\/\/|\/)(.*?)"/g, 'src="' + basePath + '$1"');

      var article = document.getElementById('postArticle');
      article.innerHTML =
        '<div class="post-header">' +
          '<div class="post-date">' + dateStr + '</div>' +
          '<h1 class="post-title">' + (meta.title || '') + '</h1>' +
          tagsHtml +
        '</div>' +
        heroHtml +
        '<div class="post-content">' + contentHtml + '</div>';
    })
    .catch(function() {
      document.getElementById('postArticle').innerHTML =
        '<div class="post-header"><h1 class="post-title">글을 찾을 수 없습니다</h1></div>' +
        '<p style="text-align:center;color:var(--text-secondary)">요청하신 글이 존재하지 않습니다.</p>';
    });
})();
