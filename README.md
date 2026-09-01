# 🛡️ Clean Architecture Checker Skill for AI Agents

[🇰🇷 한국어 설명](#-한국어-가이드) | [🇺🇸 English Guide](#-english-guide)

---

<a name="-한국어-가이드"></a>
## 🇰🇷 한국어 가이드

**`clean-arch-checker`**는 다양한 AI 에이전트(Antigravity, Cursor, Claude Code, Windsurf 등)에서 iOS(Swift), Android(Kotlin), Flutter(Dart) 프로젝트의 **클린 아키텍처(Clean Architecture)** 및 **의존성 역전 원칙(DIP)** 준수 여부를 자동으로 점검하고, 리팩토링 방안을 제시하는 AI Agent 전용 스킬 패키지입니다.

### 🌟 주요 특징
* **모든 AI Coding Agent 지원**: Antigravity, Cursor, Claude Code, Windsurf 등 프롬프트 기반 AI 코딩 에이전트와 완벽 호환
* **자동 플랫폼 식별**: iOS (`.xcodeproj`, `Package.swift`), Android (`build.gradle`), Flutter (`pubspec.yaml`) 자동 인식
* **레이어 오염 검사**: `Domain` 레이어 내 UI 프레임워크(UIKit, SwiftUI, Composable, Material), DB(CoreData, Room, Hive, Isar), 네트워크 라이브러리(Alamofire, Retrofit, Dio) 임포트 및 참조 오염 탐색
* **의존성 방향 검증**: `Presentation` 계층에서 `Data` 계층 DTO 직참조 및 `Repository` 인터페이스의 올바른 계층 배치 확인
* **점수화 리포트 & 클릭 가능한 코드 링크**: 100점 만점 건강도 평가 및 해당 라인 이동 링크 (`file:///path/to/file#L12`) 제공
* **진단 & 자동 수정 지원**: 단순 점검 리포트 제공부터 사용자의 요청 시 AI 에이전트를 통한 **코드 자동 리팩토링**까지 지원

---

### 💻 빠른 설치 (NPX 사용)

터미널에서 아래 단 한 줄의 명령어만 실행하면 사용자의 AI 개발 환경에 스킬이 자동 설치됩니다.

#### 1. 전역(Global) 스킬로 설치 (추천)
모든 프로젝트에서 공통으로 사용하도록 머신의 전역 스킬 디렉토리에 설치합니다:

```bash
npx github:mrKangHo/clean-arch-checker
```

#### 2. 현재 워크스페이스 프로젝트 전용 설치
현재 작업 중인 레포지토리의 프로젝트 전용 스킬 디렉토리(`.agents/skills/`)에만 설치합니다:

```bash
npx github:mrKangHo/clean-arch-checker --workspace
```

---

### 🎯 사용 방법

설치가 완료되면 연동된 AI 에이전트에게 다음과 같이 자연어로 요청하세요:

* **진단만 요청 시**: 
  > *"이 프로젝트 클린 아키텍처 잘 지키고 있는지 점검해 줘"*  
  > *"Domain 레이어에 금지된 외부 패키지 임포트가 없는지 확인해 줘"*
* **진단 + 자동 수정 요청 시**: 
  > *"클린 아키텍처 점검하고 발견된 위반 사항을 직접 리팩토링해 줘"*

---

### 📄 플랫폼별 주요 점검 항목

| 대상 플랫폼 | 점검 레이어 | 검사 내용 |
| :--- | :--- | :--- |
| **iOS** (Swift) | Domain | `UIKit`, `SwiftUI`, `CoreData`, `Alamofire`, `Moya` 오염 여부 |
| **Android** (Kotlin) | Domain | `android.*`, `androidx.*`, `Retrofit`, `Room` 오염 여부 |
| **Flutter** (Dart) | Domain | `material.dart`, `widgets.dart`, `dio`, `isar`, `hive` 오염 여부 |
| **공통** | Layer Isolation | Presentation <-> Data 직참조 여부, DTO/Entity Mapper 및 UseCase 사용 검증 |

---

<br/>

---

<a name="-english-guide"></a>
## 🇺🇸 English Guide

**`clean-arch-checker`** is a skill package designed for AI Coding Agents (such as Antigravity, Cursor, Claude Code, Windsurf, etc.) to automatically audit iOS (Swift), Android (Kotlin), and Flutter (Dart) projects for compliance with **Clean Architecture** principles and the **Dependency Inversion Principle (DIP)**.

### 🌟 Key Features
* **Compatible with All AI Coding Agents**: Works seamlessly with Antigravity, Cursor, Claude Code, Windsurf, and other prompt-driven AI coding assistants.
* **Automatic Platform Detection**: Auto-detects iOS (`.xcodeproj`, `Package.swift`), Android (`build.gradle`), and Flutter (`pubspec.yaml`).
* **Domain Layer Isolation Check**: Scans for illegal imports in the `Domain` layer (e.g., UI frameworks like UIKit/SwiftUI/Material, DBs like Room/CoreData/Hive, or Network libs like Retrofit/Dio/Alamofire).
* **Dependency Rule Validation**: Ensures `Presentation` layer does not directly depend on `Data` layer DTOs, and verifies `Repository` interfaces are defined inside `Domain`.
* **Health Score & Clickable Links**: Provides a 100-point architecture health score and direct clickable file/line links (`file:///path/to/file#L12`).
* **Audit & Auto-Refactoring Support**: Offers detailed diagnostic reports and can perform **automated code refactoring** upon user request.

---

### 💻 Fast Installation (via NPX)

Run a single command in your terminal to automatically install the skill into your AI development environment.

#### 1. Global Installation (Recommended)
Installs into your global skill directory for use across all projects on your machine:

```bash
npx github:mrKangHo/clean-arch-checker
```

#### 2. Workspace Installation
Installs into the project skill directory (`.agents/skills/`) of your current workspace repository:

```bash
npx github:mrKangHo/clean-arch-checker --workspace
```

---

### 🎯 Usage Examples

Once installed, simply prompt your AI Coding Agent in plain language:

* **Audit Only**:
  > *"Audit this project to check if it strictly follows Clean Architecture principles."*  
  > *"Scan the Domain layer for any illegal third-party SDK dependencies."*
* **Audit & Auto-Refactor**:
  > *"Audit Clean Architecture rules and automatically refactor any violations found."*

---

### 📁 Repository Structure

```text
clean-arch-checker/
├── README.md                                  # Documentation (KR / EN)
├── package.json                               # NPM Package manifest & CLI binary
├── bin/
│   └── install.js                             # NPX installer script
└── skills/
    └── clean-arch-checker/
        ├── SKILL.md                           # Skill instructions & audit prompt rules
        └── references/                        # Platform-specific rules
            ├── ios_clean_arch.md              # iOS audit rules (Swift/UIKit/SwiftUI)
            ├── android_clean_arch.md          # Android audit rules (Kotlin/Jetpack)
            └── flutter_clean_arch.md          # Flutter audit rules (Dart/BLoC/Riverpod)
```

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
