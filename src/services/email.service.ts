import nodemailer from "nodemailer";

const createTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

const baseTemplate = (sysLabel: string, content: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>CalTrack</title>
</head>
<body style="margin:0;padding:0;background-color:#010b16;font-family:'Courier New',monospace;">

  <!-- Background grid overlay (fake with repeating border) -->
  <table width="100%" cellpadding="0" cellspacing="0"
    style="background-color:#010b16;background-image:linear-gradient(rgba(0,120,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,120,255,0.04) 1px,transparent 1px);background-size:32px 32px;padding:48px 16px;min-height:100vh;">
    <tr>
      <td align="center" valign="top">

        <!-- Outer ambient glow wrapper -->
        <table width="520" cellpadding="0" cellspacing="0"
          style="max-width:520px;width:100%;">

          <!-- SYS-AUTH tick marks -->
          <tr>
            <td align="center" style="padding-bottom:16px;">
              <span style="color:rgba(0,200,255,0.5);font-size:10px;letter-spacing:1px;">| |</span>
              <span style="color:rgba(0,200,255,0.4);font-size:9px;letter-spacing:6px;text-transform:uppercase;padding:0 10px;">${sysLabel}</span>
              <span style="color:rgba(0,200,255,0.5);font-size:10px;letter-spacing:1px;">| |</span>
            </td>
          </tr>

          <!-- Panel with corner brackets -->
          <tr>
            <td style="position:relative;padding:2px;">

              <!-- Main panel -->
              <table width="100%" cellpadding="0" cellspacing="0"
                style="background:linear-gradient(180deg,rgba(1,18,42,0.98) 0%,rgba(1,10,26,1) 100%);border:1px solid rgba(0,180,255,0.25);box-shadow:0 0 60px rgba(0,100,255,0.15),inset 0 0 60px rgba(0,0,30,0.6);">

                <!-- Top glow line -->
                <tr>
                  <td style="height:1px;background:linear-gradient(90deg,transparent,rgba(0,200,255,0.6),transparent);font-size:0;line-height:0;">&nbsp;</td>
                </tr>

                <!-- Corner TL -->
                <tr>
                  <td style="padding:0;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="16" style="border-left:2px solid #00c8ff;border-top:2px solid #00c8ff;height:16px;font-size:0;">&nbsp;</td>
                        <td>&nbsp;</td>
                        <td width="16" style="border-right:2px solid #00c8ff;border-top:2px solid #00c8ff;height:16px;font-size:0;">&nbsp;</td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding:24px 40px 32px;">

                    <!-- System ID -->
                    <p style="font-family:'Courier New',monospace;font-size:9px;letter-spacing:4px;color:rgba(0,180,255,0.35);text-transform:uppercase;text-align:center;margin:0 0 8px;">
                      SYSTEM ID: CAL-9821-X // ${sysLabel}
                    </p>

                    <!-- Logo -->
                    <h1 style="font-size:36px;font-weight:300;letter-spacing:8px;color:#c8eeff;text-transform:uppercase;text-align:center;margin:0 0 4px;text-shadow:0 0 30px rgba(0,200,255,0.5);">
                      CAL<strong style="font-weight:700;color:#00d4ff;">TRACK</strong>
                    </h1>

                    <!-- Subtitle -->
                    <p style="font-family:'Courier New',monospace;font-size:9px;letter-spacing:5px;color:rgba(0,160,220,0.45);text-transform:uppercase;text-align:center;margin:0 0 24px;">
                      Hunter Nutrition System
                    </p>

                    <!-- Rank pips -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                      <tr>
                        <td align="center">
                          <span style="display:inline-block;width:28px;height:4px;background:rgba(0,200,255,0.6);margin:0 3px;box-shadow:0 0 6px rgba(0,200,255,0.5);"></span>
                          <span style="display:inline-block;width:28px;height:4px;background:rgba(0,200,255,0.6);margin:0 3px;box-shadow:0 0 6px rgba(0,200,255,0.5);"></span>
                          <span style="display:inline-block;width:28px;height:4px;background:rgba(0,200,255,0.6);margin:0 3px;box-shadow:0 0 6px rgba(0,200,255,0.5);"></span>
                          <span style="display:inline-block;width:28px;height:4px;background:rgba(0,100,160,0.3);margin:0 3px;"></span>
                          <span style="display:inline-block;width:28px;height:4px;background:rgba(0,100,160,0.3);margin:0 3px;"></span>
                        </td>
                      </tr>
                    </table>

                    <!-- Divider with diamond -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                      <tr>
                        <td style="height:1px;background:linear-gradient(90deg,transparent,rgba(0,180,255,0.3));font-size:0;">&nbsp;</td>
                        <td width="24" align="center">
                          <span style="display:inline-block;width:7px;height:7px;border:1px solid rgba(0,200,255,0.6);transform:rotate(45deg);background:transparent;"></span>
                        </td>
                        <td style="height:1px;background:linear-gradient(270deg,transparent,rgba(0,180,255,0.3));font-size:0;">&nbsp;</td>
                      </tr>
                    </table>

                    ${content}

                    <!-- Bottom divider -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">
                      <tr>
                        <td style="height:1px;background:linear-gradient(90deg,transparent,rgba(0,180,255,0.15),transparent);font-size:0;">&nbsp;</td>
                      </tr>
                    </table>

                    <!-- Footer status bar -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">
                      <tr>
                        <td>
                          <span style="font-family:'Courier New',monospace;font-size:8px;letter-spacing:3px;color:rgba(0,140,180,0.3);text-transform:uppercase;">
                            CAL-SYS // SECURE TRANSMISSION
                          </span>
                        </td>
                        <td align="right">
                          <span style="display:inline-block;width:5px;height:5px;border-radius:50%;background:#00c8ff;box-shadow:0 0 5px rgba(0,200,255,0.6);margin-left:3px;"></span>
                          <span style="display:inline-block;width:5px;height:5px;border-radius:50%;background:rgba(0,180,255,0.15);margin-left:3px;"></span>
                          <span style="display:inline-block;width:5px;height:5px;border-radius:50%;background:rgba(0,180,255,0.15);margin-left:3px;"></span>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>

                <!-- Corner BL BR -->
                <tr>
                  <td style="padding:0;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="16" style="border-left:2px solid #00c8ff;border-bottom:2px solid #00c8ff;height:16px;font-size:0;">&nbsp;</td>
                        <td>&nbsp;</td>
                        <td width="16" style="border-right:2px solid #00c8ff;border-bottom:2px solid #00c8ff;height:16px;font-size:0;">&nbsp;</td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:20px;">
              <p style="font-family:'Courier New',monospace;font-size:8px;letter-spacing:3px;color:rgba(0,120,160,0.3);text-transform:uppercase;margin:0;">
                © ${new Date().getFullYear()} CALTRACK · DO NOT REPLY TO THIS EMAIL
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

const verificationContent = (verifyUrl: string) => `
  <!-- Field label style -->
  <p style="font-family:'Courier New',monospace;font-size:9px;letter-spacing:3px;color:rgba(0,180,255,0.45);text-transform:uppercase;margin:0 0 4px;">
    // IDENTITY VERIFICATION
  </p>

  <p style="font-size:14px;line-height:1.9;color:rgba(160,210,255,0.75);margin:0 0 6px;">
    Welcome, Hunter. Your enrollment request has been received by the system.
  </p>
  <p style="font-size:14px;line-height:1.9;color:rgba(160,210,255,0.75);margin:0 0 28px;">
    Click below to verify your Hunter ID and activate your CalTrack account.
    This verification link expires in <span style="color:#00c8ff;font-weight:600;">1 hour</span>.
  </p>

  <!-- Input-style info box -->
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
    <tr>
      <td style="
        border:1px solid rgba(0,140,220,0.2);
        border-bottom:1px solid rgba(0,180,255,0.4);
        background:rgba(0,20,50,0.5);
        padding:12px 16px;
      ">
        <p style="font-family:'Courier New',monospace;font-size:8px;letter-spacing:3px;color:rgba(0,180,255,0.35);text-transform:uppercase;margin:0 0 4px;">
          01 // VERIFICATION TARGET
        </p>
        <p style="font-size:13px;color:#d8f0ff;margin:0;">
          Your CalTrack Hunter Account
        </p>
      </td>
    </tr>
  </table>

  <!-- CTA Button matching [ ENTER SYSTEM ] style -->
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
    <tr>
      <td align="center">
        <a href="${verifyUrl}" style="
          display:block;
          padding:16px;
          border:1px solid rgba(0,200,255,0.5);
          background:linear-gradient(180deg,rgba(0,100,200,0.15),rgba(0,60,140,0.1));
          color:#7dd8ff;
          font-family:'Courier New',monospace;
          font-size:11px;
          letter-spacing:6px;
          text-transform:uppercase;
          text-decoration:none;
          text-align:center;
        ">[ &nbsp;VERIFY HUNTER ID&nbsp; ]</a>
      </td>
    </tr>
  </table>

  <!-- Chevrons like in the UI -->
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
    <tr>
      <td style="height:1px;background:linear-gradient(90deg,transparent,rgba(0,180,255,0.2));font-size:0;">&nbsp;</td>
      <td width="60" align="center" style="padding:0 8px;">
        <span style="font-size:10px;color:rgba(0,200,255,0.4);letter-spacing:4px;">&#8964; &#8964; &#8964;</span>
      </td>
      <td style="height:1px;background:linear-gradient(270deg,transparent,rgba(0,180,255,0.2));font-size:0;">&nbsp;</td>
    </tr>
    <tr>
      <td style="height:1px;background:linear-gradient(90deg,transparent,rgba(0,180,255,0.1));font-size:0;">&nbsp;</td>
      <td width="60" align="center" style="padding:0 8px;">
        <span style="font-size:10px;color:rgba(0,200,255,0.2);letter-spacing:4px;">&#8964; &#8964; &#8964;</span>
      </td>
      <td style="height:1px;background:linear-gradient(270deg,transparent,rgba(0,180,255,0.1));font-size:0;">&nbsp;</td>
    </tr>
  </table>

  <!-- Security notice box -->
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td style="
        border:1px solid rgba(0,180,255,0.1);
        background:rgba(0,15,40,0.5);
        padding:12px 16px;
      ">
        <p style="font-family:'Courier New',monospace;font-size:8px;letter-spacing:3px;color:rgba(0,160,200,0.4);text-transform:uppercase;margin:0 0 5px;">
          // SECURITY NOTICE
        </p>
        <p style="font-size:12px;color:rgba(120,180,220,0.5);margin:0;line-height:1.6;">
          If you did not create a CalTrack account, ignore this transmission. The link will expire automatically.
        </p>
      </td>
    </tr>
  </table>
`;

const resetPasswordContent = (resetUrl: string) => `
  <!-- Field label style -->
  <p style="font-family:'Courier New',monospace;font-size:9px;letter-spacing:3px;color:rgba(0,180,255,0.45);text-transform:uppercase;margin:0 0 4px;">
    // CREDENTIAL OVERRIDE PROTOCOL
  </p>

  <p style="font-size:14px;line-height:1.9;color:rgba(160,210,255,0.75);margin:0 0 6px;">
    A password reset request has been initiated for your Hunter account.
  </p>
  <p style="font-size:14px;line-height:1.9;color:rgba(160,210,255,0.75);margin:0 0 28px;">
    Click below to override your access key. This link expires in
    <span style="color:#00c8ff;font-weight:600;">1 hour</span>.
  </p>

  <!-- Input-style info box -->
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
    <tr>
      <td style="
        border:1px solid rgba(0,140,220,0.2);
        border-bottom:1px solid rgba(0,180,255,0.4);
        background:rgba(0,20,50,0.5);
        padding:12px 16px;
      ">
        <p style="font-family:'Courier New',monospace;font-size:8px;letter-spacing:3px;color:rgba(0,180,255,0.35);text-transform:uppercase;margin:0 0 4px;">
          01 // ACCESS KEY OVERRIDE
        </p>
        <p style="font-size:13px;color:#d8f0ff;margin:0;">
          New access key will replace your current credentials
        </p>
      </td>
    </tr>
  </table>

  <!-- CTA Button -->
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
    <tr>
      <td align="center">
        <a href="${resetUrl}" style="
          display:block;
          padding:16px;
          border:1px solid rgba(0,200,255,0.5);
          background:linear-gradient(180deg,rgba(0,100,200,0.15),rgba(0,60,140,0.1));
          color:#7dd8ff;
          font-family:'Courier New',monospace;
          font-size:11px;
          letter-spacing:6px;
          text-transform:uppercase;
          text-decoration:none;
          text-align:center;
        ">[ &nbsp;OVERRIDE ACCESS KEY&nbsp; ]</a>
      </td>
    </tr>
  </table>

  <!-- Chevrons -->
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
    <tr>
      <td style="height:1px;background:linear-gradient(90deg,transparent,rgba(0,180,255,0.2));font-size:0;">&nbsp;</td>
      <td width="60" align="center" style="padding:0 8px;">
        <span style="font-size:10px;color:rgba(0,200,255,0.4);letter-spacing:4px;">&#8964; &#8964; &#8964;</span>
      </td>
      <td style="height:1px;background:linear-gradient(270deg,transparent,rgba(0,180,255,0.2));font-size:0;">&nbsp;</td>
    </tr>
    <tr>
      <td style="height:1px;background:linear-gradient(90deg,transparent,rgba(0,180,255,0.1));font-size:0;">&nbsp;</td>
      <td width="60" align="center" style="padding:0 8px;">
        <span style="font-size:10px;color:rgba(0,200,255,0.2);letter-spacing:4px;">&#8964; &#8964; &#8964;</span>
      </td>
      <td style="height:1px;background:linear-gradient(270deg,transparent,rgba(0,180,255,0.1));font-size:0;">&nbsp;</td>
    </tr>
  </table>

  <!-- Warning box -->
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td style="
        border:1px solid rgba(255,80,80,0.15);
        background:rgba(60,5,5,0.35);
        padding:12px 16px;
      ">
        <p style="font-family:'Courier New',monospace;font-size:8px;letter-spacing:3px;color:rgba(255,100,100,0.45);text-transform:uppercase;margin:0 0 5px;">
          // SECURITY WARNING
        </p>
        <p style="font-size:12px;color:rgba(200,140,140,0.55);margin:0;line-height:1.6;">
          If you did not request this override, your account may be compromised. Secure your Hunter account immediately.
        </p>
      </td>
    </tr>
  </table>
`;

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
    html: baseTemplate("HUNTER ENROLLMENT", verificationContent(verifyUrl)),
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
    html: baseTemplate("CREDENTIAL OVERRIDE", resetPasswordContent(resetUrl)),
  });
};