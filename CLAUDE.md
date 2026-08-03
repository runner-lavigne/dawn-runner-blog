# My Blog

마크다운 파일을 읽어 정적 블로그 웹사이트로 변환하는 프로젝트.

## 기술 스택

- HTML, CSS, JavaScript (프레임워크 없음, 바닐라 JS만 사용)
- 빌드 도구나 번들러 없음
- 마크다운 파싱은 자체 구현 또는 경량 라이브러리 (CDN 없이 로컬 포함)

## 디자인 원칙

- 깔끔하고 읽기 좋은 타이포그래피 중심 디자인
- 다크 모드 지원 (`prefers-color-scheme` 미디어 쿼리 + 수동 토글)
- 모바일 퍼스트 반응형 레이아웃
- 불필요한 장식 최소화, 콘텐츠에 집중

## 프로젝트 구조

```
my-blog/
├── index.html          # 블로그 메인 페이지 (글 목록)
├── post.html           # 개별 글 페이지
├── css/
│   └── style.css       # 전체 스타일
├── js/
│   ├── main.js         # 메인 페이지 로직
│   ├── post.js         # 글 페이지 로직
│   └── markdown.js     # 마크다운 파서
├── posts/              # 마크다운 글 파일 (.md)
│   └── posts.json      # 글 메타데이터 목록
└── CLAUDE.md
```

## 마크다운 글 형식

각 `.md` 파일은 YAML 프론트매터로 메타데이터를 포함:

```markdown
---
title: 글 제목
date: 2026-07-29
tags: [태그1, 태그2]
description: 글 요약
---

본문 내용...
```

`posts/posts.json`에 글 목록을 관리:

```json
[
  {
    "slug": "파일명(확장자 제외)",
    "title": "글 제목",
    "date": "2026-07-29",
    "tags": ["태그1"],
    "description": "요약"
  }
]
```

## 코딩 컨벤션

- ES 모듈 사용하지 않음 (script 태그로 직접 로드)
- CSS 커스텀 프로퍼티(변수)로 테마 관리
- 시맨틱 HTML 태그 사용 (article, nav, header, main, footer)
- 한국어 콘텐츠 기준, UI 텍스트도 한국어

## 다크 모드 구현

- CSS 변수로 라이트/다크 테마 색상 정의
- `localStorage`에 사용자 선택 저장
- 시스템 설정 자동 감지 + 수동 토글 버튼 제공

## 개발 서버

로컬 테스트 시:

```bash
python3 -m http.server 8000
```

`http://localhost:8000`에서 확인.
