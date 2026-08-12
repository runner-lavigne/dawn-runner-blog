# My Blog

마크다운 파일을 Jekyll로 정적 블로그 사이트로 빌드하는 프로젝트. GitHub Pages가 자동으로 Jekyll 빌드를 실행합니다.

## 기술 스택

- Jekyll (GitHub Pages 기본 지원, 별도 설치/빌드 명령 불필요)
- HTML, CSS, Liquid 템플릿
- 마크다운은 kramdown으로 변환 (Jekyll 기본 엔진)

## 프로젝트 구조

```
dawn-runner-blog/
├── _config.yml          # 사이트 설정 (title, url, baseurl, permalink 등)
├── _layouts/
│   ├── default.html     # 공통 레이아웃 (헤더, 다크모드 토글, 푸터)
│   ├── post.html        # 개별 글 레이아웃
│   └── page.html        # 소개/문의 등 일반 페이지 레이아웃
├── _includes/
│   └── theme-toggle.html
├── _posts/               # 실제 발행되는 글 (YYYY-MM-DD-slug.md 형식 필수)
├── posts/
│   └── <slug>/images/   # 각 글의 이미지 (static asset, Jekyll이 그대로 복사)
├── css/style.css
├── index.html            # 홈페이지 (site.posts 목록 렌더링)
├── about.md / privacy.md / contact.md   # 애드센스 심사용 필수 페이지
└── CLAUDE.md
```

## 새 글 작성 방법

1. `_posts/YYYY-MM-DD-slug.md` 파일 생성 (파일명 날짜가 게시일)
2. 프론트매터 작성:

```markdown
---
layout: post
title: 글 제목
date: YYYY-MM-DD
tags: [태그1, 태그2]
description: 글 요약
thumbnail: /posts/<slug>/images/대표이미지.jpg   # 사이트 루트 기준 절대경로
---

본문 내용...
```

3. 이미지는 `posts/<slug>/images/` 폴더에 넣고, 본문에서는 상대경로로 참조:
   `<figure><img src="images/파일명.jpg" alt="설명"><figcaption>설명</figcaption></figure>`
   (permalink이 `/posts/:slug/` 형태라 상대경로가 이미지 폴더와 자연스럽게 맞아떨어짐)

## 중요: .nojekyll 파일 주의

GitHub Pages 저장소 루트에 `.nojekyll` 파일이 있으면 Jekyll 빌드 자체가 건너뛰어지고 파일이 그대로 서빙됩니다. 이 프로젝트는 Jekyll 빌드가 필요하므로 `.nojekyll` 파일을 절대 추가하지 마세요.

## 다크 모드 구현

- CSS 변수로 라이트/다크 테마 색상 정의 (`css/style.css`)
- `_includes/theme-toggle.html`에서 `localStorage`에 사용자 선택 저장
- 시스템 설정 자동 감지 + 수동 토글 버튼 제공

## 배포

`main` 브랜치에 push하면 GitHub Pages가 자동으로 Jekyll 빌드 후 배포합니다. 별도의 빌드 명령이나 GitHub Actions 워크플로 설정이 필요 없습니다 (저장소 Settings → Pages에서 소스가 "Deploy from a branch"로 설정되어 있어야 함).

## 로컬 테스트 (선택)

Ruby/Bundler가 설치되어 있다면:

```bash
bundle exec jekyll serve
```

`http://localhost:4000/dawn-runner-blog/`에서 확인 (baseurl 포함).
