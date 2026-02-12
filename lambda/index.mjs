import { getCoffee } from "./get/index.mjs";
import { createCoffee } from "./post/index.mjs";

export const handler = async (event) => {
  console.log("Event:", JSON.stringify(event));

  const method = event?.requestContext?.http?.method;
  const path = event?.rawPath;

  if (!method) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid event structure" }),
    };
  }

  // GET /coffee
  if (method === "GET" && path === "/coffee") {
    return await getCoffee(event);
  }

  // GET /coffee/{id}
  if (method === "GET" && path.startsWith("/coffee/")) {
    const id = path.split("/")[2];

    const updatedEvent = {
      ...event,
      pathParameters: { id },
    };

    return await getCoffee(updatedEvent);
  }

  // POST /coffee
  if (method === "POST" && path === "/coffee") {
    return await createCoffee(event);
  }

  return {
    statusCode: 404,
    body: JSON.stringify({ message: "Route not found" }),
  };
};
