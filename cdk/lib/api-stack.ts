import * as cdk from 'aws-cdk-lib';
import {Duration, RemovalPolicy, StackProps} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import {BillingMode, Table} from 'aws-cdk-lib/aws-dynamodb';
import {ServicePrincipal} from "aws-cdk-lib/aws-iam";

import * as path from "path";
import * as Mustache from 'mustache';
import * as fs from "fs";
import { Code} from "aws-cdk-lib/aws-lambda";

export class ApiStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props);

        const ddb = this.createDatabase()

        const createLambda = this.createFunction('CreateArtist', 'create-artist.ts', ddb.tableName, props)

        ddb.grantReadWriteData(createLambda)

        this.createRestApi(createLambda.functionArn);
    }

    private createDatabase(): Table {
        return new dynamodb.Table(this, "ArtistTable", {
            partitionKey: {name: 'id', type: dynamodb.AttributeType.STRING},
            billingMode: BillingMode.PAY_PER_REQUEST,
            pointInTimeRecovery: true,

            removalPolicy: RemovalPolicy.DESTROY
        });
    }

    private createRestApi(createArn: string) {
        let api = new apigateway.SpecRestApi(this, 'ArtistsApi', {
            apiDefinition: apigateway.ApiDefinition.fromInline(
                this.generateOpenApiSpec({
                    'CreateArtistLambda': createArn,
                })),
            deployOptions: {
                metricsEnabled: true,
                tracingEnabled: true
            },
        });
    }

    private createFunction(id: string, handler: string, tableName: string, props: StackProps): lambda.Function {
        let apiLambda = new lambda.Function(this, id, {
            code: Code.fromAsset("../app/build/libs/serverless-1.0.0-lambda.zip"),
            runtime: lambda.Runtime.PROVIDED_AL2,
            timeout: Duration.seconds(10),
            memorySize: 3072,
            handler: 'io.micronaut.function.aws.proxy.MicronautLambdaHandler',
            tracing: lambda.Tracing.ACTIVE,
            environment: {
                ARTIST_TABLE: tableName,
            }
        });

        const apigwServicePrincipal = new ServicePrincipal('apigateway.amazonaws.com');
        apiLambda.grantInvoke(apigwServicePrincipal)

        return apiLambda;
    }

    private generateOpenApiSpec(vars: any) {
        return this.resolve(Mustache.render(
            fs.readFileSync(path.join(__dirname, '../../openapi.yaml'), 'utf-8'), vars));
    }
}