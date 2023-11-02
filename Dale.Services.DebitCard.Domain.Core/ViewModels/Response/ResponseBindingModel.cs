using Newtonsoft.Json;

namespace Dale.Services.DebitCard.Domain.Core
{
    public class ResponseBindingModel<T>
    {

        public bool Succeeded { get; set; } = true;
        public T Result { get; set; }

        public override string ToString()
        {
            return JsonConvert.SerializeObject(this);
        }
        /// <summary>
        /// Field with the error result only if request is not succeeded (i.e., Succeeded = false)
        /// </summary>
        public ErrorMessageBindingModel ErrorResult { get; set; }

        public bool ShouldSerializeErrorResult()
        {
            // Don't serialize the ErrorResult property if property Succeeded has true value
            return !Succeeded;
        }
    }

}
