﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Domain.Core.ViewModels.DebitCard
{
    public class DebitCardRequestBindingModel
    {
        public string CardToken { get; set; }
        public string Observations { get; set; }
    }
}
