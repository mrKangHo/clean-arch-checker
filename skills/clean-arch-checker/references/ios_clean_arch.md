# iOS Clean Architecture Audit Checklist

iOS 프로젝트(Swift 기반)에서 클린 아키텍처 준수 여부를 검사할 때 확인하는 세부 항목 및 스캔 절차입니다.

---

## 1. Domain Layer 점검 (Pure Swift)

Domain 레이어는 독립된 모듈이나 패키지/폴더(`Domain/`)에 위치해야 하며, 순수 Swift 언어 기능으로만 구현되어야 합니다.

### 금지 사항 (Violations)
* **UI 프레임워크 임포트**: `import UIKit`, `import SwiftUI`, `import AppKit`
* **네트워크/DB 프레임워크 임포트**: `import Alamofire`, `import Moya`, `import CoreData`, `import RealmSwift`, `import Firebase`
* **Data / Presentation 참조**: `Data` 레이어의 구조체/클래스, `ViewModel`, `ViewController` 참조

### 허용 사항
* 순수 Swift 표준 라이브러리 (`Foundation` 일부 - `URL`, `Date`, `UUID` 등 비즈니스 값에 필요한 최소한)
* 비동기 처리: `async/await`, 순수 Swift Concurrency / Combine (UI 결합이 없는 데이터 스트림)

### 올바른 코드 구조 예시
```swift
// Domain/Entities/User.swift
public struct User: Equatable {
    public let id: String
    public let name: String
    public let email: String
}

// Domain/Repositories/UserRepositoryProtocol.swift
public protocol UserRepositoryProtocol {
    func fetchUser(id: String) async throws -> User
}

// Domain/UseCases/GetUserUseCase.swift
public struct GetUserUseCase {
    private let repository: UserRepositoryProtocol
    
    public init(repository: UserRepositoryProtocol) {
        self.repository = repository
    }
    
    public func execute(id: String) async throws -> User {
        return try await repository.fetchUser(id: id)
    }
}
```

---

## 2. Data Layer 점검

Data 레이어는 Domain의 `RepositoryProtocol`을 구현(Conform)하고, Remote API 요청이나 DB 처리를 담당합니다.

### 주요 점검 항목
1. **DTO 분리**: Network JSON 응답용 구조체(DTO, `Codable`)와 Domain `Entity`가 분리되어 있는가?
2. **Mapper 존재 여부**: DTO -> Entity 변환 메서드가 작성되어 있는가?
3. **Domain Protocol 준수**: Data의 Repository 구현체는 Domain에 정의된 프로토콜을 따른다.

```swift
// Data/DTOs/UserDTO.swift
struct UserDTO: Codable {
    let user_id: String
    let full_name: String
    let email_address: String
    
    func toDomain() -> User {
        return User(id: user_id, name: full_name, email: email_address)
    }
}

// Data/Repositories/UserRepositoryImpl.swift
final class UserRepositoryImpl: UserRepositoryProtocol {
    private let remoteDataSource: UserRemoteDataSourceProtocol
    
    init(remoteDataSource: UserRemoteDataSourceProtocol) {
        self.remoteDataSource = remoteDataSource
    }
    
    func fetchUser(id: String) async throws -> User {
        let dto = try await remoteDataSource.getUserDTO(id: id)
        return dto.toDomain()
    }
}
```

---

## 3. Presentation Layer 점검

Presentation 레이어는 UI 및 ViewModel/Presenter/Coordinator로 구성됩니다.

### 주요 점검 항목
1. **Direct Data Dependency 금지**: `UserRepositoryImpl`이나 `UserDTO`를 ViewModel에서 직접 인스턴스화하거나 타입으로 사용하지 않는가?
2. **UseCase 주입**: ViewModel은 `GetUserUseCase` 또는 `UserRepositoryProtocol`을 외부에서 주입받는가?
