import { User } from "@auth0/auth0-react";

declare interface CustomUser extends Omit<User, "profile"> {
    profile: boolean | undefined;
    given_name: string[] | undefined;
  }