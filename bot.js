// Bot de Telegram 
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');

const token = '8161361190:AAGzcDgyOW6FO9JWKyPeZLNLnUQA-sdXTcU';
const bot = new TelegramBot(token, { polling: true });

// Sistema de rangos para 100s y 200s - USANDO URLS DE INTERNET
const rangosSalones = {
  '100-199': {
    edificio: 'Ramon Rivera Lara',
    piso: 1,
    descripcionBase: 'se encuentra en el primer piso, Edificio Ramon Rivera Lara',
    foto: 'https://drive.google.com/uc?export=download&id=1Pk6wZzc-HQPqCM9kpFsraFEwSTuqkvhB' // mapaB
  },
  '200-299': {
    edificio: 'Ramon Rivera Lara', 
    piso: 2,
    descripcionBase: 'está en el segundo piso, Edificio Ramon Rivera Lara',
    foto: 'https://drive.google.com/uc?export=download&id=1Pk6wZzc-HQPqCM9kpFsraFEwSTuqkvhB' // mapaB
  }
};

// Salones manuales para 300s y 400s - USANDO URLS DE INTERNET
const salonesManuales = {
  '301': {
    descripcion: 'El salón 301 se ubica en el segundo piso del edificio de ciencias básicas. Es un laboratorio especializado.',
    foto: 'https://drive.google.com/uc?export=download&id=1Kyc_ddB8R2XKk_k4VE2WzWSxa6WVRdJl' // mapaM
  },
  '302': {
    descripcion: 'El salón 302 está en el segundo piso del edificio de ciencias básicas. Sala de conferencias.',
    foto: 'https://drive.google.com/uc?export=download&id=1Kyc_ddB8R2XKk_k4VE2WzWSxa6WVRdJl' // mapaM
  },
  '303': {
    descripcion: 'El salón 303 se ubica en el segundo piso del edificio de ciencias básicas. Es un laboratorio especializado.',
    foto: 'https://drive.google.com/uc?export=download&id=1Kyc_ddB8R2XKk_k4VE2WzWSxa6WVRdJl' // mapaM
  },
  '304': {
    descripcion: 'El salón 304 está en el segundo piso del edificio de ciencias básicas. Sala de conferencias.',
    foto: 'https://drive.google.com/uc?export=download&id=1Kyc_ddB8R2XKk_k4VE2WzWSxa6WVRdJl' // mapaM
  },
  '305': {
    descripcion: 'El salón 305 se ubica en el segundo piso del edificio de ciencias básicas. Es un laboratorio especializado.',
    foto: 'https://drive.google.com/uc?export=download&id=1Kyc_ddB8R2XKk_k4VE2WzWSxa6WVRdJl' // mapaM
  },
  '306': {
    descripcion: 'El salón 306 está en el segundo piso del edificio de ciencias básicas. Sala de conferencias.',
    foto: 'https://drive.google.com/uc?export=download&id=1Kyc_ddB8R2XKk_k4VE2WzWSxa6WVRdJl' // mapaM
  },
  '401': {
    descripcion: 'El salón 401 se encuentra en el segundo piso, Edificio P arriba de la sala audiovisual',
    foto: 'https://drive.google.com/uc?export=download&id=1uQIJCsWrsbP9pp4HDrMVUNnNzzN3UB8s' // mapaP
  },
  '402': {
    descripcion: 'El salón 402 se encuentra en el segundo piso, Edificio P arriba de la sala audiovisual',
    foto: 'https://drive.google.com/uc?export=download&id=1uQIJCsWrsbP9pp4HDrMVUNnNzzN3UB8s' // mapaP
  },
  '403': {
    descripcion: 'El salón 403 se encuentra en el segundo piso, Edificio P arriba de la sala audiovisual',
    foto: 'https://drive.google.com/uc?export=download&id=1uQIJCsWrsbP9pp4HDrMVUNnNzzN3UB8s' // mapaP
  },
  '404': {
    descripcion: 'El salón 404 se encuentra en el segundo piso, Edificio P arriba de la sala audiovisual',
    foto: 'https://drive.google.com/uc?export=download&id=1uQIJCsWrsbP9pp4HDrMVUNnNzzN3UB8s' // mapaP
  },
  '405': {
    descripcion: 'El salón 405 se encuentra en el segundo piso, Edificio P arriba de la sala audiovisual',
    foto: 'https://drive.google.com/uc?export=download&id=1uQIJCsWrsbP9pp4HDrMVUNnNzzN3UB8s' // mapaP
  }
};

