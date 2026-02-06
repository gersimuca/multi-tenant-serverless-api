import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb"

const client = DynamoDBDocumentClient.from(
    new DynamoDBClient({
        endpoint: "http://localhost:4566",
        region: "us-east-1"
    })
)

const TABLE = process.env.TABLE_NAME!

export const handler = async (event: any) => {
    const tenantId = event.headers["x-tenant-id"]

    if (!tenantId) {
        return { statusCode: 401, body: "Missing tenant id" }
    }

    if (event.httpMethod === "POST") {
        const body = JSON.parse(event.body)

        await client.send(new PutCommand({
            TableName: TABLE,
            Item: {
                tenant_id: tenantId,
                item_id: crypto.randomUUID(),
                name: body.name
            }
        }))

        return { statusCode: 201, body: "Item created" }
    }

    if (event.httpMethod === "GET") {
        const result = await client.send(new QueryCommand({
            TableName: TABLE,
            KeyConditionExpression: "tenant_id = :t",
            ExpressionAttributeValues: {
                ":t": tenantId
            }
        }))

        return {
            statusCode: 200,
            body: JSON.stringify(result.Items)
        }
    }

    return { statusCode: 405, body: "Method not allowed" }
}
