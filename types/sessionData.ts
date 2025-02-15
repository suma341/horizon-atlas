export interface SessionData {
    user?: {
      name: string;
      email: string;
      image: string;
    };
    expires: string;
    token: {
      id: string;
      accessToken: string;
    };
  }