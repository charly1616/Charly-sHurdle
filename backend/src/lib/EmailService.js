import nodemailer from "nodemailer"


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, // o 587
    secure: true, // true para 465, false para 587
    auth: {
      user: "dummycharlyb@gmail.com",
      pass: "crfg tdpy pluj rcno",
    },
  });

export const sendSuggestionEmail = async (suggestion) => {
  const mailOptions = {
    from: 'dummycharlyb@gmail.com',
    to: "dummycharlyb@gmail.com",
    subject: 'Nueva sugerencia recibida — EcoPulse',
    text: `Has recibido una nueva sugerencia:\n\n${suggestion}`,
    
    html: `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
          
          <div style="
            background-color: white;
            padding: 24px;
            border-radius: 10px;
            max-width: 600px;
            margin: auto;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          ">
            
            <h2 style="color: #2c3e50; margin-top: 0;">
              💡 Nueva sugerencia recibida
            </h2>

            <p style="color: #555; font-size: 15px;">
              Un usuario ha enviado la siguiente sugerencia para el proyecto <strong>EcoPulse</strong>:
            </p>

            <div style="
              background-color: #f8f9fa;
              border-left: 4px solid #ff5741;
              padding: 16px;
              border-radius: 6px;
              margin: 20px 0;
              font-size: 15px;
              color: #333;
              white-space: pre-line;
            ">
              ${suggestion}
            </div>

            <p style="font-size: 12px; color: #888;">
              Este mensaje fue generado automáticamente por el sistema de sugerencias.
            </p>

          </div>

        </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado exitosamente:', info.response);
    return info;
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    throw error;
  }
};
