import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const tableName = process.env.tableName || "Cofee_Shop";

const createResponse = (statusCode, body) => {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
};

export const createCoffee = async (event) => {
  const { body } = event;
  const { coffeeId, name, price, available } = JSON.parse(body) || {};
  if (!coffeeId || !name || !price || available === undefined) {
    return createResponse(400, {
      error: "Missing required fields: coffeeId, name, price, available",
    });
  }
  const command = new PutCommand({
    TableName: tableName,
    Item: {
      coffeeId,
      name,

      price,
      available,
    },
    ConditionExpression: "attribute_not_exists(coffeeId)", // Ensure no item with the same coffeeId already exists
  });

  try {
    const response = await docClient.send(command);
    console.log(response);
    return createResponse(201, {
      message: "Coffee created successfully!",
      response,
    });
  } catch (error) {
    if (error.message === "The conditional request failed")
      return createResponse(409, { error: "Item already exists!" });
    else
      return createResponse(500, {
        error: "Internal Server Error!",
        message: error.message,
      });
  }
};

// when you need to create a new Table in DynamoDB than use CreateTableCommand from @aws-sdk/client-dynamodb. This command allows you to define the structure of your table, including the primary key and any secondary indexes. But when you want to perform  opertaion like inserting the data inside the table than use PutCommand
