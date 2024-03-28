import {
  CreateUserPayload,
  UserService,
  getUserPayload,
} from "../../services/user";

const queries = {
  getUserToken: async (_: any, payload: getUserPayload) => {
    const token = await UserService.getUserToken(payload);
    return token;
  }
  ,
  getCurrentLoggedInUser: async (_: any, parameters: any, context: any) => {
    console.log(context);
  },
};

const mutations = {
  createUser: async (_: any, payload: CreateUserPayload) => {
    const res = await UserService.createUser(payload);
    return res.id;
  },
};

export const resolvers = {
  queries,
  mutations,
};
