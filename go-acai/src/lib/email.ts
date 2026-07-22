import nodemailer from 'nodemailer'

function getTransport() {
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT) || 587
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const from = process.env.SMTP_FROM || 'naoresponda@goacai.com.br'

  if (!host || !user || !pass) return null

  return nodemailer.createTransport({
    host, port,
    secure: port === 465,
    auth: { user, pass: pass.replace(/\s/g, '') },
    from,
  })
}

export async function sendWelcomeEmail(email: string, storeName: string, tenantSlug: string) {
  const transport = getTransport()
  if (!transport) return

  const loginUrl = `https://go-acai.vercel.app/login`
  const appUrl = `https://go-acai.vercel.app/app/${tenantSlug}`

  await transport.sendMail({
    to: email,
    subject: `Bem-vindo ao GO AÇAÍ — Sua loja "${storeName}" está pronta!`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px">
        <div style="text-align:center;padding:20px;background:linear-gradient(135deg,#7c3aed,#ec4899);border-radius:12px 12px 0 0">
          <h1 style="color:#fff;font-size:24px;margin:0">GO AÇAÍ</h1>
          <p style="color:rgba(255,255,255,.8);margin:4px 0 0">Seu delivery em minutos</p>
        </div>

        <div style="background:#fff;border:1px solid #e5e7eb;border-top:0;padding:30px;border-radius:0 0 12px 12px">
          <h2 style="color:#111;font-size:20px;margin:0 0 8px">Olá!</h2>
          <p style="color:#555;line-height:1.6">
            Sua loja <strong style="color:#7c3aed">${storeName}</strong> foi criada com sucesso no GO AÇAÍ!
          </p>

          <div style="background:#f3f4f6;border-radius:8px;padding:16px;margin:16px 0">
            <h3 style="color:#111;font-size:14px;margin:0 0 12px;text-transform:uppercase;letter-spacing:.5px">Dados de acesso</h3>
            <p style="margin:4px 0;color:#555"><strong>Loja:</strong> ${storeName}</p>
            <p style="margin:4px 0;color:#555"><strong>Login:</strong> ${email}</p>
            <p style="margin:4px 0;color:#555"><strong>Painel:</strong> <a href="${loginUrl}" style="color:#7c3aed">${loginUrl}</a></p>
            <p style="margin:4px 0;color:#555"><strong>App do cliente:</strong> <a href="${appUrl}" style="color:#7c3aed">${appUrl}</a></p>
          </div>

          <div style="background:#fef2f2;border-radius:8px;padding:12px;margin:16px 0;font-size:13px;color:#991b1b">
            <strong>Importante:</strong> Guarde seu email e senha em local seguro.<br/>
            Caso esqueça sua senha, use a opção "Esqueci minha senha" na tela de login.
          </div>

          <a href="${loginUrl}" style="display:block;text-align:center;background:linear-gradient(135deg,#7c3aed,#ec4899);color:#fff;text-decoration:none;font-weight:bold;padding:14px;border-radius:8px;margin:20px 0">
            Acessar Painel
          </a>

          <p style="color:#999;font-size:12px;text-align:center;margin:24px 0 0">
            GO AÇAÍ — Seu aplicativo de delivery em minutos<br/>
            <a href="https://go-acai.vercel.app" style="color:#7c3aed">go-acai.vercel.app</a>
          </p>
        </div>
      </div>
    `,
  })
}