// Función para generar descripción automática para rangos
function generarDescripcionAutomatica(numeroSalon, rangoInfo) {
  return `El salón ${numeroSalon} ${rangoInfo.descripcionBase}.`;
}

// Función para determinar a qué rango pertenece un salón
function obtenerSalon(numeroSalon) {
  const num = parseInt(numeroSalon);
  
  // Primero verificar si es un salón manual (300s y 400s)
  if (salonesManuales[numeroSalon]) {
    return salonesManuales[numeroSalon];
  }
  
  // Luego verificar rangos automáticos (100s y 200s)
  if (num >= 100 && num <= 199) {
    const rangoInfo = rangosSalones['100-199'];
    return {
      descripcion: generarDescripcionAutomatica(numeroSalon, rangoInfo),
      foto: rangoInfo.foto
    };
  }
  
  if (num >= 200 && num <= 299) {
    const rangoInfo = rangosSalones['200-299'];
    return {
      descripcion: generarDescripcionAutomatica(numeroSalon, rangoInfo),
      foto: rangoInfo.foto
    };
  }
  
  return null; // No encontrado
}

// Comando /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  
  const salonesManualesLista = Object.keys(salonesManuales).join(', ');
  
  const mensajeBienvenida = `
¡Hola! 👋 Soy tu asistente para ubicación de salones.

🏫 *Sistema de búsqueda:*
• *100-199:* Automático - Primer piso
• *200-299:* Automático - Segundo piso  
• *300s y 400s:* Manual - Especializados

📋 *Salones disponibles:*
100-199 (automático)
200-299 (automático)
${salonesManualesLista}

_Escribe el número del salón que buscas:_
  `;
  bot.sendMessage(chatId, mensajeBienvenida, { parse_mode: 'Markdown' });
});

// Comando /info para explicar el sistema
bot.onText(/\/info/, (msg) => {
  const chatId = msg.chat.id;
  const mensajeInfo = `
ℹ️ *Sistema de salones ITCJ*

🔧 *Rangos automáticos:*
• *100-199:* Cualquier número en este rango funciona automáticamente
• *200-299:* Cualquier número en este rango funciona automáticamente

🎯 *Salones manuales:*
• 301, 302, 303, 304, 305, 306
• 401, 402, 403, 404, 405

💡 *Ejemplos:*
• \`101\`, \`150\`, \`199\` → Respuesta automática
• \`201\`, \`250\`, \`299\` → Respuesta automática  
• \`305\`, \`401\` → Respuesta manual específica
  `;
  bot.sendMessage(chatId, mensajeInfo, { parse_mode: 'Markdown' });
});

// Manejar mensajes - USANDO URLS DE INTERNET
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const textoRecibido = msg.text.trim();

  if (textoRecibido.startsWith('/')) return;

  const salon = obtenerSalon(textoRecibido);
  
  if (salon) {
    try {
      // Enviar descripción
      await bot.sendMessage(chatId, salon.descripcion);
      
      // Enviar foto desde URL de internet
      await bot.sendPhoto(chatId, salon.foto, {
        caption: `📍 Mapa del salón ${textoRecibido}`
      });
      
    } catch (error) {
      console.error('Error al enviar foto:', error);
      await bot.sendMessage(chatId, '✅ Descripción enviada. ❌ Error al cargar el mapa desde Google Drive.');
    }
  } else {
    // Mensaje de error informativo
    let mensajeError = `❌ Salón "${textoRecibido}" no encontrado.\n\n`;
    
    const num = parseInt(textoRecibido);
    if (!isNaN(num)) {
      if (num < 100 || num > 499) {
        mensajeError += '💡 Los salones van del 100 al 499.';
      } else if (num >= 300 && num <= 399) {
        mensajeError += '💡 Los salones 300s deben agregarse manualmente.';
      } else if (num >= 400 && num <= 499) {
        mensajeError += '💡 Los salones 400s deben agregarse manualmente.';
      }
    }
    
    const salonesManualesLista = Object.keys(salonesManuales).join(', ');
    mensajeError += `\n\n📋 *Salones manuales disponibles:*\n${salonesManualesLista}`;
    mensajeError += `\n\n🔧 *Rangos automáticos:* 100-199, 200-299`;
    
    bot.sendMessage(chatId, mensajeError, { parse_mode: 'Markdown' });
  }
});

console.log('🤖 Bot de salones ITCJ - Usando mapas desde Google Drive');
