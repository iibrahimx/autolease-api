export const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "AutoLease API",
    version: "1.0.0",
    description: "Car Rental & Marketplace API Documentation",
    contact: {
      name: "AutoLease",
      url: "https://autolease-api-n1tv.onrender.com",
    },
  },
  servers: [
    {
      url: "https://autolease-api-n1tv.onrender.com",
      description: "Production",
    },
    {
      url: "http://localhost:3001",
      description: "Development",
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
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          email: { type: "string", format: "email" },
          firstName: { type: "string" },
          lastName: { type: "string" },
          role: { type: "string", enum: ["customer", "car_owner", "admin"] },
        },
      },
      Car: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          brand: { type: "string" },
          model: { type: "string" },
          year: { type: "integer" },
          dailyPrice: { type: "number" },
          status: { type: "string" },
        },
      },
      Error: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          message: { type: "string" },
        },
      },
    },
  },
  paths: {
    // AUTH ROUTES
    "/api/auth/register": {
      post: {
        tags: ["Authentication"],
        summary: "Register new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password", "firstName", "lastName"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string", minLength: 6 },
                  firstName: { type: "string" },
                  lastName: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "User registered" },
          400: { description: "Validation error" },
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Authentication"],
        summary: "Login with email/password",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Login successful" },
          401: { description: "Invalid credentials" },
        },
      },
    },
    "/api/auth/google": {
      post: {
        tags: ["Authentication"],
        summary: "Login with Google",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["idToken"],
                properties: {
                  idToken: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Google login successful" },
        },
      },
    },
    "/api/auth/change-password": {
      post: {
        tags: ["Authentication"],
        summary: "Change password",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["currentPassword", "newPassword"],
                properties: {
                  currentPassword: { type: "string" },
                  newPassword: { type: "string", minLength: 6 },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Password changed" },
        },
      },
    },
    "/api/auth/forgot-password": {
      post: {
        tags: ["Authentication"],
        summary: "Request password reset",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email"],
                properties: {
                  email: { type: "string", format: "email" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Reset email sent if account exists" },
        },
      },
    },
    "/api/auth/reset-password": {
      post: {
        tags: ["Authentication"],
        summary: "Reset password with token",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["token", "newPassword"],
                properties: {
                  token: { type: "string" },
                  newPassword: { type: "string", minLength: 6 },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Password reset successful" },
        },
      },
    },

    // USER ROUTES
    "/api/users/profile": {
      get: {
        tags: ["Users"],
        summary: "Get user profile",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Profile data" },
        },
      },
      put: {
        tags: ["Users"],
        summary: "Update user profile",
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  firstName: { type: "string" },
                  lastName: { type: "string" },
                  phoneNumber: { type: "string" },
                  address: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Profile updated" },
        },
      },
    },

    // CAR ROUTES
    "/api/cars/browse": {
      get: {
        tags: ["Cars"],
        summary: "Browse available cars",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "brand", in: "query", schema: { type: "string" } },
          { name: "minPrice", in: "query", schema: { type: "number" } },
          { name: "maxPrice", in: "query", schema: { type: "number" } },
          { name: "sortBy", in: "query", schema: { type: "string" } },
          { name: "sortOrder", in: "query", schema: { type: "string", enum: ["ASC", "DESC"] } },
        ],
        responses: {
          200: { description: "List of available cars" },
        },
      },
    },
    "/api/cars/{id}": {
      get: {
        tags: ["Cars"],
        summary: "Get car details",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Car details" },
        },
      },
    },
    "/api/cars": {
      post: {
        tags: ["Cars"],
        summary: "Register a new car",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["brand", "model", "year", "vin", "description", "engineType", "fuelType", "transmission", "dailyPrice", "address"],
                properties: {
                  brand: { type: "string" },
                  model: { type: "string" },
                  year: { type: "integer" },
                  vin: { type: "string" },
                  description: { type: "string" },
                  engineType: { type: "string" },
                  fuelType: { type: "string" },
                  transmission: { type: "string" },
                  dailyPrice: { type: "number" },
                  address: { type: "string" },
                  images: { type: "array", items: { type: "string" } },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Car registered" },
        },
      },
    },
    "/api/cars/my-cars": {
      get: {
        tags: ["Cars"],
        summary: "Get owner's cars",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Owner's cars" },
        },
      },
    },
    "/api/cars/upload-images": {
      post: {
        tags: ["Cars"],
        summary: "Upload car images",
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  images: { type: "array", items: { type: "string", format: "binary" } },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Images uploaded" },
        },
      },
    },

    // BOOKING ROUTES
    "/api/bookings": {
      post: {
        tags: ["Bookings"],
        summary: "Create booking",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["carId", "startDate", "endDate"],
                properties: {
                  carId: { type: "string", format: "uuid" },
                  startDate: { type: "string", format: "date" },
                  endDate: { type: "string", format: "date" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Booking created" },
        },
      },
    },
    "/api/bookings/{id}/cancel": {
      put: {
        tags: ["Bookings"],
        summary: "Cancel booking",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Booking cancelled" },
        },
      },
    },

    // REVIEW ROUTES
    "/api/reviews/car/{carId}": {
      get: {
        tags: ["Reviews"],
        summary: "Get car reviews",
        parameters: [{ name: "carId", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Reviews with average rating" },
        },
      },
    },
    "/api/reviews": {
      post: {
        tags: ["Reviews"],
        summary: "Create review",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["carId", "rating"],
                properties: {
                  carId: { type: "string", format: "uuid" },
                  rating: { type: "integer", minimum: 1, maximum: 5 },
                  comment: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Review created" },
        },
      },
    },

    // PAYMENT ROUTES
    "/api/payments/create": {
      post: {
        tags: ["Payments"],
        summary: "Create payment intent",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["bookingId"],
                properties: {
                  bookingId: { type: "string", format: "uuid" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Payment created" },
        },
      },
    },

    // ADMIN ROUTES
    "/api/admin/dashboard": {
      get: {
        tags: ["Admin"],
        summary: "Get dashboard stats",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Dashboard statistics" },
        },
      },
    },
    "/api/admin/users/{userId}/suspend": {
      patch: {
        tags: ["Admin"],
        summary: "Suspend user",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "userId", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "User suspended" },
        },
      },
    },
    "/api/admin/users/{userId}/activate": {
      patch: {
        tags: ["Admin"],
        summary: "Activate user",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "userId", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "User activated" },
        },
      },
    },
  },
};