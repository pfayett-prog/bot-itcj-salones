// Bot de Telegram 
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.BOT_TOKEN || '8161361190:AAGzcDgyOW6FO9JWKyPeZLNLnUQA-sdXTcU';
const bot = new TelegramBot(token, { polling: true });

// Sistema de rangos para 100s y 200s
const rangosSalones = {
  '100-199': {
    edificio: 'Ramon Rivera Lara',
    piso: 1,
    descripcionBase: 'se encuentra en el primer piso, Edificio Ramon Rivera Lara',
    foto: 'https://i.postimg.cc/9XbRM9wZ/mapaB.jpg'
  },
  '200-299': {
    edificio: 'Ramon Rivera Lara', 
    piso: 2,
    descripcionBase: 'está en el segundo piso, Edificio Ramon Rivera Lara',
    foto: 'https://i.postimg.cc/9XbRM9wZ/mapaB.jpg'
  }
};

// Salones manuales para 300s y 400s
const salonesManuales = {
  '301': {
    descripcion: 'El salón 301 se ubica en el segundo piso del edificio de ciencias básicas.',
    foto: 'https://i.postimg.cc/Wp8F3Zqr/mapaM.jpg'
  },
  '302': {
    descripcion: 'El salón 302 está en el segundo piso del edificio de ciencias básicas.',
    foto: 'https://i.postimg.cc/Wp8F3Zqr/mapaM.jpg'
  },
  '303': {
    descripcion: 'El salón 303 se ubica en el segundo piso del edificio de ciencias básicas.',
    foto: 'https://i.postimg.cc/Wp8F3Zqr/mapaM.jpg'
  },
  '304': {
    descripcion: 'El salón 304 está en el segundo piso del edificio de ciencias básicas.',
    foto: 'https://i.postimg.cc/Wp8F3Zqr/mapaM.jpg'
  }, 
  '305': {
    descripcion: 'El salón 305 se ubica en el segundo piso del edificio de ciencias básicas.',
    foto: 'https://i.postimg.cc/Wp8F3Zqr/mapaM.jpg'
  },
  '306': {
    descripcion: 'El salón 306 está en el segundo piso del edificio de ciencias básicas.',
    foto: 'https://i.postimg.cc/Wp8F3Zqr/mapaM.jpg'
  }, 
  '401': {
    descripcion: 'El salón 401 se encuentra en el segundo piso, Edificio P arriba de la sala audiovisual',
    foto: 'https://i.postimg.cc/Vsgr6t0q/mapaP.jpg'
  },
  '402': {
    descripcion: 'El salón 402 se encuentra en el segundo piso, Edificio P arriba de la sala audiovisual',
    foto: 'https://i.postimg.cc/Vsgr6t0q/mapaP.jpg'
  }, 
  '403': {
    descripcion: 'El salón 403 se encuentra en el segundo piso, Edificio P arriba de la sala audiovisual',
    foto: 'https://i.postimg.cc/Vsgr6t0q/mapaP.jpg'
  },
  '404': {
    descripcion: 'El salón 404 se encuentra en el segundo piso, Edificio P arriba de la sala audiovisual',
    foto: 'https://i.postimg.cc/Vsgr6t0q/mapaP.jpg'
  },
  '405': {
    descripcion: 'El salón 405 se encuentra en el segundo piso, Edificio P arriba de la sala audiovisual',
    foto: 'https://i.postimg.cc/Vsgr6t0q/mapaP.jpg'
  }
};

// Función para generar descripción automática para rangos
function generarDescripcionAutomatica(numeroSalon, rangoInfo) {
  return `El salón ${numeroSalon} ${rangoInfo.descripcionBase}.`;
}

// Función para determinar a qué rango pertenece un salón
function obtenerSalon(numeroSalon) {
  const num = parseInt(numeroSalon);
  
  if (salonesManuales[numeroSalon]) {
    return salonesManuales[numeroSalon];
  }
  
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
  
  return null;
}

