const fs = require('fs');
const axios = require('axios');

const TOPIC = process.env.TOPIC || "tdv_upt"

const sendNotification = async (title="Alerta", message) => (
    new Promise(async (resolve, reject) => {
        console.log(`[NTFY] Enviando notificacion`, { title, message })
        const url = `https://ntfy.sh/${TOPIC}`;
        try {
            const response = await axios.post(url, message, {
                headers: {
                    'Title': title,
                    'Priority': 'high' // Opcional: puedes cambiar la prioridad
                }
            })
            resolve()
        } catch (error) {
            reject(error)
        }
    })
)
  

const uploadFile = async (filePath) => (
    new Promise(async (resolve, reject) => {
        const url = `https://ntfy.sh/${TOPIC}`;

        const fecha = new Date().toString()

        const fileName = "screenshot.png"; // Nombre del archivo a enviar

        try {
            const fileStream = fs.createReadStream(filePath); // Leer el archivo local

            const response = await axios.post(url, fileStream, {
            headers: {
                'Title': fecha,
                'Filename': fileName, // Encabezado personalizado
                'Content-Type': 'application/octet-stream' // Tipo de contenido del archivo
            }
            });
            resolve()

            console.log('Archivo enviado:', response.data);
        } catch (error) {
            reject()
            console.error('Error al enviar el archivo:', error.response ? error.response.data : error.message);
        }
    })
)

module.exports = { uploadFile, sendNotification }