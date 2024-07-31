# Backend Technical Test
This repository was created to fulfill the Backend Dev Techincal Test at PT EIGEN TRI MATHEMA.

## Folder Structures
```plaintext
.
├── algorithm        # Answers of the algorithm test in two langages (JavaScript and Python)
│   ├── 1.js
│   ├── 1.py
│   ├── 2.js
│   ├── 2.py
│   ├── 3.js
│   ├── 3.py
│   ├── 4.js
│   └── 4.py
├── database.sql    # MySQL Queries to create table and insert mock-up data
├── library_api     # Library API that created using NestJS
│   |
│   ├── nest-cli.json
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── README.md
│   ├── src
│   │   ├── app.controller.spec.ts
│   │   ├── app.controller.ts
│   │   ├── app.module.ts
│   │   ├── app.service.ts
│   │   ├── library
│   │   │   ├── application
│   │   │   │   ├── controllers
│   │   │   │   │   ├── book.controller.spec.ts
│   │   │   │   │   ├── book.controller.ts
│   │   │   │   │   ├── borrow.controller.spec.ts
│   │   │   │   │   ├── borrow.controller.ts
│   │   │   │   │   ├── member.controller.spec.ts
│   │   │   │   │   └── member.controller.ts
│   │   │   │   └── dto
│   │   │   │       ├── book.dto.ts
│   │   │   │       ├── borrow.dto.ts
│   │   │   │       ├── member.dto.ts
│   │   │   │       └── response.dto.ts
│   │   │   ├── domain
│   │   │   │   ├── entities
│   │   │   │   │   ├── book.entity.ts
│   │   │   │   │   ├── borrow.entity.ts
│   │   │   │   │   └── members.entity.ts
│   │   │   │   └── services
│   │   │   │       ├── book.service.ts
│   │   │   │       ├── borrow.service.spec.ts.old
│   │   │   │       ├── borrow.service.ts
│   │   │   │       └── member.service.ts
│   │   │   ├── infrastructure
│   │   │   │   └── repositories
│   │   │   │       ├── book.repository.ts
│   │   │   │       ├── borrow.repository.ts
│   │   │   │       └── member.repository.ts
│   │   │   └── library.module.ts
│   │   └── main.ts
│   ├── test
│   │   ├── app.e2e-spec.ts
│   │   └── jest-e2e.json
|   ├── .env.example
|   ├── .gitignore
│   ├── tsconfig.build.json
│   └── tsconfig.json
└── readme.md
```

## Database for Library API
### Tables

#### member
| Column          | Type       | Constraints          |
|-----------------|------------|----------------------|
| code            | VARCHAR(30)| NOT NULL PRIMARY KEY |
| name            | VARCHAR(255)| NOT NULL             |
| penalized_until | DATETIME   |                      |

#### book
| Column | Type        | Constraints          |
|--------|-------------|----------------------|
| code   | VARCHAR(30) | NOT NULL PRIMARY KEY |
| title  | VARCHAR(200)| NOT NULL             |
| author | VARCHAR(255)| NOT NULL             |
| stock  | INT         | NOT NULL             |

#### borrow
| Column       | Type        | Constraints                 |
|--------------|-------------|-----------------------------|
| id           | VARCHAR(36) | NOT NULL PRIMARY KEY        |
| member_code  | VARCHAR(30) | NOT NULL FOREIGN KEY        |
| book_code    | VARCHAR(30) | NOT NULL FOREIGN KEY        |
| borrowed_at  | DATETIME    | NOT NULL                    |
| due_at       | DATETIME    | NOT NULL                    |
| returned_at  | DATETIME    | DEFAULT NULL                |
| FOREIGN KEY (member_code) | REFERENCES member(code)      |
| FOREIGN KEY (book_code)   | REFERENCES book(code)        |

### Diagram

```plaintext
+-----------------+              +---------------+              +------------------+
|    member       |              |    borrow     |              |       book       |
+-----------------+              +---------------+              +------------------+
| code (PK)       |-||--------o<-| id (PK)       |->o--------||-| code (PK)        |
| name            |              | member_code   |              | title            |
| penalized_until |              | book_code     |              | author           |
+-----------------+              | borrowed_at   |              | stock            |
                                 | due_at        |              +------------------+
                                 | returned_at   |
                                 +---------------+
```