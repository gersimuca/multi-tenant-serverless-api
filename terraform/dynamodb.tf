resource "aws_dynamodb_table" "items" {
  name         = "items"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "tenant_id"
  range_key    = "item_id"

  attribute {
    name = "tenant_id"
    type = "S"
  }

  attribute {
    name = "item_id"
    type = "S"
  }
}
