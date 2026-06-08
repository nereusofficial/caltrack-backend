import nodemailer from "nodemailer";

const createTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

const baseTemplate = (content: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>CalTrack</title>
</head>
<body style="margin:0;padding:0;background-color:#010b16;font-family:'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#010b16;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <div style="border:1px solid rgba(0,180,255,0.3);padding:16px 32px;display:inline-block;background:rgba(0,20,50,0.8);">
                <span style="font-size:28px;font-weight:300;letter-spacing:6px;color:#c8eeff;text-transform:uppercase;">
                  Cal<strong style="font-weight:700;color:#00d4ff;">Track</strong>
                </span>
                <div style="font-family:monospace;font-size:9px;letter-spacing:4px;color:rgba(0,180,255,0.35);margin-top:4px;text-align:center;text-transform:uppercase;">
                  Hunter Nutrition System
                </div>
              </div>
            </td>
          </tr>

          <!-- Main card -->
          <tr>
            <td style="
              background:linear-gradient(180deg,rgba(1,18,38,0.98) 0%,rgba(1,12,28,1) 100%);
              border:1px solid rgba(0,180,255,0.2);
              padding:40px 40px 32px;
              position:relative;
            ">
              <!-- Top glow line -->
              <div style="
                height:1px;
                background:linear-gradient(90deg,transparent,rgba(0,200,255,0.5),transparent);
                margin-bottom:32px;
              "></div>

              ${content}

              <!-- Bottom glow line -->
              <div style="
                height:1px;
                background:linear-gradient(90deg,transparent,rgba(0,200,255,0.2),transparent);
                margin-top:32px;
              "></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:20px;">
              <p style="font-family:monospace;font-size:9px;letter-spacing:3px;color:rgba(0,140,180,0.35);text-transform:uppercase;margin:0;">
                CAL-SYS · SECURE TRANSMISSION · DO NOT REPLY
              </p>
              <p style="font-family:monospace;font-size:8px;letter-spacing:2px;color:rgba(0,100,140,0.25);margin:6px 0 0;">
                © ${new Date().getFullYear()} CalTrack · Hunter Nutrition System v4.1
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const verificationTemplate = (verifyUrl: string) => baseTemplate(`
  <!-- System label -->
  <div style="font-family:monospace;font-size:9px;letter-spacing:4px;color:rgba(0,180,255,0.35);text-transform:uppercase;margin-bottom:8px;">
    SYS-ID: CAL-9821-X // IDENTITY VERIFICATION
  </div>

  <!-- Title -->
  <h1 style="font-size:26px;font-weight:300;letter-spacing:4px;color:#c8eeff;text-transform:uppercase;margin:0 0 4px;">
    Verify Your Account
  </h1>
  <p style="font-family:monospace;font-size:10px;letter-spacing:3px;color:rgba(0,160,220,0.45);text-transform:uppercase;margin:0 0 28px;">
    Hunter Enrollment Protocol
  </p>

  <!-- Divider -->
  <div style="display:flex;align-items:center;gap:8px;margin-bottom:24px;">
    <div style="flex:1;height:1px;background:linear-gradient(90deg,transparent,rgba(0,180,255,0.25));"></div>
    <div style="width:6px;height:6px;border:1px solid rgba(0,200,255,0.5);transform:rotate(45deg);"></div>
    <div style="flex:1;height:1px;background:linear-gradient(270deg,transparent,rgba(0,180,255,0.25));"></div>
  </div>

  <!-- Body text -->
  <p style="font-size:14px;line-height:1.8;color:rgba(160,210,255,0.75);margin:0 0 8px;">
    Welcome, Hunter. Your registration has been received.
  </p>
  <p style="font-size:14px;line-height:1.8;color:rgba(160,210,255,0.75);margin:0 0 32px;">
    Click the button below to verify your identity and activate your CalTrack account. This link expires in <strong style="color:#00c8ff;">1 hour</strong>.
  </p>

  <!-- CTA Button -->
  <div style="text-align:center;margin-bottom:28px;">
    <a href="${verifyUrl}" style="
      display:inline-block;
      padding:14px 40px;
      border:1px solid rgba(0,200,255,0.6);
      background:linear-gradient(180deg,rgba(0,100,200,0.2),rgba(0,60,140,0.15));
      color:#00d4ff;
      font-family:monospace;
      font-size:11px;
      letter-spacing:4px;
      text-transform:uppercase;
      text-decoration:none;
    ">[ Verify Account ]</a>
  </div>

  <!-- Info box -->
  <div style="
    border:1px solid rgba(0,180,255,0.12);
    background:rgba(0,30,70,0.4);
    padding:14px 16px;
  ">
    <p style="font-family:monospace;font-size:9px;letter-spacing:2px;color:rgba(0,160,200,0.45);text-transform:uppercase;margin:0 0 6px;">
      Security Notice
    </p>
    <p style="font-size:12px;color:rgba(120,180,220,0.55);margin:0;line-height:1.6;">
      If you did not create a CalTrack account, you can safely ignore this email. The link will expire automatically.
    </p>
  </div>
`);

const resetPasswordTemplate = (resetUrl: string) => baseTemplate(`
  <!-- System label -->
  <div style="font-family:monospace;font-size:9px;letter-spacing:4px;color:rgba(0,180,255,0.35);text-transform:uppercase;margin-bottom:8px;">
    SYS-ID: CAL-9821-X // CREDENTIAL OVERRIDE
  </div>

  <!-- Title -->
  <h1 style="font-size:26px;font-weight:300;letter-spacing:4px;color:#c8eeff;text-transform:uppercase;margin:0 0 4px;">
    Reset Your Password
  </h1>
  <p style="font-family:monospace;font-size:10px;letter-spacing:3px;color:rgba(0,160,220,0.45);text-transform:uppercase;margin:0 0 28px;">
    Access Key Override Protocol
  </p>

  <!-- Divider -->
  <div style="display:flex;align-items:center;gap:8px;margin-bottom:24px;">
    <div style="flex:1;height:1px;background:linear-gradient(90deg,transparent,rgba(0,180,255,0.25));"></div>
    <div style="width:6px;height:6px;border:1px solid rgba(0,200,255,0.5);transform:rotate(45deg);"></div>
    <div style="flex:1;height:1px;background:linear-gradient(270deg,transparent,rgba(0,180,255,0.25));"></div>
  </div>

  <!-- Body text -->
  <p style="font-size:14px;line-height:1.8;color:rgba(160,210,255,0.75);margin:0 0 8px;">
    A password reset request has been initiated for your CalTrack account.
  </p>
  <p style="font-size:14px;line-height:1.8;color:rgba(160,210,255,0.75);margin:0 0 32px;">
    Click the button below to override your access key. This link expires in <strong style="color:#00c8ff;">1 hour</strong>.
  </p>

  <!-- CTA Button -->
  <div style="text-align:center;margin-bottom:28px;">
    <a href="${resetUrl}" style="
      display:inline-block;
      padding:14px 40px;
      border:1px solid rgba(0,200,255,0.6);
      background:linear-gradient(180deg,rgba(0,100,200,0.2),rgba(0,60,140,0.15));
      color:#00d4ff;
      font-family:monospace;
      font-size:11px;
      letter-spacing:4px;
      text-transform:uppercase;
      text-decoration:none;
    ">[ Override Access Key ]</a>
  </div>

  <!-- Warning box -->
  <div style="
    border:1px solid rgba(255,100,100,0.15);
    background:rgba(80,10,10,0.3);
    padding:14px 16px;
  ">
    <p style="font-family:monospace;font-size:9px;letter-spacing:2px;color:rgba(255,100,100,0.45);text-transform:uppercase;margin:0 0 6px;">
      Security Warning
    </p>
    <p style="font-size:12px;color:rgba(200,140,140,0.55);margin:0;line-height:1.6;">
      If you did not request a password reset, your account may be at risk. Please secure your account immediately.
    </p>
  </div>
`);

export const sendVerificationEmail = async (
  email: string,
  token: string
) => {
  const transporter = createTransporter();
  const verifyUrl = `${process.env.BACKEND_URL}/api/auth/verify/${token}`;

  await transporter.sendMail({
    from: `"CalTrack System" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "[ CalTrack ] Verify Your Hunter Account",
    html: verificationTemplate(verifyUrl),
  });
};

export const sendResetPasswordEmail = async (
  email: string,
  token: string
) => {
  const transporter = createTransporter();
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: `"CalTrack System" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "[ CalTrack ] Access Key Override Request",
    html: resetPasswordTemplate(resetUrl),
  });
};