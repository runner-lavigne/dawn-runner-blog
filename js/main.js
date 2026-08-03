(function() {
  fetch('posts/posts.json')
    .then(function(res) { return res.json(); })
    .then(function(posts) {
      posts = posts.filter(function(p) { return !p.draft; });
      posts.sort(function(a, b) {
        return new Date(b.date) - new Date(a.date);
      });

      var container = document.getElementById('postList');
      posts.forEach(function(post) {
        var card = document.createElement('a');
        card.className = 'post-card';
        card.href = 'post.html?slug=' + post.slug;

        var thumbnailHtml = '';
        if (post.thumbnail) {
          thumbnailHtml = '<img class="post-card-thumbnail" src="' + post.thumbnail + '" alt="' + escapeAttr(post.title) + '">';
        }

        var tagsHtml = '';
        if (post.tags && post.tags.length) {
          tagsHtml = '<div class="post-card-tags">' +
            post.tags.map(function(tag) {
              return '<span class="tag">' + tag + '</span>';
            }).join('') +
            '</div>';
        }

        card.innerHTML =
          thumbnailHtml +
          '<div class="post-card-body">' +
            '<div class="post-card-date">' + formatDate(post.date) + '</div>' +
            '<h2 class="post-card-title">' + escapeHtml(post.title) + '</h2>' +
            '<p class="post-card-description">' + escapeHtml(post.description) + '</p>' +
            tagsHtml +
          '</div>';

        container.appendChild(card);
      });
    });

  function formatDate(dateStr) {
    var parts = dateStr.split('-');
    return parts[0] + '년 ' + parseInt(parts[1]) + '월 ' + parseInt(parts[2]) + '일';
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function escapeAttr(str) {
    return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
})();
