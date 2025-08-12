import Ajv from "ajv";

//TODO: is this good to have it as global variable?
const ajv = new Ajv();

interface ErrorMessages {
  [key: number]: string;
}

const errorMessages: ErrorMessages = {};

export function isNumeric(value: any): boolean {
  return !isNaN(value);
}

export function isString(value: any): value is string {
  return typeof value === "string";
}

export function isArray(value: any): value is any[] {
  return Array.isArray(value);
}

export function validateDataAgainstSchema(data: any, schema: any): boolean {
  const validate = ajv.compile(schema);
  return validate(data) as boolean;
}

export function getBaseUrl(): string {
  return process.env.BASE_URL || "http://localhost:3000"; // Use an environment variable or a default value
}

export function getErrorMessage(code: number, placeholders: string[] = []): { code: number; message: string } {
  const errorMessage = errorMessages[code];
  if (errorMessage) {
    const message = placeholders.reduce((msg, value, index) => {
      return msg.replace(`{${index}}`, value);
    }, errorMessage);
    return { code, message };
  } else {
    return { code, message: "Unknown error" };
  }
}
