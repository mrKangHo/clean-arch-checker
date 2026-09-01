# React Native & TypeScript Clean Architecture Audit Checklist

React Native 프로젝트(TypeScript/JavaScript 기반)에서 클린 아키텍처 및 의존성 규칙 준수 여부를 검사하는 세부 항목입니다.

---

## 1. Domain Layer 점검 (Pure TypeScript)

Domain 레이어(`src/domain/` 또는 `src/features/<feature>/domain/`)는 React Native 프레임워크나 외부 데이터 라이브러리와 완전히 독립된 Pure TypeScript 코드로 구성되어야 합니다.

### 금지 사항 (Violations)
* **React / React Native 프레임워크 임포트**:
  - `import React from 'react';`
  - `import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';`
  - `import { useNavigation } from '@react-navigation/native';`
* **네트워크 / 로컬 DB / 외부 서비스 라이브러리**:
  - `import axios from 'axios';`
  - `import AsyncStorage from '@react-native-async-storage/async-storage';`
  - `import { MMKV } from 'react-native-mmkv';`
  - `import Realm from 'realm';`
* **Data / Presentation 참조**: `data/` 또는 `presentation/`, `ui/` 폴더 내의 코드 참조

### 허용 사항
* Pure TypeScript / JavaScript 언어 기능 (`Date`, `Promise`, `Math`, 순수 유틸리티 타입)
* 순수 비즈니스 인터페이스 (TypeScript `interface`, `type`)

### 올바른 코드 구조 예시
```typescript
// domain/entities/User.ts
export interface User {
  id: string;
  name: string;
  email: string;
}

// domain/repositories/UserRepository.ts
import { User } from '../entities/User';

export interface UserRepository {
  getUser(id: string): Promise<User>;
}

// domain/usecases/GetUserUseCase.ts
import { User } from '../entities/User';
import { UserRepository } from '../repositories/UserRepository';

export class GetUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string): Promise<User> {
    return this.userRepository.getUser(id);
  }
}
```

---

## 2. Data Layer 점검

Data 레이어(`src/data/` 또는 `src/features/<feature>/data/`)는 API 통신(Axios/Fetch), 로컬 DB(AsyncStorage/MMKV), DTO 모델 및 Domain Repository 구현체(`Impl`)를 포함합니다.

### 주요 점검 항목
1. **DTO / Entity Mapper 분리**: `UserDTO` (API JSON 구조)와 Domain `User` 모델이 분리되어 있는가?
2. **Mapper 존재 여부**: `toDomain(dto: UserDTO): User` 변환 함수가 작성되어 있는가?
3. **RepositoryImpl 구체화**: Domain의 `UserRepository` 인터페이스를 `implements` 하여 작성했는가?

```typescript
// data/dtos/UserDTO.ts
export interface UserDTO {
  user_id: string;
  full_name: string;
  email_address: string;
}

export const mapUserDtoToEntity = (dto: UserDTO): User => ({
  id: dto.user_id,
  name: dto.full_name,
  email: dto.email_address,
});

// data/repositories/UserRepositoryImpl.ts
import { UserRepository } from '../../domain/repositories/UserRepository';
import { User } from '../../domain/entities/User';
import { UserDTO, mapUserDtoToEntity } from '../dtos/UserDTO';
import { UserApiDataSource } from '../datasources/UserApiDataSource';

export class UserRepositoryImpl implements UserRepository {
  constructor(private apiDataSource: UserApiDataSource) {}

  async getUser(id: string): Promise<User> {
    const dto: UserDTO = await this.apiDataSource.fetchUserDto(id);
    return mapUserDtoToEntity(dto);
  }
}
```

---

## 3. Presentation Layer 점검

Presentation 레이어(`src/presentation/`, `src/screens/`, `src/components/`, `src/hooks/`)는 UI Component(React Native JSX) 및 Custom Hooks(ViewModel / Presenter)를 포함합니다.

### 주요 점검 항목
1. **Data DataSource / DTO 직참조 금지**: Screen이나 Custom Hook에서 `UserDTO`나 `UserApiDataSource`에 직접 접근하지 않는가?
2. **UseCase / Repository 의존성 주입**: Custom Hook(예: `useUserViewModel`)이 `GetUserUseCase` 또는 `UserRepository` 인터페이스에만 의존하는가?
