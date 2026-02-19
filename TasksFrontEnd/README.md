#  Task Management -- README

##  Pasos para ejecutar el proyecto



### 1.Configurar la base de datos

Editar el archivo `appsettings.json` del backend:

``` json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=TaskDb;Trusted_Connection=True;TrustServerCertificate=True"
}
```

### 2. Ejecutar migraciones (Package Manager Console)

Abrir la consola de NuGet en Visual Studio y ejecutar:

``` powershell
Update-Database
```

### 3. Ejecutar el backend

``` bash
dotnet run
```

Swagger:

    https://localhost:5001/swagger

### 4. Ejecutar el frontend (Angular)

``` bash
cd client
npm install
ng serve
```

Abrir en:

    puerto indicado por la consola.
------------------------------------------------------------------------

##  Decisiones técnicas y tecnologías usadas

### Backend

-   .NET 8 + Entity Framework Core
-   Patrón Repository + Service
-   Uso de DTOs para desacoplar entidades
-   SQL Server con soporte para JSON:
    -   ISJSON
    -   JSON_VALUE
    -   OPENJSON
    -   JSON_MODIFY
-   Columna NVARCHAR(MAX) para metadata flexible

### Frontend

-   Angular 16
-   Angular Material
-   Reactive Forms
-   HttpClient

###  Modelado

-   Relación User → Tasks (1:N)
-   Filtro por estado de tareas
-   Cambio de estado en línea
-   Selección de usuario desde listado

###  Scripts SQL 




INSERT INTO dbo.Users (Username, Email, PhoneNumber)
VALUES 
('jdoe', 'jdoe@email.com', 3001234567),
('asmith', 'asmith@email.com', 3019876543),
('mgarcia', 'mgarcia@email.com', 3025558899),
('lrodriguez', 'lrodriguez@email.com', 3154447788),
('admin', 'admin@email.com', 3201112233);

ALTER TABLE Tasks
ADD AdditionalData NVARCHAR(MAX);

ALTER TABLE Tasks
ADD CONSTRAINT CK_Tasks_AdditionalData_ISJSON
CHECK (AdditionalData IS NULL OR ISJSON(AdditionalData) = 1);


INSERT INTO Tasks (Title,Description,DueDate, Status, UserId, AdditionalData)
VALUES
(
  'Implement login',
  'Implementation for security',
  '05/05/2026',
  'Pending',
  1,
  '{
     "priority": "High",
     "estimatedEndDate": "2026-03-01",
     "tags": ["backend", "security"],
     "metadata": {
        "createdBy": "Alejandro",
        "storyPoints": 5
     }
   }'
);




SELECT
  Title,
  JSON_VALUE(AdditionalData, '$.priority') AS Priority
FROM Tasks;


SELECT
  Title,
  JSON_VALUE(AdditionalData, '$.estimatedEndDate') AS EstimatedEndDate
FROM Tasks;



SELECT
  t.Title,
  tag.value AS Tag
FROM Tasks t
CROSS APPLY OPENJSON(t.AdditionalData, '$.tags') AS tag;


SELECT
  Title,
  JSON_QUERY(AdditionalData, '$.metadata') AS Metadata
FROM Tasks;


