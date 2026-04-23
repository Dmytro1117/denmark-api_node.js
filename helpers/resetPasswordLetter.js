const { BASE_FRONTEND_URL } = process.env;

const resetPasswordLetter = ({ email, resetToken }) => {
  const resetUrl = `${BASE_FRONTEND_URL}/reset-password/${resetToken}`;
  const currentYear = new Date().getFullYear();
  const uniqueId = Date.now(); // Захист від групування Gmail

  const LOGO =
    "https://res.cloudinary.com/dpvqbbgkd/image/upload/v1776852671/Denmark/logo/logo_dtmgmx.png";

  const LOGO_BG =
    "https://res.cloudinary.com/dpvqbbgkd/image/upload/e_colorize:80,co_black,o_30/v1776852671/Denmark/logo/logo_dtmgmx.png";

  return {
    to: email,
    subject: "Password Reset Request — Denmark",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    .btn:hover { 
      background-color: #3b82f6 !important; 
      color: #ffffff !important;
      border-color: #3b82f6 !important;
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#111111; font-family: 'Inter', Arial, sans-serif; border-collapse: collapse">

  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#111111; border-collapse: collapse">
    <tr>
      <td align="center" style="padding: 0; margin: 0;">
        
        <!-- Main Card -->
        <!-- Ми використовуємо background-image через inline style і атрибут background для кращої підтримки -->
        <table width="600" border="0" cellspacing="0" cellpadding="0" 
               background="${LOGO_BG}" 
               style="max-width:600px; background-color:#18181b; background-image: url('${LOGO_BG}'); background-repeat: no-repeat; background-position: 170% 50%; background-size: 450px; border-radius:4px; border: 1px solid #27272a; overflow:hidden;">
          <tr>
            <td>
              <!-- Контентна таблиця з прозорим фоном поверх бекграунду -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding:60px 40px;">
                    
                    <!-- Small Logo -->
                    <img src="${LOGO}" alt="Denmark" width="80" style="border-radius:4px; margin-bottom:30px; display:block;">
                    
                    <h1 style="color:#ffffff; font-size:42px; line-height:1.1; font-weight:800; margin:0 0 20px; letter-spacing:-1px;">
                      RESET <br> PASSWORD
                    </h1>
                    
                    <p style="color:#a1a1aa; font-size:16px; line-height:1.6; max-width:320px; margin:0 0 40px;">
                      We received a request to reset your password. Click the button below to secure your access.
                    </p>

                    <div>
                      <a href="${resetUrl}" class="btn" style="
                        display:inline-block;
                        border: 1px solid #3b82f6;
                        color: #3b82f6;
                        padding: 16px 40px;
                        text-decoration: none;
                        font-weight: 700;
                        font-size: 13px;
                        text-transform: uppercase;
                        letter-spacing: 2px;
                        border-radius: 4px;
                      ">
                        Change Password
                      </a>
                    </div>

                    <div style="margin-top:60px;">

                      <div style="width:40px; height:2px; background-color:#3b82f6; margin-bottom:20px;"></div>

                        <p style="color:#52525b; font-size:12px; text-transform:uppercase; letter-spacing:1px; margin:0;">
                          System Link Support: <br>
                          <a href="${resetUrl}" style="color:#3b82f6; text-decoration:none; word-break:break-all; font-size:11px;">${resetUrl}</a>
                        </p>
                        
                        <p style="color:#52525b; font-size:13px; line-height:20px;  margin-bottom:55px;">
                          If you didn't request this change, you can safely ignore this email. <br>
                          This link will expire shortly.
                        </p>
                        
                        <p style="color:#52525b; font-size:12px; text-transform:uppercase; letter-spacing:1px; margin:0;">
                          Security Protocol: ISO: DNK encryption <br>
                          © ${currentYear} DENMARK.
                        </p>
                         <div style="display:none; opacity:0; font-size:0;">${uniqueId}</div>
                    </div>

                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`,
  };
};

module.exports = { resetPasswordLetter };
