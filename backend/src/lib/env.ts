import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Falta la variable de entorno ${name}`);
  }
  return value;
}

export const env = {
  databaseUrl: required("DATABASE_URL"),
  jwtSecret: required("JWT_SECRET"),
  cloudinaryCloudName: required("CLOUDINARY_CLOUD_NAME"),
  cloudinaryApiKey: required("CLOUDINARY_API_KEY"),
  cloudinaryApiSecret: required("CLOUDINARY_API_SECRET"),
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 4000,
};
