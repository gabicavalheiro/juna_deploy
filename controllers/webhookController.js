import dotenv from 'dotenv';

dotenv.config();


const verify_token = process.env.VERIFY_TOKEN


// Validação do webhook via GET
export const validateWebhook = (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === verify_token) {
      console.log('Webhook validado com sucesso!');
      return res.status(200).send(challenge); // Responda com o challenge enviado pelo Meta
    } else {
      return res.status(403).send('Token inválido');
    }
  } else {
    return res.status(400).send('Parâmetros ausentes');
  }
};

// Processamento de notificações via POST
export const handleWebhookEvent = (req, res) => {
  const body = req.body;

  console.log('Webhook recebido:', JSON.stringify(body, null, 2));

  // Exemplo de lógica de processamento (substitua conforme necessário)
  if (body.object === 'page') {
    body.entry.forEach((entry) => {
      console.log(`Recebido evento de página: ${entry.id} com alterações.`);
    });
  }

  return res.status(200).send('Evento recebido');
};
