using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Domain.Core.Interfaces.Cryptography
{
    public interface ICryptography
    {
        /// <summary>
        /// Method to decrypt
        /// </summary>
        /// <param name="certificatePath">Certificate path</param>
        /// <param name="valueSign">Validated signature value</param>
        /// <returns>Decrypted value</returns>
        Task<string> Decrypt(string certificatePath, string password, string valueSign);

        /// <summary>
        /// Method to validate the signature
        /// </summary>
        /// <param name="certificatePath">Certificate path</param>
        /// <param name="encryptedData">Encrypted Data</param>
        /// <returns>validated signature</returns>
        Task<string> ValidateSignature(string certificatePath, string encryptedData);

        /// <summary>
        /// Method for encrypt and sign payload
        /// </summary>
        /// <param name="payload">value to encrypt</param>
        /// <param name="certificatePathJWE">JWE path</param>
        /// <param name="certificatePathJWS">JWS path</param>
        /// <returns>sogn value</returns>
        Task<string> Encrypt(string payload, string certificatePathJWE, string certificatePathJWS);
        /// <summary>
        /// Method for encrypt and sign payload
        /// </summary>
        /// <param name="payload">value to encrypt</param>
        /// <param name="certificatePathJWE">JWE path</param>
        /// <returns>sogn value</returns>
        Task<string> EncryptJWE(string payload, string certificatePathJWE);
        /// <summary>
        /// Method for encrypt and sign payload
        /// </summary>
        /// <param name="jweToken">value to encrypt</param>
        /// <param name="certificatePathJWS">JWS path</param>
        /// <returns>sogn value</returns>
        Task<string> EncryptJWS(string jweToken, string certificatePathJWS);
    }
}
