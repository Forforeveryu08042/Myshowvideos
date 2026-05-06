@echo off
echo === Starting Show Videos Backend (Spring Boot 1.5) ===

set JAVA_OPTS=--add-opens java.base/java.lang=ALL-UNNAMED --add-opens java.base/java.lang.reflect=ALL-UNNAMED --add-opens java.base/java.util=ALL-UNNAMED --add-opens java.base/java.lang.invoke=ALL-UNNAMED --add-opens java.base/sun.reflect.annotation=ALL-UNNAMED

cd /d %~dp0scetc-show-videos-dev\scetc-show-videos-mini-api\target
start "show-videos-backend" java %JAVA_OPTS% -jar scetc-show-videos-mini-api-0.0.1-SNAPSHOT.war

echo Backend started on http://127.0.0.1:8080
echo Swagger API docs: http://127.0.0.1:8080/swagger-ui.html
pause
