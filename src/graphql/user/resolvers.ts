const queries = {};

const mutations = {
    createUser: async(_: any, {}:{})=>{
        return "random User id";
    }
};

export const resolvers = {
    queries,
    mutations
}