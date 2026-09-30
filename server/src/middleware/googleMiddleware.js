import { OAuth2Client } from "google-auth-library";

export const GoogleProtect = async (req, res, next) => {
  try {
    const { idToken, email, id } = req.body;

    if (!idToken) {
      const error = new Error("Google ID token is required");
      error.statusCode = 400;
      return next(error);
    }

    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID || undefined,
    });
    const payload = ticket.getPayload();

    if (
      (email && payload.email && email.trim().toLowerCase() !== payload.email.trim().toLowerCase()) ||
      (id && payload.sub && id !== payload.sub)
    ) {
      const error = new Error("User Not Verified");
      error.statusCode = 400;
      return next(error);
    }
    next();
  } catch (error) {
    next(error);
  }
};