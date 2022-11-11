package com.drissamri.micronaut;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Post;
import software.amazon.awssdk.auth.credentials.EnvironmentVariableCredentialsProvider;
import software.amazon.awssdk.core.SdkSystemSetting;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.dynamodb.DynamoDbAsyncClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.DynamoDbException;
import software.amazon.awssdk.services.dynamodb.model.PutItemRequest;
import software.amazon.awssdk.services.dynamodb.model.ResourceNotFoundException;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Controller("/artists")

public class HomeController {
    DynamoDbAsyncClient dynamoDbClient = DynamoDbAsyncClient.builder()
            .region(Region.of(System.getenv(SdkSystemSetting.AWS_REGION.environmentVariable())))
            .credentialsProvider(EnvironmentVariableCredentialsProvider.create())
            .build();

    @Post
    public Map<String, Object> index() {
        Map<String, AttributeValue> itemValues = new HashMap<>();
        itemValues.put("id", AttributeValue.builder().s("driss").build();
        itemValues.put("albums_recoded", AttributeValue.builder().n("10").build());

        PutItemRequest request = PutItemRequest.builder()
                .tableName("RestOpenApiTypescriptStack-ArtistTableA85750A0-8K9UNVMOLDYY")
                .item(itemValues)
                .build();

        try {
            dynamoDbClient.putItem(request);

        } catch (ResourceNotFoundException e) {
            System.err.println("Be sure that it exists and that you've typed its name correctly!");
            System.exit(1);
        } catch (DynamoDbException e) {
            System.err.println(e.getMessage());
            System.exit(1);
        }

        return Collections.singletonMap("message", "Hello World");
    }
}
