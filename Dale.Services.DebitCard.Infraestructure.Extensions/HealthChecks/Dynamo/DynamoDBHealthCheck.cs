using Amazon.CloudWatchLogs.Model;
using Amazon.DynamoDBv2;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Infraestructure.Extensions.HealthChecks.Dynamo
{
    public class DynamoDBHealthCheck : IHealthCheck
    {
        private readonly IAmazonDynamoDB _amazonDynamoDB;
        private readonly IConfiguration _configuration;

        public DynamoDBHealthCheck(IAmazonDynamoDB amazonDynamoDB, IConfiguration configuration)
        {
            _amazonDynamoDB = amazonDynamoDB;
            _configuration = configuration;
        }

        public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
        {
            var envPrefix = _configuration.GetValue<string>("PrefixDynamoDB");

            List<string> tableNamesArray = _configuration.GetSection("DynamoHealthCheck").Get<List<string>>();
            foreach (var DynamoDBTable in tableNamesArray)
            {
                var healthResult = await TableHealthCheck($"{envPrefix}{DynamoDBTable}");
                if (healthResult.Status != HealthStatus.Healthy)
                    return healthResult;
            }

            return new HealthCheckResult(HealthStatus.Healthy, "Todos los recursos se encuentran activos.");
        }

        private async Task<HealthCheckResult> TableHealthCheck(string TableName)
        {
            try
            {
                var table = await _amazonDynamoDB.DescribeTableAsync(TableName);
                if (table.Table.TableStatus == TableStatus.ACTIVE)
                    return new HealthCheckResult(HealthStatus.Healthy);
                else
                    return new HealthCheckResult(HealthStatus.Unhealthy, $"El recurso {TableName} no se encuentra activo.");
            }
            catch (ResourceNotFoundException)
            {
                return new HealthCheckResult(HealthStatus.Unhealthy, $"El recurso {TableName} no fue encontrado.");
            }
        }
    }
}
