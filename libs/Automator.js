const puppeteer = require('puppeteer');
const { uploadFile, sendNotification } = require('./ntfy');

class Automator {
    // Propiedades privadas
    #codigo;
    #password;
    #idTramite;
    #browser;
    #page;
    #ELEMENT_SELECTOR = "#modalGeneral_Contenido > div.modal-body > div:nth-child(9) > div > div > div > div > h5";
    #logueado = false

    estado = null

    constructor(codigo, password, idTramite) {
        this.#codigo = codigo;
        this.#password = password;
        this.#idTramite = idTramite
    }

    // Método público para inicializar la automatización
    async init() {
        this.#browser = await puppeteer.launch({ headless: true, defaultViewport: null });
        this.#page = await this.#browser.newPage();
        await this.#setupInterceptors();
    }

    // Método público para iniciar sesión
    async login() {
        return new Promise(async (resolve, reject) => {
            await this.#page.goto('https://net.upt.edu.pe/tdv/weblogin/login.php');
            await this.#page.type('#inputEstudianteCodigo', this.#codigo);
            await this.#page.evaluate(password => {
                const contraseniaInput = document.querySelector('#inputEstudianteContrasenia');
                contraseniaInput.value = password;
            }, this.#password);
            await this.#waitFor(250);
            await this.#clickIngresar();
            // setup Wartcher
            const intervalo = setInterval(() => {
                // verificamos si estálogueado
                if(this.#logueado === true) {
                    resolve()
                    clearInterval(intervalo)
                }
                //
            }, 200)
            //resolve()
        })
    }

    // Método privado para configurar los interceptores de solicitudes y respuestas
    async #setupInterceptors() {
        await this.#page.setRequestInterception(true);

        this.#page.on('request', request => {
            request.continue();
        });

        this.#page.on('response', async response => {
            const url = response.url();
            if (url.includes('tdv/layer/layerUsuario/layerLogin.php')) {
                await this.#handleLoginResponse(response);
            }
        });
    }

    // Método privado para manejar la respuesta de login
    async #handleLoginResponse(response) {
        const { items: responseBody } = await response.json();
        if (responseBody.error) {
            if (responseBody.mensaje[0] === 'No coincide el código del captcha') {
                console.log("Error captcha");
                await this.#waitFor(1000);
                await this.#page.click('body > div.swal2-container.swal2-center.swal2-backdrop-show > div > div.swal2-actions > button.swal2-confirm.swal2-styled');
                await this.#waitFor(1000);
                await this.#clickIngresar();
            }
        } else {
            const { data } = responseBody;
            if (data.intCaptcha) {
                console.log('Interceptado CAPTCHA (respuesta)')
                await this.#llenarCaptcha(data.intCaptcha);
            } else if (data.bolUsuarioValidado === true) {
                await this.#handleSuccessfulLogin();
            }
        }
    }

    // Método privado para llenar el captcha
    async #llenarCaptcha(captcha) {
        await this.#page.evaluate(captcha => {
            const captchaInput = document.querySelector('#inputEstudianteCodigoImagen');
            captchaInput.value = captcha;
        }, captcha);
    }

    // Método privado para hacer clic en el botón de ingresar
    async #clickIngresar() {
        await this.#page.click('#formLoginEstudiante > div.row.mt-3 > div.col-7.col-md-8.text-center > button');
    }

    // Método privado para esperar un número específico de milisegundos
    async #waitFor(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Método privado para manejar el login exitoso
    async #handleSuccessfulLogin() {
        console.log("Esperando por el boton....")
        await this.#page.waitForNavigation({waitUntil: 'networkidle2'});
        await this.#page.click(`#buttonExternoTramite_Informacion_${this.#idTramite}`);
        await this.#waitFor(1500);
        await this.#page.waitForSelector(this.#ELEMENT_SELECTOR, { visible: true });

        await this.#page.evaluate(elementSelector => {
            const element = document.querySelector(elementSelector);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, this.#ELEMENT_SELECTOR);

        await this.#waitFor(1000);
        const textoContenido = await this.#page.evaluate(() => {
            const elemento = document.querySelector('#modalGeneral_Contenido > div.modal-body > div:nth-child(8) > div:nth-child(2) > div > div');
            return elemento ? elemento.innerText : null;
        });
        this.estado = textoContenido
        this.#logueado = true
        
        //await this.#page.screenshot({ path: 'screenshot.png', fullPage: true, captureBeyondViewport: true });
        await this.#browser.close();
    }

    async enviarNotificacion() {
        await sendNotification(new Date().toString(), this.estado);
    }
}

module.exports = Automator