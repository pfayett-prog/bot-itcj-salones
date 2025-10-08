// Bot de Telegram 
const TelegramBot = require('node-telegram-bot-api');

// Reemplaza 'TU_TOKEN_DE_BOTFATHER' con el token real que recibiste
const token = '8161361190:AAGzcDgyOW6FO9JWKyPeZLNLnUQA-sdXTcU';
const bot = new TelegramBot(token, { polling: true });

// Esta es nuestra "base de datos" simple de salones y ubicaciones.
// ¡Agrega aquí todos los salones que necesites!
const baseDeDatosSalones = {
  '101': 'El salón 101 se encuentra en el primer piso, Edificio Ramon Rivera Lara.',
  '202': 'El salón 202 está en el segundo piso, Edificio Ramon Rivera Lara',
  '305': 'El salón 305 se ubica en el segundo piso del edificio de ciencias basicas.',
  
  // Añade más salones aquí...
  'default': 'Lo siento, no tengo información para ese salón en mi base de datos. Por favor, verifica el número e intenta de nuevo.'
};

// Maneja el comando /start o cuando alguien inicia el bot
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const mensajeBienvenida = `
¡Hola! 👋 Soy tu asistente para ubicación de salones.
Por favor, escribe el *número del salón* que estás buscando (por ejemplo: 101, 202, etc.).
  `;
  // Usamos { parse_mode: 'Markdown' } para que el texto se vea mejor
  bot.sendMessage(chatId, mensajeBienvenida, { parse_mode: 'Markdown' });
});

// Maneja cualquier mensaje de texto que NO sea un comando
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const textoRecibido = msg.text.trim(); // Elimina espacios en blanco

  // Ignora los mensajes que sean comandos (como /start, /help, etc.)
  if (textoRecibido.startsWith('/')) {
    return;
  }

  // Busca el salón en la "base de datos"
  // Usamos el operador [] para buscar por variable. Si no existe, usamos 'default'
  const respuesta = baseDeDatosSalones[textoRecibido] || baseDeDatosSalones['default'];

  // Envía la respuesta al usuario
  bot.sendMessage(chatId, respuesta);
});

console.log('🤖 El bot de salones está funcionando...');