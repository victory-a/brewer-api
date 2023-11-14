const config = require('../config/index');
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

const ses = new SESClient({ region: config.AWS_SES_REGION });

interface createEmailParams {
  toAddress: string;
  fromAddress: string;
  message: string;
}

function createSendEmailcommand({ toAddress, fromAddress, message }: createEmailParams) {
  return new SendEmailCommand({
    Destination: {
      ToAddresses: [toAddress]
    },
    Source: fromAddress,
    Message: {
      Subject: {
        Charset: 'UTF-8',
        Data: 'Your on-time password'
      },
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: message
        }
      }
    }
  });
}

async function sendEmailToken({ email, token }: { email: string; token: string }) {
  const message = `Your one time pasword is ${token} \nCheers!`;

  const command = createSendEmailcommand({
    toAddress: email,
    fromAddress: config.SES_FROM_EMAIL,
    message
  });

  try {
    return ses.send(command);
  } catch (error) {
    return error;
  }
}

module.exports = sendEmailToken;