// Comando /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  
  const salones100s = '100-199 (automático)';
  const salones200s = '200-299 (automático)';
  const salonesManualesLista = Object.keys(salonesManuales).join(', ');
  
  const mensajeBienvenida = `
¡Hola! 👋 Soy tu asistente para ubicación de salones.

🏫 *Sistema de búsqueda:*
• *100-199:* Automático - Primer piso
• *200-299:* Automático - Segundo piso  
• *300s y 400s:* Manual - Especializados

📋 *Salones disponibles:*
${salones100s}
${salones200s}
${salonesManualesLista}

_Escribe el número del salón que buscas:_
  `;
  bot.sendMessage(chatId, mensajeBienvenida, { parse_mode: 'Markdown' });
});

// Manejar mensajes - VERSIÓN CON DEBUGGING
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const textoRecibido = msg.text.trim();

  if (textoRecibido.startsWith('/')) return;

  console.log(`🔍 Usuario busca: "${textoRecibido}"`);

  const salon = obtenerSalon(textoRecibido);
  
  if (salon) {
    try {
      console.log(`✅ Salón encontrado:`, salon);
      
      // Enviar descripción
      await bot.sendMessage(chatId, salon.descripcion);
      
      // ✅ INTENTAR ENVIAR FOTO CON MÁS DETALLES DE DEBUG
      if (salon.foto && salon.foto.startsWith('http')) {
        console.log(`🖼️ Intentando enviar foto: ${salon.foto}`);
        
        try {
          await bot.sendPhoto(chatId, salon.foto, {
            caption: `📍 Mapa del salón ${textoRecibido}`
          });
          console.log(`✅ Foto enviada exitosamente para salón ${textoRecibido}`);
        } catch (photoError) {
          console.error(`❌ Error enviando foto:`, photoError);
          await bot.sendMessage(chatId, 
            `❌ Error al cargar el mapa del salón ${textoRecibido}\n` +
            `Error: ${photoError.message}`, {
            parse_mode: 'Markdown'
          });
        }
      } else {
        console.log(`❌ URL de foto inválida: ${salon.foto}`);
        await bot.sendMessage(chatId, 
          `📍 Mapa del salón ${textoRecibido}:\n(URL de imagen no válida)`, {
          parse_mode: 'Markdown'
        });
      }
      
    } catch (error) {
      console.error('💥 Error general:', error);
      await bot.sendMessage(chatId, '✅ Descripción enviada. ❌ Error al cargar el mapa.');
    }
  } else {
    console.log(`❌ Salón no encontrado: "${textoRecibido}"`);
    
    let mensajeError = `❌ Salón "${textoRecibido}" no encontrado.\n\n`;
    
    const num = parseInt(textoRecibido);
    if (!isNaN(num)) {
      if (num < 100 || num > 499) {
        mensajeError += '💡 Los salones van del 100 al 499.';
      } else if (num >= 300 && num <= 399) {
        mensajeError += '💡 Los salones 300s deben agregarse manualmente. Usa /info para más detalles.';
      } else if (num >= 400 && num <= 499) {
        mensajeError += '💡 Los salones 400s deben agregarse manualmente. Usa /info para más detalles.';
      }
    }
    
    const salonesManualesLista = Object.keys(salonesManuales).join(', ');
    mensajeError += `\n\n📋 *Salones manuales disponibles:*\n${salonesManualesLista}`;
    mensajeError += `\n\n🔧 *Rangos automáticos:* 100-199, 200-299`;
    
    bot.sendMessage(chatId, mensajeError, { parse_mode: 'Markdown' });
  }
});

// Manejo de errores
bot.on('error', (error) => {
  console.log('🔴 Error del bot:', error);
});

bot.on('polling_error', (error) => {
  console.log('🔴 Polling error:', error);
});

console.log('🤖 Bot de salones ITCJ - Iniciado con debugging');
