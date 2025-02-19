import { User } from "@auth0/auth0-react";

type Guild = {
    id: string;
    name: string;
    icon?: string;
  };  

declare interface CustomUser extends Omit<User, "profile"> {
    profile: Guild[] | undefined;
  }