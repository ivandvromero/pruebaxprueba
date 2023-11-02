using Dale.Extensions.Logging.Interfaces;
using Dale.Services.DebitCard.Domain.Core.Interfaces.Cryptography;
using Jose;
using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Infaestructure.Implementations
{
    public class Cryptography : ICryptography
    {
        private readonly ILogger<Cryptography> _logger;

        public Cryptography(ILogger<Cryptography> logger)
        {
            _logger = logger;
        }

        /// <summary>
        /// Method to decrypt
        /// </summary>
        /// <param name="certificatePath">Certificate path</param>
        /// <param name="valueSign">Validated signature value</param>
        /// <returns>Decrypted value</returns>
        public async Task<string> Decrypt(string certificatePath, string password, string valueSign)
        {
            var dataCert = System.IO.File.ReadAllText(certificatePath);

            using (var rsaAlg = RSA.Create())
            {
                rsaAlg.ImportFromPem(dataCert.ToCharArray());

                return JWT.Decode(valueSign.Trim(), rsaAlg, JweAlgorithm.RSA_OAEP_256, JweEncryption.A256GCM);
            }
        }

        /// <summary>
        /// Method to validate the signature
        /// </summary>
        /// <param name="certificatePath">Certificate path</param>
        /// <param name="encryptedData">Encrypted Data</param>
        /// <returns>validated signature</returns>
        public async Task<string> ValidateSignature(string certificatePath, string encryptedData)
        {
            Log($"Certificate path {certificatePath}");
            var dataCert = System.IO.File.ReadAllText(certificatePath);

            Log($"Log data from certificate -> {dataCert}", additionalData: dataCert);

            using (var rsaAlg = RSA.Create())
            {
                rsaAlg.ImportFromPem(dataCert.ToCharArray());

                return JWT.Decode(encryptedData.Trim(), rsaAlg, JwsAlgorithm.PS256); ;
            }

        }

        /// <summary>
        /// Method for encrypt and sign payload
        /// </summary>
        /// <param name="payload">value to encrypt</param>
        /// <param name="certificatePathJWE">JWE path</param>
        /// <param name="certificatePathJWS">JWS path</param>
        /// <returns>sogn value</returns>
        public async Task<string> Encrypt(string payload, string certificatePathJWE, string certificatePathJWS)
        {
            // read JWE Key
            Log($"Certificate path JWE {certificatePathJWE}");
            string jweCert = System.IO.File.ReadAllText(certificatePathJWE);

            Log($"Log data from certificate JWE -> {jweCert}", additionalData: jweCert);

            using (var rsaAlg = RSA.Create())
            {
                rsaAlg.ImportFromPem(jweCert.ToCharArray());
                // read JWS Key
                Log($"Certificate path JWS {certificatePathJWS}");
                var jwsCert = System.IO.File.ReadAllText(certificatePathJWS);

                Log($"Log data from certificate JWS -> {jwsCert}", additionalData: jwsCert);

                var headersToken = new Dictionary<string, object>();
                headersToken.Add("kid", "");
                headersToken.Add("typ", "JOSE");

                // encrypted data
                string token = JWT.Encode(payload, rsaAlg, JweAlgorithm.RSA_OAEP_256, JweEncryption.A256GCM, null, headersToken, null);
                headersToken.Add("cty", "JWE");
                using (var rsalg2 = RSA.Create())
                {
                    rsalg2.ImportFromPem(jwsCert.ToCharArray());
                    // sign encrypted data
                    return JWT.Encode(token, rsalg2, JwsAlgorithm.PS256, headersToken);
                }
            }
        }

        /// <summary>
        /// Method for encrypt and sign payload
        /// </summary>
        /// <param name="payload">value to encrypt</param>
        /// <param name="certificatePathJWE">JWE path</param>
        /// <returns>sogn value</returns>
        public async Task<string> EncryptJWE(string payload, string certificatePathJWE)
        {
            // read JWE Key
            Log($"Certificate path JWE {certificatePathJWE}");
            string jweCert = System.IO.File.ReadAllText(certificatePathJWE);

            Log($"Log data from certificate JWE -> {jweCert}", additionalData: jweCert);

            using (var rsaAlg = RSA.Create())
            {
                rsaAlg.ImportFromPem(jweCert.ToCharArray());

                // encrypted data
                return JWE.Encrypt(payload, new[] { new JweRecipient(JweAlgorithm.RSA_OAEP_256, rsaAlg) }, JweEncryption.A256CBC_HS512, mode: SerializationMode.Compact);
                
            }
        }

        /// <summary>
        /// Method for encrypt and sign payload
        /// </summary>
        /// <param name="jweToken">value to encrypt</param>
        /// <param name="certificatePathJWS">JWS path</param>
        /// <returns>sogn value</returns>
        public async Task<string> EncryptJWS(string jweToken, string certificatePathJWS)
        {
            // read JWE Key
            Log($"Certificate path JWS {certificatePathJWS}");
            string jwsCert = System.IO.File.ReadAllText(certificatePathJWS);

            Log($"Log data from certificate JWS -> {jwsCert}", additionalData: jwsCert);

            using (var rsaAlg = RSA.Create())
            {
                rsaAlg.ImportFromPem(jwsCert.ToCharArray());

                // encrypted data
                return JWT.Encode(jweToken, rsaAlg, JwsAlgorithm.RS512, options: new JwtOptions { DetachPayload = true, EncodePayload = true });
            }
        }

        #region PrivateMethods

        private void Log(string description, bool debug = false, object additionalData = null)
        {
            if (!debug)
                _logger.LogInformation(new Extensions.Logging.Models.K7LogInfo()
                {
                    TimeStampEvent = DateTime.Now,
                    Category = "Information",
                    Funcionalidad = "Cryptography",
                    Description = description,
                    UserId = Environment.MachineName
                });
            else
                _logger.LogDebug(new Extensions.Logging.Models.K7LogInfo()
                {
                    TimeStampEvent = DateTime.Now,
                    Category = "Debug",
                    Funcionalidad = "Cryptography",
                    Description = description,
                    UserId = Environment.MachineName,
                    AdditionalData = additionalData
                });
        }

        private void LogException(Exception e)
        {
            _logger.LogError(new Extensions.Logging.Models.K7LogInfo()
            {
                TimeStampEvent = DateTime.Now,
                AdditionalData = e,
                Category = "Exception",
                Funcionalidad = "Cryptography",
                Description = e.Message,
                UserId = Environment.MachineName
            });
        }

        #endregion

    }
}
