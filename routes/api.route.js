const router = require("express").Router();
const { google } = require("googleapis");

const GOOGLE_CLIENT_ID =
  "745179012303-v7ng0ttg6dil2vng220l0rlq0lv0v5sg.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
let REFRESH_TOKEN =
  "1//0hmAr0jMuANXOCgYIARAAGBESNwF-L9Irj4vcfqdCr0tRr2wm4yMs2_mvPOiP2HYhGD2plUer8R8cH5UZZZUkn8i8ihVlYWNztgU";
const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  "https://callmindm3.vercel.app"
);

router.get("/", async (req, res, next) => {
  res.send({ message: "Ok api is working 🚀" });
});

router.post("/create-tokens", async (req, res, next) => {
  try {
    const { code } = req.body;
    const { tokens } = await oauth2Client.getToken(code);
    if (tokens.refresh_token) {
      REFRESH_TOKEN = tokens.refresh_token;
    }
    res.send(tokens);
  } catch (error) {
    next(error);
  }
});

router.post("/create-event", async (req, res, next) => {
  try {
    const {
      summary,
      description,
      location,
      startDateTime,
      endDateTime,
      attendees,
    } = req.body;
    oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
    const calendar = google.calendar("v3");
    const response = await calendar.events.insert({
      auth: oauth2Client,
      calendarId: "primary",
      conferenceDataVersion: 1,
      sendUpdates: "all",
      requestBody: {
        summary: summary,
        description: description,
        location: location,
        colorId: "6",
        start: {
          dateTime: new Date(startDateTime),
          timeZone: "America/Sao_Paulo",
        },
        end: { dateTime: new Date(endDateTime), timeZone: "America/Sao_Paulo" },
        conferenceData: {
          createRequest: {
            requestId: "renanzinhoteste1234",
            conferenceSolutionKey: {
              type: "hangoutsMeet",
            },
          },
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: "email", minutes: 10 },
            { method: "popup", minutes: 10 },
          ],
        },
        attendees: attendees,
      },
    });
    res.send(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
