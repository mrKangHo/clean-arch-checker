# Flutter Clean Architecture Audit Checklist

Flutter 프로젝트(Dart 기반)에서 클린 아키텍처 및 의존성 규칙 준수 여부를 검사하는 세부 항목입니다.

---

## 1. Domain Layer 점검 (Pure Dart)

Domain 레이어(`lib/features/<feature>/domain` 또는 `lib/domain`)는 Flutter 프레임워크나 외부 데이터 소스 라이브러리와 완전히 연동 해제된 Pure Dart 코드로 구성되어야 합니다.

### 금지 사항 (Violations)
* **Flutter UI 라이브러리 임포트**:
  - `import 'package:flutter/material.dart';`
  - `import 'package:flutter/widgets.dart';`
  - `import 'package:flutter/cupertino.dart';`
* **네트워크 / 로컬 DB / 외부 서비스 라이브러리**:
  - `import 'package:dio/dio.dart';`
  - `import 'package:http/http.dart';`
  - `import 'package:hive/hive.dart';`
  - `import 'package:isar/isar.dart';`
  - `import 'package:shared_preferences/shared_preferences.dart';`
* **Data / Presentation 참조**: `data/` 또는 `presentation/` 폴더 내의 코드 참조

### 허용 사항
* Pure Dart 패키지 (`dart:async`, `dart:core`, `package:equatable`, `package:fpdart` / `package:dartz`)

### 올바른 코드 구조 예시
```dart
// domain/entities/user.dart
import 'package:equatable/equatable.dart';

class User extends Equatable {
  final String id;
  final String name;
  final String email;

  const User({
    required this.id,
    required this.name,
    required this.email,
  });

  @override
  List<Object?> get props => [id, name, email];
}

// domain/repositories/user_repository.dart
abstract class UserRepository {
  Future<User> getUser(String id);
}

// domain/usecases/get_user_usecase.dart
class GetUserUseCase {
  final UserRepository repository;

  GetUserUseCase(this.repository);

  Future<User> call(String id) async {
    return await repository.getUser(id);
  }
}
```

---

## 2. Data Layer 점검

Data 레이어(`lib/features/<feature>/data` 또는 `lib/data`)는 Data Sources(Remote API, Local Storage)와 모델, 그리고 Domain Repository의 구현체를 포함합니다.

### 주요 점검 항목
1. **Model (DTO) 분리**: `UserModel`이 `User` Entity를 상속받거나, `toEntity()` 변환 메서드를 제공하는가?
2. **JSON Serializer 위치**: `fromJson` / `toJson` 또는 `factory UserModel.fromJson()`은 Data 레이어의 Model에만 위치해야 함.
3. **RepositoryImpl 구체화**: Domain의 `UserRepository` 인터페이스를 `implements` 하여 네트워크/로컬 DB 요청 수행.

```dart
// data/models/user_model.dart
import '../../domain/entities/user.dart';

class UserModel {
  final String userId;
  final String fullName;
  final String emailAddress;

  UserModel({
    required this.userId,
    required this.fullName,
    required this.emailAddress,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      userId: json['user_id'] as String,
      fullName: json['full_name'] as String,
      emailAddress: json['email_address'] as String,
    );
  }

  User toEntity() {
    return User(
      id: userId,
      name: fullName,
      email: emailAddress,
    );
  }
}

// data/repositories/user_repository_impl.dart
import '../../domain/entities/user.dart';
import '../../domain/repositories/user_repository.dart';
import '../datasources/user_remote_datasource.dart';

class UserRepositoryImpl implements UserRepository {
  final UserRemoteDataSource remoteDataSource;

  UserRepositoryImpl({required this.remoteDataSource});

  @override
  Future<User> getUser(String id) async {
    final model = await remoteDataSource.getUserModel(id);
    return model.toEntity();
  }
}
```

---

## 3. Presentation Layer 점검

Presentation 레이어(`lib/presentation` 또는 `lib/features/<feature>/presentation`)는 UI (Widgets) 및 상태 관리(BLoC / Cubit / Riverpod / Provider)를 포함합니다.

### 주요 점검 항목
1. **Data DataSource / Model 직참조 금지**: Widget이나 BLoC/Notifier가 `UserModel`이나 `UserRemoteDataSource`에 직접 접근하지 않는가?
2. **UseCase 의존성 주입**: BLoC 또는 Riverpod Notifier가 `GetUserUseCase` 또는 `UserRepository` 인터페이스에만 의존하는가?
