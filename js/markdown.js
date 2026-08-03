function parseFrontmatter(text) {
  var match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: text };

  var meta = {};
  var lines = match[1].split('\n');
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;

    var key = line.substring(0, colonIdx).trim();
    var value = line.substring(colonIdx + 1).trim();

    if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1).split(',').map(function(s) {
        return s.trim().replace(/^['"]|['"]$/g, '');
      });
    } else {
      value = value.replace(/^['"]|['"]$/g, '');
    }

    meta[key] = value;
  }

  return { meta: meta, body: match[2] };
}

function parseMarkdown(md) {
  var lines = md.split('\n');
  var html = '';
  var inList = false;
  var listType = '';
  var inCodeBlock = false;
  var codeContent = '';
  var inBlockquote = false;
  var blockquoteContent = '';
  var paragraph = '';

  function flushParagraph() {
    if (paragraph.trim()) {
      html += '<p>' + inlineFormat(paragraph.trim()) + '</p>\n';
      paragraph = '';
    }
  }

  function closeList() {
    if (inList) {
      html += '</' + listType + '>\n';
      inList = false;
      listType = '';
    }
  }

  function closeBlockquote() {
    if (inBlockquote) {
      html += '<blockquote><p>' + inlineFormat(blockquoteContent.trim()) + '</p></blockquote>\n';
      inBlockquote = false;
      blockquoteContent = '';
    }
  }

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];

    if (inCodeBlock) {
      if (line.startsWith('```')) {
        html += '<pre><code>' + escapeHtml(codeContent.trim()) + '</code></pre>\n';
        inCodeBlock = false;
        codeContent = '';
      } else {
        codeContent += line + '\n';
      }
      continue;
    }

    if (line.startsWith('```')) {
      flushParagraph();
      closeList();
      closeBlockquote();
      inCodeBlock = true;
      codeContent = '';
      continue;
    }

    if (line.startsWith('> ')) {
      flushParagraph();
      closeList();
      if (!inBlockquote) inBlockquote = true;
      else blockquoteContent += ' ';
      blockquoteContent += line.substring(2);
      continue;
    } else if (inBlockquote) {
      closeBlockquote();
    }

    var headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      flushParagraph();
      closeList();
      var level = headingMatch[1].length;
      html += '<h' + level + '>' + inlineFormat(headingMatch[2]) + '</h' + level + '>\n';
      continue;
    }

    if (line.match(/^---$/) || line.match(/^\*\*\*$/) || line.match(/^___$/)) {
      flushParagraph();
      closeList();
      html += '<hr>\n';
      continue;
    }

    var ulMatch = line.match(/^[-*]\s+(.+)$/);
    if (ulMatch) {
      flushParagraph();
      if (!inList || listType !== 'ul') {
        closeList();
        html += '<ul>\n';
        inList = true;
        listType = 'ul';
      }
      html += '<li>' + inlineFormat(ulMatch[1]) + '</li>\n';
      continue;
    }

    var olMatch = line.match(/^\d+\.\s+(.+)$/);
    if (olMatch) {
      flushParagraph();
      if (!inList || listType !== 'ol') {
        closeList();
        html += '<ol>\n';
        inList = true;
        listType = 'ol';
      }
      html += '<li>' + inlineFormat(olMatch[1]) + '</li>\n';
      continue;
    }

    if (inList && line.trim() === '') {
      closeList();
      continue;
    }

    var imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) {
      flushParagraph();
      closeList();
      var alt = imgMatch[1];
      var src = imgMatch[2];
      if (alt) {
        html += '<figure><img src="' + src + '" alt="' + escapeHtml(alt) + '" loading="lazy"><figcaption>' + escapeHtml(alt) + '</figcaption></figure>\n';
      } else {
        html += '<figure><img src="' + src + '" alt="" loading="lazy"></figure>\n';
      }
      continue;
    }

    if (line.trim() === '') {
      flushParagraph();
      closeList();
      continue;
    }

    if (paragraph) paragraph += ' ';
    paragraph += line;
  }

  flushParagraph();
  closeList();
  closeBlockquote();

  return html;
}

function inlineFormat(text) {
  text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy">');
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
  return text;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
