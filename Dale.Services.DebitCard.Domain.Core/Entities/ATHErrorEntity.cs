namespace Dale.Services.DebitCard.Domain.Core.Entities
{
    public class ATHErrorEntity
    {
        public int Id { get; set; }
        public string ErrorTypeCode { get; set; }
        public string InternalCode { get; set; }
        public int TypeId { get; set; }
        public int TLF { get; set; }
        public string Description { get; set; }
        public int B24 { get; set; }
        public bool IsSuccess { get; set; }
    }
}
