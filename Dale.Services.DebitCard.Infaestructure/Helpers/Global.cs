namespace Dale.Services.DebitCard.Infaestructure.Helpers
{
    public class Global
    {
        public static string GetApprovalId(string custId)
        {
            var aprovalId = CommonHelpers.GetUniqueToken(6, "0123456789");
            return aprovalId;
        }
    }
}
