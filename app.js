const {google} = require('googleapis');
const fs = require('fs');
const {promisify} = require('util');

const writeFileAsync = promisify(fs.writeFile);

async function downloadAttachments(
  authToken,
  messageId,
  attachmentId,
) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GClientKey,
  );
  oauth2Client.setCredentials({
    access_token: authToken,
  });

  const gmail = google.gmail({version: 'v1', auth: oauth2Client});

  try {
    const attachment = await gmail.users.messages.attachments.get({
      userId: 'me',
      messageId,
      id: attachmentId,
    });
    // console.log(attachment.data.data);
    const data = Buffer.from(attachment.data.data, 'base64');
    const filePath = "./public/" + messageId + ".pdf";
    await writeFileAsync(filePath, data);
    console.log(`Attachment downloaded`);
    return filePath;
  } catch (error) {
    console.error('Error downloading attachment:', error.message);
  }
}
const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
app.use(express.static('public'));
app.get("/", (req, res) => res.type('html').send(html));
app.get("/get-pdf/:messageId/:attachmentId", async (req, res, next) => {
  try {
    const filePath = await downloadAttachments(req.headers.authorization, req.params.messageId, req.params.attachmentId);
    res.status(200).json({filePath});
  } catch (err) {
    next(err)
  }
});

const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;

const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Hello from Render!</title>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
    <script>
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          disableForReducedMotion: true
        });
      }, 500);
    </script>
    <style>
      @import url("https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css");
      @font-face {
        font-family: "neo-sans";
        src: url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
        font-style: normal;
        font-weight: 700;
      }
      html {
        font-family: neo-sans;
        font-weight: 700;
        font-size: calc(62rem / 16);
      }
      body {
        background: white;
      }
      section {
        border-radius: 1em;
        padding: 1em;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, -50%);
      }
    </style>
  </head>
  <body>
    <section>
      Hello from Render!
    </section>
  </body>
</html>
`
