# Android Clean Architecture Audit Checklist

Android 프로젝트(Kotlin 기반)에서 클린 아키텍처 및 의존성 규칙 준수 여부를 검사하는 세부 항목입니다.

---

## 1. Domain Module / Layer 점검 (Pure Kotlin)

Domain 모듈 또는 패키지(`domain/` 또는 `:core:domain`)는 프레임워크와 완전히 독립된 Pure Kotlin 코드여야 합니다.

### 금지 사항 (Violations)
* **Android SDK 임포트**: `import android.content.*`, `import android.os.*`, `import androidx.appcompat.*`, `import androidx.compose.*`
* **네트워크/DB 프레임워크**: `import retrofit2.*`, `import androidx.room.*`, `import okhttp3.*`
* **Data / Presentation 참조**: `import com.example.data.*`, `import com.example.presentation.*`

### 허용 사항
* Kotlin Standard Library (`kotlinx.coroutines.flow.Flow`, `kotlinx.coroutines.CoroutineDispatcher` 등 비동기 처리)
* `javax.inject` / `jakarta.inject` (인터페이스 어노테이션 정도의 최소 추상화)

### 올바른 코드 구조 예시
```kotlin
// domain/model/User.kt
data class User(
    val id: String,
    val name: String,
    val email: String
)

// domain/repository/UserRepository.kt
interface UserRepository {
    fun getUser(id: String): Flow<User>
}

// domain/usecase/GetUserUseCase.kt
class GetUserUseCase @Inject constructor(
    private val userRepository: UserRepository
) {
    operator fun invoke(id: String): Flow<User> {
        return userRepository.getUser(id)
    }
}
```

---

## 2. Data Module / Layer 점검

Data 모듈(`data/` 또는 `:core:data`)은 Remote API (Retrofit) 및 Local Storage (Room, DataStore)를 통해 데이터를 가져오고 Domain Entity로 변환합니다.

### 주요 점검 항목
1. **Domain 인터페이스 구현**: Data 모듈의 `UserRepositoryImpl`이 Domain 모듈의 `UserRepository`를 구현하는가?
2. **DTO / Entity Mapper 분리**:
   - Remote `UserResponse` 또는 Room `UserEntity`와 Domain `User` 모델이 분리되어 있는가?
   - Mapper 함수 (`UserResponse.toDomain()`)를 통해 결합을 해제했는가?

```kotlin
// data/remote/model/UserResponse.kt
@Serializable
data class UserResponse(
    @SerialName("user_id") val userId: String,
    @SerialName("full_name") val fullName: String,
    val email: String
)

fun UserResponse.toDomain(): User = User(
    id = userId,
    name = fullName,
    email = email
)

// data/repository/UserRepositoryImpl.kt
class UserRepositoryImpl @Inject constructor(
    private val api: UserApi
) : UserRepository {
    override fun getUser(id: String): Flow<User> = flow {
        val response = api.getUser(id)
        emit(response.toDomain())
    }
}
```

---

## 3. Presentation Module / Layer 점검

Presentation 모듈(`UI`, `ViewModel`, `Activity`, `Composable`) 점검 항목입니다.

### 주요 점검 항목
1. **Presentation -> Data 결합 금지**: ViewModel이 `UserResponse`나 `UserDao`를 직참조하지 않는가?
2. **UseCase 주입 사용**: ViewModel이 `GetUserUseCase`를 주입받아 단일 책임 원칙(SRP)을 지키는가?
