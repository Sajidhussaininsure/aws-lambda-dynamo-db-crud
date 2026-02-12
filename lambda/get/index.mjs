// 1ST HIGH LEVEL CLIENT EXAMPLE

import { DynamoDBClient } from "@aws-sdk/client-dynamodb"; // low level client
import { DynamoDBDocumentClient, GetCommand , ScanCommand} from "@aws-sdk/lib-dynamodb"; // higher level client with marshall and unmarshall features

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const tableName = process.env.tableName  || "Cofee_Shop";


const createResponse = (statusCode, body) => {
  console.log(body);
  return {
    statusCode,
    headers:{"Content-Type": "application/json"},
    body: JSON.stringify(body)
  };
}




export const getCoffee = async (event) => {


    const {pathParameters} =event
    const {id}= pathParameters || {}
 

    try {
        let command;
        if(id){
          command = new GetCommand({
    TableName: tableName,
    Key: {
      // partition key and sort key of the item to get
      coffeeId: id,
    },
  }); 
    }else{
        command = new ScanCommand({
            TableName: tableName,
        })
    }

  const response = await docClient.send(command);
  console.log(response);
  return createResponse(200, response);
    } catch (error) {
        console.error("Error fetching coffee data from dynamodb:", error);
        return createResponse(500, { error: "Failed to fetch coffee data" });
    }
};


{
  /*
Pros: Cleaner, less boilerplate, automatic type conversion.
Cons: Slightly less control over DynamoDB-specific features.

Use DynamoDBDocumentClient (High-Level):

For most applications where simplicity and readability are preferred.
When you want to avoid manual type conversion.

 */
}



// 2ND LOW LEVEL CLIENT EXAMPLE


  {/*

import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb"

const config = {
    region: "us-east-1",
};

const client = new DynamoDBClient(config);

const getCoffee = async (event) => {

    const coffeeId = "c123";

    const input = {
        TableName: "test_coffee_shop",
        Key: {
            coffee_id: {
                S: coffeeId,
            },
        },
    };

    const command = new GetItemCommand(input);
    const response = await client.send(command);

    console.log(response);
    return response;
}

export { getCoffee };

 */
}

{
  /*

Pros: Full control, explicit type definitions.
Cons: More verbose, requires manual type handling.

Use DynamoDBClient (Low-Level):

When you need fine-grained control over DynamoDB operations.
For advanced use cases or custom type handling.



 */
}

{
  /*
    
    
Summary

High-Level Client: Easier to use, handles type conversion automatically.
Low-Level Client: More control, but requires explicit type definitions.

DynamoDB expects data in a specific format (e.g., { S: "string" }, { N: "123" }, { L: [...] }), but in your JavaScript code, you usually work with plain objects (e.g., { name: "Alice", age: 30 }).

marshall: Converts a JavaScript object into DynamoDB's format.
unmarshall: Converts DynamoDB's format back into a JavaScript object.


Note: when you are making zip file u need to include node_modules folder in the zip file because it contains the dependencies of your lambda function.

DEPLOY>TEST
*/
}
