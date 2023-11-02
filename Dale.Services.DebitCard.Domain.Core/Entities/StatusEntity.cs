using static Dale.Services.DebitCard.Domain.Core.Constans.Enums;

namespace Dale.Services.DebitCard.Domain.Core.Entities
{
    public class StatusEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string SystemName { get; set; }
        public string Code { get; set; }
        public StatusTypes TypeId { get; set; }
    }
}
