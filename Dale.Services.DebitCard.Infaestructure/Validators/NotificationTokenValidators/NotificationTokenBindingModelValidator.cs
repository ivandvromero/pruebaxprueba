using Dale.Services.DebitCard.Domain.Core.ViewModels.NotificationToken;
using FluentValidation;

namespace Dale.Services.DebitCard.Infaestructure.Validators.NotificationTokenValidators
{
    public class NotificationTokenBindingModelValidator : AbstractValidator<NotificationTokenRequestBindingModel>
    {
        /// <summary>
        /// Validation class NotificationTokenRequestBindingModel
        /// </summary>
        public NotificationTokenBindingModelValidator()
        {
            RuleFor(data => data.PanReferenceID)
                .NotEmpty()
                .MaximumLength(32)
                .WithMessage("El PanReferenceID debe ser de máximo 32 caracteres");

            RuleFor(data => data.TokenReferenceID)
                .NotEmpty()
                .MaximumLength(32)
                .WithMessage("El TokenReferenceID debe ser de máximo 32 caracteres");

            RuleFor(data => data.TokenRequestorID)
                .GreaterThan(0)
                .WithMessage("El TokenRequestorID debe ser un valor diferente a 0");

            RuleFor(data => data.MessageReasonCode)
                .NotEmpty();

            RuleFor(data => data.DateTimeOfEvent)
                .NotEmpty();

            RuleFor(data => data.EncryptedData)
                .NotEmpty()
                .MaximumLength(7000)
                .WithMessage("El EncryptedData debe ser de máximo 7000 caracteres");
        }
    }
}
