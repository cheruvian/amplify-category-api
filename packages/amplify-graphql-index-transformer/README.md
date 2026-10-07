# GraphQL @primaryKey and @index Transformers

# Reference Documentation

### @primaryKey

The `@primaryKey` directive allows you to define the primary key for your relational data.

#### Definition

```graphql
directive @primaryKey(sortKeyFields: [String]) on FIELD_DEFINITION
```

### Sparse composite secondary indexes

A composite `@index` sort key is only materialized when all of its components
are non-null. A create mutation may omit nullable components even when another
component, such as `createdAt`, is automatically populated by `@model`.
The item is stored in the base table and excluded from that secondary index.

```graphql
type Request @model {
  owner: String! @primaryKey(sortKeyFields: ["requestId"]) @index(name: "byConversation", sortKeyFields: ["conversationId", "createdAt"])
  requestId: ID!
  conversationId: ID
  createdAt: AWSDateTime
}
```

For this model, `createRequest(input: { owner: "owner", requestId: "request" })`
does not require a conversation. Supplying `conversationId` constructs the index
key using the generated creation timestamp.

Updates unrelated to the index preserve its existing key. Setting a nullable
component to `null` removes the derived index attribute. Supplying every component
with non-null values restores index membership. Partial non-null key updates
still require all components: the resolver does not read the existing item to
reconstruct the composite key. Primary-key validation is unchanged.
