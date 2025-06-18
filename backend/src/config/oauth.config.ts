import { google } from "googleapis";
import { config } from "./app.config";

//Google oauth
export const googleOAuth2Client = new google.auth.OAuth2(
  config.GOOGLE_CLIENT_ID,
  config.GOOGLE_CLIENT_SECRET,
  config.GOOGLE_REDIRECT_URI
);

// Zoom OAuth
import axios from "axios";

export const zoomOAuth2Client = {
  getAuthUrl: (state: string) =>
    `https://zoom.us/oauth/authorize?response_type=code&client_id=${config.ZOOM_CLIENT_ID}&redirect_uri=${encodeURIComponent(config.ZOOM_REDIRECT_URI)}&state=${state}`,
  getToken: async (code: string) => {
    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", config.ZOOM_REDIRECT_URI);
    const res = await axios.post(
      "https://zoom.us/oauth/token",
      params,
      {
        headers: {
          Authorization:
            "Basic " + Buffer.from(`${config.ZOOM_CLIENT_ID}:${config.ZOOM_CLIENT_SECRET}`).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return res.data;
  },
};
