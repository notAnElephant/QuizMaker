module.exports = {
  client: {
    service: {
      name: "quizmaker",
      url: "http://localhost:8080/v1/graphql",
    },
    includes: ["src/**/*.{ts,tsx,js,jsx,graphql}"],
  },
};
