using Dale.Services.DebitCard.Domain.Core.ViewModels.PanLifecycle;
using FluentValidation;

namespace Dale.Services.DebitCard.Infaestructure.Validators.PanLifecycleValidators
{
    public class DeletePanBindingModelValidator : AbstractValidator<DeletePanRequestBindingModel>
    {
        /// <summary>
        /// Validation class DeletePanRequestBindingModel
        /// </summary>
        public DeletePanBindingModelValidator()
        {
            RuleFor(data => data.OperationReason)
                .NotEmpty()
                .MaximumLength(254)
                .WithMessage("El OperationReason debe ser de máximo 254 caracteres");

            #region CardHolderInfoValidation

            RuleFor(data => data.CardholderInfo.primaryAccountNumber)
                .NotEmpty()
                .MaximumLength(19)
                .WithMessage("El PrimaryAccountNumber debe ser de máximo 19 caracteres");

            #endregion
        }
    }
}
