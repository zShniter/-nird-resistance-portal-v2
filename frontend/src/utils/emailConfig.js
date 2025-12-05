// src/utils/emailConfig.js
export const emailConfig = {
  serviceID: 'your_service_id',
  templateID: 'your_template_id',
  userID: 'your_user_id',
  
  templates: {
    contact: 'template_contact_nird',
    donate: 'template_donate_nird',
    volunteer: 'template_volunteer_nird',
    info: 'template_info_nird'
  }
};

// Example email template
export const emailTemplates = {
  contact: {
    subject: '📜 Nouveau message de résistance NIRD',
    body: (data) => `
      Un nouveau guerrier gaulois a envoyé un message!
      
      Nom: ${data.name}
      Email: ${data.email}
      Mission: ${data.mission}
      
      Message:
      ${data.message}
      
      Date: ${new Date().toLocaleDateString('fr-FR')}
      
      🛡️ Pour la résistance numérique!
    `
  }
};