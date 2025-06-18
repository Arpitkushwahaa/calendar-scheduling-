import { Router, Request, Response } from "express";
import { config } from "../config/app.config";
import { zoomOAuth2Client } from "../config/oauth.config";
import { asyncHandler } from "../middlewares/asyncHandler.middeware"; // Import asyncHandler

const router = Router();

// 1. Start Zoom OAuth flow
router.get("/auth/zoom", (req: Request, res: Response) => {
  const state = req.query.state || ""; // Optional: generate and store a CSRF token in state
  const url = zoomOAuth2Client.getAuthUrl(state as string);
  res.redirect(url);
});

// 2. Handle Zoom OAuth callback
router.get(
  "/integration/zoom/callback",
  asyncHandler(async (req: Request, res: Response) => { // Wrapped with asyncHandler
    const { code, state } = req.query;

    if (!code) {
      return res.status(400).json({ error: "Missing authorization code" });
    }

    try {
      const tokenData = await zoomOAuth2Client.getToken(code as string);
      // TODO: Validate 'state' parameter if you used it for CSRF protection
      // TODO: Save tokens (access_token, refresh_token, expires_in) to the user's profile in the database
      //       Associate them with the currently logged-in user.
      res.status(200).json({ success: true, message: "Zoom connected successfully", tokenData, state });
    } catch (err) {
      let errorMessage = "Zoom token exchange failed";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      // Log the detailed error for server-side debugging
      console.error("Zoom OAuth Callback Error:", err);
      res.status(500).json({ error: "Zoom token exchange failed", details: errorMessage });
    }
  })
);

export default router;
