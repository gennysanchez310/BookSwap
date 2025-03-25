import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit {
  messages: Array<{text: string, isUser: boolean}> = [];
  newMessage: string = '';
  isOpen: boolean = false;
  userName: string = '';
  isFirstInteraction: boolean = true;
  currentTopic: string = '';
  lastUserMessage: string = '';

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.addBotMessage('¡Hola! 👋 Soy Bookie, tu asistente virtual de BookSwap. Me encanta ayudar a los lectores a encontrar y compartir libros. ¿Me podrías decir tu nombre para poder llamarte de manera más personal?');
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      this.addUserMessage(this.newMessage);
      this.lastUserMessage = this.newMessage;
      this.processUserMessage(this.newMessage);
      this.newMessage = '';
    }
  }

  private addUserMessage(text: string): void {
    this.messages.push({ text, isUser: true });
  }

  private addBotMessage(text: string): void {
    this.messages.push({ text, isUser: false });
  }

  private processUserMessage(message: string): void {
    const lowerMessage = message.toLowerCase();
    
    // Primera interacción - Obtener nombre
    if (this.isFirstInteraction) {
      this.userName = message.trim();
      this.isFirstInteraction = false;
      this.addBotMessage(`¡Encantado de conocerte, ${this.userName}! 😊 ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre:\n\n📚 Búsqueda de libros\n🔄 Proceso de intercambio\n📝 Registro y cuenta\n⭐ Calificaciones\n❓ Ayuda y soporte\n\n¿Qué te gustaría saber?`);
      return;
    }

    // Detectar si es una pregunta de seguimiento
    if (this.currentTopic && this.isFollowUpQuestion(lowerMessage)) {
      this.handleFollowUpQuestion(lowerMessage);
      return;
    }

    // Preguntas sobre contraseña y problemas de acceso - Redirección inmediata
    if (this.isPasswordRelatedQuestion(lowerMessage)) {
      this.handlePasswordQuestion();
      return;
    }
    
    // Preguntas sobre registro y cuenta
    if (lowerMessage.includes('registrar') || 
        lowerMessage.includes('crear cuenta') || 
        lowerMessage.includes('registro') ||
        lowerMessage.includes('nueva cuenta')) {
      this.currentTopic = 'registro';
      this.addBotMessage(`¡Claro, ${this.userName}! Te guiaré en el proceso de registro. Es muy sencillo:\n\n1. Haz clic en el ícono de usuario en la esquina superior derecha 👤\n2. Selecciona "Registrarse"\n3. Completa el formulario con tus datos\n4. Verifica tu correo electrónico\n5. ¡Listo! Ya puedes empezar a intercambiar libros 📚\n\n¿En qué paso específico necesitas ayuda?`);
    }
    // Preguntas sobre búsqueda y navegación
    else if (lowerMessage.includes('buscar') || 
             lowerMessage.includes('encontrar') || 
             lowerMessage.includes('libros disponibles') ||
             lowerMessage.includes('catalogo')) {
      this.currentTopic = 'busqueda';
      this.addBotMessage(`¡Me encanta ayudarte a encontrar libros, ${this.userName}! 📚 Hay varias formas de buscar:\n\n1. Usa la barra de búsqueda principal para buscar por título o autor\n2. Utiliza los filtros para buscar por:\n   - Género literario\n   - Condición del libro\n   - Ubicación\n   - Idioma\n3. Explora las categorías populares\n4. Usa etiquetas para encontrar libros similares\n\n¿Qué tipo de libro te gustaría encontrar? 😊`);
    }
    // Preguntas sobre el proceso de intercambio
    else if (lowerMessage.includes('intercambiar') || 
             lowerMessage.includes('cambiar libro') || 
             lowerMessage.includes('intercambio') ||
             lowerMessage.includes('proponer intercambio')) {
      this.currentTopic = 'intercambio';
      this.addBotMessage(`¡Excelente pregunta, ${this.userName}! 🔄 Te explico el proceso de intercambio:\n\n1. Inicia sesión en tu cuenta\n2. Encuentra el libro que te interesa\n3. Haz clic en "Ver Detalles"\n4. Selecciona "Proponer Intercambio"\n5. Elige uno de tus libros para ofrecer\n6. Espera la respuesta del otro usuario\n\nConsejos para un buen intercambio:\n- Asegúrate de que tu libro esté en buen estado\n- Sé claro en tu propuesta\n- Responde rápidamente a las propuestas\n- Mantén una comunicación cordial\n\n¿Tienes alguna duda específica sobre el proceso? 😊`);
    }
    // Preguntas sobre condiciones de los libros
    else if (lowerMessage.includes('condición') || 
             lowerMessage.includes('estado del libro') || 
             lowerMessage.includes('estado') ||
             lowerMessage.includes('calidad')) {
      this.currentTopic = 'condiciones';
      this.addBotMessage(`¡Importante pregunta sobre las condiciones de los libros, ${this.userName}! 📖\n\nLas clasificamos así:\n- Nuevo: Libro sin uso, en su empaque original 📗\n- Como nuevo: Usado pero en excelente estado, sin marcas visibles 📘\n- Buen estado: Signos mínimos de uso, páginas completas 📙\n- Aceptable: Signos visibles de uso pero completo y legible 📕\n- Regular: Deteriorado pero legible, puede tener páginas sueltas 📓\n\nEs importante ser honesto al describir la condición de tu libro. ¿Necesitas ayuda para clasificar algún libro en particular? 😊`);
    }
    // Preguntas sobre políticas y reglas
    else if (lowerMessage.includes('política') || 
             lowerMessage.includes('reglas') || 
             lowerMessage.includes('normas') ||
             lowerMessage.includes('términos')) {
      this.currentTopic = 'politicas';
      this.addBotMessage(`¡Claro, ${this.userName}! 📜 Te explico nuestras políticas principales:\n\n1. Solo se permiten libros completos y legibles\n2. Los usuarios deben ser honestos sobre la condición de sus libros\n3. Los intercambios son definitivos una vez acordados\n4. Está prohibido el intercambio de material inapropiado\n5. Los usuarios son responsables de los gastos de envío\n6. Se debe mantener una comunicación respetuosa\n7. Las calificaciones deben ser objetivas\n\n¿Hay alguna política específica sobre la que necesites más información? 🤔`);
    }
    // Preguntas sobre el estado de intercambios
    else if (lowerMessage.includes('estado') && 
             (lowerMessage.includes('intercambio') || 
              lowerMessage.includes('pedido') || 
              lowerMessage.includes('solicitud'))) {
      this.currentTopic = 'estado';
      this.addBotMessage(`¡Por supuesto, ${this.userName}! 🔍 Te explico cómo ver el estado de tus intercambios:\n\n1. Inicia sesión en tu cuenta\n2. Ve a tu perfil de usuario\n3. Selecciona "Mis Intercambios"\n\nEstados posibles:\n- Pendiente: Esperando respuesta del otro usuario ⏳\n- Aceptado: Intercambio confirmado ✅\n- En proceso: Intercambio en curso 🔄\n- Completado: Intercambio finalizado 🎉\n- Cancelado: Intercambio cancelado ❌\n\n¿Necesitas ayuda para entender algún estado específico? 😊`);
    }
    // Preguntas sobre calificaciones
    else if (lowerMessage.includes('calificar') || 
             lowerMessage.includes('valorar') || 
             lowerMessage.includes('reseña') ||
             lowerMessage.includes('opinión')) {
      this.currentTopic = 'calificaciones';
      this.addBotMessage(`¡Excelente pregunta sobre las calificaciones, ${this.userName}! ⭐\n\nDespués de cada intercambio, puedes:\n1. Calificar al otro usuario (1-5 estrellas)\n2. Dejar una reseña detallada de tu experiencia\n3. Valorar el estado del libro recibido\n4. Comentar sobre la comunicación\n5. Indicar si recomendarías intercambiar con ese usuario\n\nLas calificaciones ayudan a mantener la calidad de nuestra comunidad. ¿Tienes dudas sobre cómo calificar un intercambio? 😊`);
    }
    // Preguntas sobre ayuda y soporte
    else if (lowerMessage.includes('ayuda') || 
             lowerMessage.includes('soporte') || 
             lowerMessage.includes('asistencia') ||
             lowerMessage.includes('contacto') ||
             lowerMessage.includes('preguntas frecuentes') ||
             lowerMessage.includes('guía') ||
             lowerMessage.includes('horario')) {
      this.currentTopic = 'ayuda';
      this.addBotMessage(`¡Por supuesto, ${this.userName}! Te ayudo a encontrar toda la información de ayuda. 😊\n\nPuedes encontrar todo esto en el menú principal de la página:\n\n1. Haz clic en el ícono de menú ☰ en la esquina superior izquierda\n2. Selecciona "Ayuda y Soporte"\n3. Encontrarás:\n   - 📚 Preguntas Frecuentes\n   - 📧 Contacto con soporte\n   - 📖 Guía del usuario\n   - ⏰ Horarios de atención\n\nO si prefieres, puedes acceder directamente a:\n- Preguntas Frecuentes: /faq\n- Contacto: /contact\n- Guía del usuario: /guide\n\nHorario de atención:\n- Lunes a Viernes: 9:00 AM - 6:00 PM\n- Sábados: 10:00 AM - 2:00 PM\n- Domingos: Cerrado\n\n¿Necesitas ayuda para encontrar alguna sección específica? 🤔`);
    }
    // Preguntas sobre cómo funciona
    else if (lowerMessage.includes('cómo') && 
             (lowerMessage.includes('funciona') || 
              lowerMessage.includes('usar') || 
              lowerMessage.includes('utilizar'))) {
      this.currentTopic = 'funcionamiento';
      this.addBotMessage(`¡Me encanta explicarte cómo funciona BookSwap, ${this.userName}! 📚\n\nEs una plataforma donde:\n1. Los usuarios registran los libros que quieren intercambiar\n2. Pueden buscar libros que les interesen\n3. Proponen intercambios con otros usuarios\n4. Acuerdan los detalles del intercambio\n5. Realizan el intercambio y califican la experiencia\n\nBeneficios:\n- Intercambia libros sin costo 💰\n- Conecta con otros lectores 👥\n- Construye una biblioteca personal 📚\n- Ayuda al medio ambiente 🌱\n\n¿Hay algún aspecto específico sobre el funcionamiento que te gustaría conocer? 😊`);
    }
    // Preguntas sobre problemas técnicos
    else if (lowerMessage.includes('problema') || 
             lowerMessage.includes('error') || 
             lowerMessage.includes('falla') ||
             lowerMessage.includes('no funciona')) {
      this.currentTopic = 'problemas';
      this.addBotMessage(`¡No te preocupes, ${this.userName}! Vamos a resolverlo. 🔧\n\nPrimero, intenta estos pasos:\n1. Verifica tu conexión a internet\n2. Actualiza la página\n3. Limpia el caché del navegador\n4. Intenta usar otro navegador\n\nSi el problema persiste:\n- Contacta a soporte desde "Ayuda y Soporte"\n- Envía un correo a support@bookswap.com\n- Incluye capturas de pantalla del error\n\n¿Qué tipo de problema estás experimentando? 🤔`);
    }
    // Preguntas sobre el menú y navegación
    else if (lowerMessage.includes('menú') || 
             lowerMessage.includes('navegar') || 
             lowerMessage.includes('dónde está') ||
             lowerMessage.includes('buscar en la página')) {
      this.currentTopic = 'navegacion';
      this.addBotMessage(`¡Te ayudo a navegar por BookSwap, ${this.userName}! 🗺️\n\nLa página tiene las siguientes secciones principales:\n\n1. Barra superior:\n   - Logo de BookSwap (inicio) 🏠\n   - Barra de búsqueda 🔍\n   - Menú de usuario 👤\n\n2. Menú principal (ícono ☰):\n   - Inicio\n   - Catálogo de libros\n   - Mis intercambios\n   - Mi biblioteca\n   - Ayuda y soporte\n\n3. Secciones principales:\n   - Libros destacados 📚\n   - Categorías populares 📑\n   - Últimos intercambios 🔄\n   - Ofertas especiales 💰\n\n4. Pie de página:\n   - Enlaces importantes\n   - Redes sociales\n   - Contacto\n\n¿Qué sección te gustaría explorar? 😊`);
    }
    // Preguntas sobre el perfil de usuario
    else if (lowerMessage.includes('perfil') || 
             lowerMessage.includes('mi cuenta') || 
             lowerMessage.includes('configuración') ||
             lowerMessage.includes('ajustes')) {
      this.currentTopic = 'perfil';
      this.addBotMessage(`¡Te ayudo con tu perfil, ${this.userName}! 👤\n\nEn tu perfil puedes:\n\n1. Información personal:\n   - Foto de perfil\n   - Nombre y apellido\n   - Ubicación\n   - Biografía\n\n2. Configuración de cuenta:\n   - Cambiar contraseña\n   - Actualizar email\n   - Preferencias de notificaciones\n   - Privacidad\n\n3. Actividad:\n   - Historial de intercambios\n   - Libros en tu biblioteca\n   - Calificaciones recibidas\n   - Reseñas escritas\n\n4. Estadísticas:\n   - Intercambios completados\n   - Calificación promedio\n   - Libros disponibles\n   - Miembros desde\n\n¿Qué aspecto de tu perfil te gustaría modificar? 😊`);
    }
    // Preguntas sobre notificaciones
    else if (lowerMessage.includes('notificación') || 
             lowerMessage.includes('avisos') || 
             lowerMessage.includes('alertas') ||
             lowerMessage.includes('mensajes')) {
      this.currentTopic = 'notificaciones';
      this.addBotMessage(`¡Te explico el sistema de notificaciones, ${this.userName}! 🔔\n\nPuedes recibir notificaciones de:\n\n1. Intercambios:\n   - Nuevas propuestas de intercambio\n   - Aceptación de tus propuestas\n   - Actualizaciones de estado\n   - Intercambios completados\n\n2. Mensajes:\n   - Nuevos mensajes de otros usuarios\n   - Respuestas a tus mensajes\n   - Actualizaciones de conversaciones\n\n3. Sistema:\n   - Actualizaciones de la plataforma\n   - Mantenimientos programados\n   - Cambios en políticas\n\n4. Personalización:\n   - Puedes activar/desactivar cada tipo\n   - Elegir frecuencia de notificaciones\n   - Configurar horarios de silencio\n\n¿Qué tipo de notificaciones te gustaría configurar? 😊`);
    }
    // Preguntas sobre seguridad
    else if (lowerMessage.includes('seguridad') || 
             lowerMessage.includes('privacidad') || 
             lowerMessage.includes('proteger') ||
             lowerMessage.includes('datos')) {
      this.currentTopic = 'seguridad';
      this.addBotMessage(`¡La seguridad es muy importante, ${this.userName}! 🔒\n\nEn BookSwap protegemos tu cuenta con:\n\n1. Autenticación:\n   - Contraseña segura\n   - Verificación en dos pasos\n   - Recuperación de cuenta\n\n2. Privacidad:\n   - Control de información visible\n   - Configuración de perfil\n   - Historial de actividad\n\n3. Protección de datos:\n   - Encriptación de información\n   - Política de privacidad\n   - Términos de uso\n\n4. Seguridad adicional:\n   - Alertas de inicio de sesión\n   - Bloqueo de cuenta\n   - Reporte de actividad sospechosa\n\n¿Qué aspecto de la seguridad te gustaría conocer mejor? 😊`);
    }
    // Preguntas sobre pagos y envíos
    else if (lowerMessage.includes('pago') || 
             lowerMessage.includes('envío') || 
             lowerMessage.includes('costo') ||
             lowerMessage.includes('tarifa')) {
      this.currentTopic = 'pagos';
      this.addBotMessage(`¡Te explico sobre pagos y envíos, ${this.userName}! 💰\n\nInformación importante:\n\n1. Costos:\n   - Los intercambios son gratuitos\n   - Solo se pagan los gastos de envío\n   - Sin comisiones adicionales\n\n2. Envíos:\n   - Acordados entre usuarios\n   - Opciones de envío disponibles\n   - Seguimiento de paquetes\n\n3. Responsabilidades:\n   - Usuario envía: paga su envío\n   - Usuario recibe: paga su envío\n   - Seguro opcional\n\n4. Protección:\n   - Verificación de entrega\n   - Sistema de calificaciones\n   - Resolución de disputas\n\n¿Tienes alguna duda específica sobre pagos o envíos? 😊`);
    }
    // Preguntas sobre la comunidad
    else if (lowerMessage.includes('comunidad') || 
             lowerMessage.includes('usuarios') || 
             lowerMessage.includes('grupos') ||
             lowerMessage.includes('social')) {
      this.currentTopic = 'comunidad';
      this.addBotMessage(`¡BookSwap es una gran comunidad, ${this.userName}! 👥\n\nCaracterísticas de nuestra comunidad:\n\n1. Interacción:\n   - Foros de discusión\n   - Grupos por intereses\n   - Eventos virtuales\n   - Clubes de lectura\n\n2. Compartir:\n   - Recomendaciones\n   - Reseñas de libros\n   - Experiencias\n   - Consejos\n\n3. Beneficios:\n   - Red de lectores\n   - Oportunidades de intercambio\n   - Descuentos especiales\n   - Premios por participación\n\n4. Normas:\n   - Código de conducta\n   - Políticas de moderación\n   - Reporte de usuarios\n   - Sistema de reputación\n\n¿Te gustaría conocer más sobre algún aspecto de la comunidad? 😊`);
    }
    // Saludos
    else if (lowerMessage.includes('hola') || 
             lowerMessage.includes('buenos días') || 
             lowerMessage.includes('buenas') ||
             lowerMessage.includes('buenas noches')) {
      this.addBotMessage(`¡Hola de nuevo, ${this.userName}! 👋 ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre:\n\n📚 Búsqueda de libros\n🔄 Proceso de intercambio\n📝 Registro y cuenta\n⭐ Calificaciones\n❓ Ayuda y soporte\n\n¿Qué te gustaría saber? 😊`);
    }
    // Respuesta por defecto
    else {
      this.addBotMessage(`Hmm... no estoy seguro de entender tu pregunta, ${this.userName}. 🤔\n\n¿Podrías reformularla? O si prefieres, puedes preguntarme sobre:\n\n📚 Búsqueda de libros\n🔄 Proceso de intercambio\n📝 Registro y cuenta\n⭐ Calificaciones\n❓ Ayuda y soporte\n\n¿Qué te gustaría saber? 😊`);
    }
  }

  private isFollowUpQuestion(message: string): boolean {
    const followUpKeywords = ['y', 'también', 'además', 'más', 'otro', 'otra', 'siguiente', 'después', 'luego'];
    return followUpKeywords.some(keyword => message.includes(keyword));
  }

  private handleFollowUpQuestion(message: string): void {
    switch (this.currentTopic) {
      case 'registro':
        this.addBotMessage(`¿Necesitas ayuda con algún paso específico del registro, ${this.userName}? 😊`);
        break;
      case 'busqueda':
        this.addBotMessage(`¿Qué tipo de libro te gustaría encontrar, ${this.userName}? 📚`);
        break;
      case 'intercambio':
        this.addBotMessage(`¿Tienes alguna otra duda sobre el proceso de intercambio, ${this.userName}? 🔄`);
        break;
      case 'condiciones':
        this.addBotMessage(`¿Necesitas ayuda para clasificar algún libro en particular, ${this.userName}? 📖`);
        break;
      case 'politicas':
        this.addBotMessage(`¿Hay alguna otra política sobre la que necesites información, ${this.userName}? 📜`);
        break;
      case 'estado':
        this.addBotMessage(`¿Necesitas ayuda con algún estado específico de tus intercambios, ${this.userName}? 🔍`);
        break;
      case 'calificaciones':
        this.addBotMessage(`¿Tienes alguna otra duda sobre las calificaciones, ${this.userName}? ⭐`);
        break;
      case 'ayuda':
        this.addBotMessage(`¿En qué más puedo ayudarte, ${this.userName}? 😊`);
        break;
      case 'funcionamiento':
        this.addBotMessage(`¿Hay algún otro aspecto de BookSwap que te gustaría conocer, ${this.userName}? 📚`);
        break;
      case 'problemas':
        this.addBotMessage(`¿Necesitas ayuda con algún otro problema técnico, ${this.userName}? 🔧`);
        break;
    }
  }

  private isPasswordRelatedQuestion(message: string): boolean {
    const passwordKeywords = [
      'contraseña', 'password', 'clave', 'acceso', 'login', 'entrar',
      'olvidé', 'olvido', 'recuperar', 'recuperación', 'resetear',
      'no puedo entrar', 'no puedo acceder', 'problemas para acceder',
      'cambiar contraseña', 'cambiar clave', 'restablecer contraseña',
      'restablecer clave', 'cómo cambio mi contraseña', 'cómo cambio mi clave',
      'cómo recupero mi contraseña', 'cómo recupero mi clave',
      'perdí mi contraseña', 'perdí mi clave', 'no recuerdo mi contraseña',
      'no recuerdo mi clave', 'ayuda con contraseña', 'ayuda con clave',
      'problemas de contraseña', 'problemas de clave', 'error de contraseña',
      'error de clave', 'inicio de sesión', 'sesión', 'login'
    ];

    return passwordKeywords.some(keyword => message.includes(keyword));
  }

  private handlePasswordQuestion(): void {
    this.addBotMessage(`Entiendo que tienes problemas con tu contraseña, ${this.userName}. 🔐 No te preocupes, te ayudaré a resolverlo.\n\nPara tu seguridad, te redirigiré automáticamente a nuestro chat de soporte donde podrás recibir ayuda personalizada para recuperar o cambiar tu contraseña...`);
    
    setTimeout(() => {
      this.router.navigate(['/contact'], { 
        queryParams: { 
          issue: 'password-recovery',
          source: 'chatbot'
        }
      });
    }, 2000);
  }
} 