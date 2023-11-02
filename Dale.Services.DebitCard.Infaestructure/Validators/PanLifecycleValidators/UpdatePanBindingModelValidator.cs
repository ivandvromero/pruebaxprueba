using Dale.Services.DebitCard.Domain.Core.ViewModels.PanLifecycle;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Infaestructure.Validators.PanLifecycleValidators
{
    public class UpdatePanBindingModelValidator : AbstractValidator<UpdatePanRequestBindingModel>
    {
        /// <summary>
        /// Validation class UpdatePanRequestBindingModel
        /// </summary>
        public UpdatePanBindingModelValidator()
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

            #region ReplaceCardHolderInfoValidation

            RuleFor(data => data.ReplaceCardholderInfo.primaryAccountNumber)
                .NotEmpty()
                .MaximumLength(19)
                .WithMessage("El PrimaryAccountNumber debe ser de máximo 19 caracteres");

            #endregion

        }
    }
}
