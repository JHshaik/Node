const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Apartment Management API",
      version: "1.0.0",
      description: "API documentation for Apartment Backend",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
      {
        url: "https://srisainilayam.vercel.app",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./routes/*.js"],
};

export default swaggerOptions;