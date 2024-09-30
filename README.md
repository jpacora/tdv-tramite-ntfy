# tdv-tramite-ntfy
 
Este proyecto utiliza Puppeteer para automatizar el proceso de inicio de sesión en el sistema de mesa de partes de la Universidad Privada de Tacna. Incluye la captura de CAPTCHA y la notificación del estado de trámite.


## Características

- **Automatización de Login**: Inicia sesión automáticamente utilizando las credenciales del estudiante.
- **Manejo de CAPTCHA**: Intercepta y completa el CAPTCHA automáticamente si es necesario.
- **Captura de Resultados**: Extrae información específica de la página después de un inicio de sesión exitoso.
- **Notificaciones**: Envía notificaciones con el contenido obtenido.
- **Captura de Pantallas**: Genera capturas de pantalla de la información relevante para su revisión posterior.

## Requisitos

- **Node.js**: Asegúrate de tener [Node.js](https://nodejs.org/) instalado en tu sistema.
- **Puppeteer**: Este proyecto utiliza Puppeteer, que se instalará automáticamente con las dependencias.

## Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/jpacora/tdv-tramite-ntfy
   cd tdv-tramite-ntfy
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Configura tus credenciales como variables de entorno:
   - CODIGO: Código universitario
   - PASSWORD: Contraseña
   - ID_TRAMITE: Identificador del trámite que deseas verificar
   - TOPIC: Tópico de ntfy donde se enviará el resultado (tdv_upt)
## Uso

Para ejecutar la automatización, simplemente ejecuta`:

```bash
./bin/automator
```


## Licencia

Este proyecto está licenciado bajo la [Licencia MIT](LICENSE).