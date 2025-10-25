# Coomds

schema:drop

Qué hace:
Este comando elimina todas las tablas de la base de datos definida en tu DataSource de TypeORM. Es útil cuando querés empezar desde cero, por ejemplo:

Antes de ejecutar nuevas migraciones.

Durante pruebas de desarrollo para limpiar la base de datos.

Ejemplo de uso:

pnpm run schema:drop -d src/config/data-source.ts


Nota importante:

Esto elimina todos los datos, no solo las tablas vacías.

Nunca usar en producción a menos que realmente quieras borrar toda la base de datos.

2️⃣ schema:sync

Qué hace:
Este comando sincroniza tus entidades TypeORM con la base de datos. Es decir:

Crea tablas nuevas si no existen.

Agrega columnas que hayan sido definidas en tus entidades pero no estén en la tabla.

Realiza actualizaciones de esquema automáticamente según tus entidades.

Ejemplo de uso:

pnpm run schema:sync -d src/config/data-source.ts


Nota importante:

Solo recomendado para entornos de desarrollo, no para producción.

Para producción es mejor usar migraciones, porque schema:sync puede modificar tablas y perder datos si no se usa con cuidado.

💡 Resumen rápido:

Comando	Acción principal	Uso recomendado
schema:drop	Borra todas las tablas de la base de datos	Desarrollo / pruebas
schema:sync	Actualiza la base de datos según tus entidades	Desarrollo, no producción