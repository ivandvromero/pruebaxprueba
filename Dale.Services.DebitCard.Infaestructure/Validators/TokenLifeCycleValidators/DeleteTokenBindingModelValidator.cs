using Dale.Services.DebitCard.Domain.Core.ViewModels.TokenLifeCycle;
using FluentValidation;

namespace Dale.Services.DebitCard.Infaestructure.Validators.TokenLifeCycleValidators
{
    public class DeleteTokenBindingModelValidator : AbstractValidator<TokenLifeCycleRequestBindingModel>
    {
        /// <summary>
        /// Validation class DeleteTokenRequestBindingModel
        /// </summary>
        public DeleteTokenBindingModelValidator()
        {

            RuleFor(data => data.OperationReason)
                .NotEmpty()
                .MaximumLength(254)
                .WithMessage("El OperationReason debe ser de máximo 254 caracteres");

            RuleFor(data => data.UserId)
                 .NotEmpty()
                 .MaximumLength(254)
                 .WithMessage("El UserId debe ser de máximo 254 caracteres");
        }
    }
}
