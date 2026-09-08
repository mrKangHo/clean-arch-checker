🇰🇷 [한국어](README.md) | 🇺🇸 [English](README.en.md) | 🇯🇵 [日本語](README.ja.md) | 🇨🇳 [中文](README.zh.md)

<p align="center">
  <img src="docs/icon.svg" width="128" alt="clean-arch-checker icon" />
</p>

<h1 align="center">🛡️ Clean Architecture Checker Skill</h1>

<p align="center">
  AI 에이전트(Claude Code, Antigravity, Cursor, Codex 등)에서 iOS, Android, Flutter, React Native 프로젝트의 클린 아키텍처 준수 여부를 자동 점검하는 전용 도구입니다.
</p>

<p align="center">
  <img src="docs/screenshot.png" alt="Clean Architecture Checker Screenshot" width="800" />
</p>

## 주요 특징

* **모든 주요 AI Coding Agent 지원**: Claude Code, Antigravity, Cursor, Codex, OpenCode 등 다양한 AI 코딩 에이전트와 완벽 호환
* **자동 플랫폼 식별**: iOS (`.xcodeproj`, `Package.swift`), Android (`build.gradle`), Flutter (`pubspec.yaml`), React Native (`package.json`, `tsconfig.json`) 자동 인식
* **레이어 오염 검사**: `Domain` 레이어 내 UI 프레임워크 및 외부 라이브러리 직접 참조 탐색
* **의존성 방향 검증**: 계층 간 DTO 직참조 및 Repository 인터페이스의 올바른 계층 배치 확인
* **점수화 리포트**: 100점 만점 건강도 평가 및 자동 리팩토링 지원

## 설치 (Installation)

### Homebrew
```bash
brew tap mrKangHo/tap
brew install clean-arch-checker
```

### NPX 빠른 설치
```bash
npx github:mrKangHo/clean-arch-checker
```

## 사용 방법

에이전트에게 자연어로 다음과 같이 요청하세요:
> *"이 프로젝트 클린 아키텍처 잘 지키고 있는지 점검해 줘"*  
> *"Domain 레이어에 금지된 외부 패키지 임포트가 없는지 확인하고 자동 리팩토링해 줘"*
