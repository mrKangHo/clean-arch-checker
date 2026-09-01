---
name: clean-arch-checker
description: >-
  Use this skill when auditing, inspecting, or refactoring iOS (Swift), Android (Kotlin),
  or Flutter (Dart) projects to check compliance with Clean Architecture principles,
  dependency rules (Domain <- Data / Presentation), layer boundaries, and interface abstractions.
---

# Clean Architecture Checker Skill

이 스킬은 iOS(Swift), Android(Kotlin), Flutter(Dart) 프로젝트에서 **클린 아키텍처(Clean Architecture)** 및 **의존성 역전 원칙(DIP)**이 올바르게 준수되고 있는지 체계적으로 점검하고 리팩토링 방안을 제안합니다.

---

## 핵심 원칙 (The Dependency Rule)

모든 의존성은 **바깥쪽 레이어(Data, Presentation)에서 안쪽 레이어(Domain)로만** 향해야 합니다.
`Domain` 레이어는 비즈니스 로직의 최상위 계층으로, 외부 프레임워크, UI, DB, 네트워크 라이브러리에 의존해서는 안 됩니다.

```text
[ Presentation Layer ]  ───> ( UseCase / Entity ) <───  [ Data Layer ]
  (UI, View, ViewModel)               ▲                    (RepositoryImpl, DTO)
                                      │
                              [ Domain Layer ]
                          (Entities, UseCases, Protocol/Interface)
```

---

## 점검 절차 (Audit Workflow)

### 1단계: 프로젝트 플랫폼 및 구조 파악
프로젝트 탐색 도구(`find_by_name`, `list_dir`)를 통해 플랫폼과 아키텍처 구조를 식별합니다.

* **iOS**: `.xcodeproj`, `Package.swift`, `Podfile` 확인 (VIPER, Clean Swift, MVVM-C 계층 구조)
* **Android**: `build.gradle`, `build.gradle.kts` 확인 (멀티 모듈 구조 `:core:domain`, `:core:data` 또는 패키지 구조 `domain/`, `data/`, `presentation/`)
* **Flutter**: `pubspec.yaml` 확인 (`lib/features/.../domain`, `data`, `presentation` 또는 `lib/domain`, `data`, `presentation`)

### 2단계: 레이어별 의존성 검사 (Import Checking)

에이전트는 `grep_search`를 사용하여 **Domain 레이어**에 금지된 외부 라이브러리나 다른 레이어 참조가 없는지 점검합니다.

#### 금지된 의존성 패턴 (Violation Patterns)

| 레이어 | 금지된 임포트/의존성 | 이유 |
| :--- | :--- | :--- |
| **Domain** | **iOS**: `UIKit`, `SwiftUI`, `CoreData`, `Alamofire`, `Moya`, `Data` 패키지/폴더<br>**Android**: `android.*`, `androidx.*` (일부 pure annotations 제외), `retrofit2.*`, `androidx.room.*`, `Data` 패키지<br>**Flutter**: `package:flutter/material.dart`, `package:flutter/widgets.dart`, `package:dio`, `package:hive`, `package:isar`, `data/` 폴더 | Domain은 순수 언어(Swift, Kotlin, Dart)로만 작성되어야 함 |
| **Presentation** | `Data` 레이어 직참조 (예: `UserRepositoryImpl`, `UserDto`, `UserLocalDataSource`) | Presentation은 Domain의 `UseCase` 또는 `Repository Protocol/Interface`만 바라봐야 함 |
| **Data** | `Presentation` 레이어 참조 (`ViewModel`, `Widget`, `Activity` 등) | 역방향 의존성 위반 |

### 3단계: 추상화 및 데이터 흐름 검사

1. **Repository 인터페이스 위치**:
   - `Repository` 인터페이스(Protocol/Abstract Class)가 **Domain** 레이어에 정의되어 있는가?
   - `RepositoryImpl` 구현체가 **Data** 레이어에 위치하는가?
2. **모델 분리 (Entity vs DTO vs UI Model)**:
   - Domain의 `Entity`에 JSON 직렬화 관련 코드(`Codable`, `@Serializable`, `fromJson`/`toJson`)나 DB 어노테이션(`@Entity`, `@PrimaryKey`)이 섞여있지 않은가?
   - Data 레이어에서 Domain Entity로 변환하는 **Mapper**가 올바르게 존재 하는가?
3. **Presentation <-> Domain 결합도**:
   - `ViewModel` / `BLoC`이 Data 레이어의 DTO를 직접 반환받거나 파라미터로 사용하지 않는가?

---

## 플랫폼별 세부 가이드 참조

검사 대상 프로젝트에 따라 아래 가이드 문서를 참조하여 세부 점검을 수행합니다.

* [iOS 클린 아키텍처 점검 가이드](./references/ios_clean_arch.md)
* [Android 클린 아키텍처 점검 가이드](./references/android_clean_arch.md)
* [Flutter 클린 아키텍처 점검 가이드](./references/flutter_clean_arch.md)

---

## 점검 결과 리포트 출력 형식

점검 완료 후 다음 항목이 포함된 결과 리포트를 사용자에게 제공합니다:

1. **준수 점수 (Architecture Health Score)**: 100점 만점 기준 평가
2. **위반 내역 (Violations List)**:
   - 파일 경로 및 해당 라인 (`file:///path/to/file#L12-L15`)
   - 위반 유형 (예: *Domain 레이어의 UI 프레임워크 의존성*, *Presentation에서 Data DTO 직접 참조*)
   - 심각도 (Critical / Major / Minor)
3. **리팩토링 가이드 (Refactoring Code Examples)**:
   - Before (위반 코드) vs After (개선 코드) 예시 제시
