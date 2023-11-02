CREATE PROCEDURE AddTransaction
@UserId VARCHAR(50),
@ApprovalId VARCHAR(10),
@StatusId INT,
@CategoryCode VARCHAR(2),
@TypeCode VARCHAR(2),
@Amount DECIMAL(18,2),
@BankBookId INT,
@SenderFee DECIMAL(18,2),
@RecieverFee DECIMAL(18,2),
@SenderTax DECIMAL(18,2),
@SenderGMF DECIMAL(18,2),
@RecieverTax DECIMAL(18,2),
@RecieverGMF DECIMAL(18,2),
@TransactionCode VARCHAR(8),
@TransactionTagType INT,
@TransactionTagDate DATETIME,
@IVAAmount DECIMAL(18,2),
@GMFAmount DECIMAL(18,2),
@FeeAmount DECIMAL(18,2),
@ResultCode VARCHAR(2),
@AgreementId INT,
@AcquirerBankId VARCHAR(30),
@BranchId VARCHAR(30),
@NextDate DATETIME,
@ClientDate DATETIME,
@AtmWithdrawalRequestId INT,
@RqUID VARCHAR(30),
@OriginalTransactionId INT,
@IsRetract BIT,
@ProductTypeId INT,
@Version TIMESTAMP

AS    
BEGIN

		BEGIN TRY
			BEGIN TRANSACTION DALETRANSACTION
				
				DECLARE 
				@transactionCategory INT,
				@transactionType INT,
				@IsMonitored INT,
				@IdTransaction INT,
				@SenderFeeEnable BIT,
				@RecieverFeeEnable BIT,
				@SenderTaxEnable BIT,
				@SenderGMFEnable BIT,
				@RecieverTaxEnable BIT,
				@RecieverGMFEnable BIT,
				@SenderFeeType INT,
				@RecieverFeeType INT,
				@SenderTaxType INT,
				@SenderGMFType INT,
				@RecieverTaxType INT,
				@RecieverGMFType INT,
				@TransactionTypeCodeId INT,
				@TransactionCodeChild VARCHAR(8),
				@StatusDesc VARCHAR(30),
				@Platform VARCHAR(3),
				@TotalAmount DECIMAL(18,2),
				@TransactionTaxCode VARCHAR(8),
				@TransactionGMFCode VARCHAR(8),
				@TypeBankBook VARCHAR(6),
				@Balance DECIMAL(18,2),
				@SuccessfulStatus INT,
				@ProductBalanceId INT

				SET @IsMonitored = 1
				SET @SenderFeeType = 21
				SET @RecieverFeeType = 22 
				SET @SenderTaxType = 23
				SET @SenderGMFType = 19
				SET @RecieverTaxType = 24
				SET @RecieverGMFType = 20
				SET @Platform = 'Api'
				SET @TotalAmount = @Amount + @IVAAmount + @GMFAmount + @FeeAmount
				SET @TransactionTaxCode = CASE @CategoryCode WHEN '06' THEN CONCAT (@TransactionTaxCode, 'R') ELSE @TransactionTaxCode END
				SET @TransactionGMFCode = CASE @CategoryCode WHEN '06' THEN CONCAT (@TransactionGMFCode, 'R') ELSE @TransactionGMFCode END
				SET @TypeBankBook = 'Credit'
				SELECT @Balance = Balance FROM ProductBalance WHERE UserId = @UserId
				SET @Balance = CASE @CategoryCode WHEN '06' THEN @Balance - @TotalAmount ELSE @Balance + @TotalAmount END				

				SELECT @SuccessfulStatus = Id 
				FROM Status 
				WHERE TypeId IN (SELECT Id 
							     FROM StatusTypes 
								 WHERE Name = 'Transaction Statuses')
				AND Code = '01'

				SET @StatusDesc = CASE @SuccessfulStatus WHEN @StatusId THEN 'Transacci�n fue exitosa.' ELSE 'Transacci�n fue rechazada.' END

				SELECT @transactionCategory = Id 
				FROM TransactionCategories 
				WHERE Code = @CategoryCode

				SELECT @transactionType = Id 
				FROM TransactionTypes 
				WHERE CategoryId = @transactionCategory
				AND Code = @TypeCode

		
				INSERT INTO Transactions  ( Date, 
											DateUtc, 
											UserId, 
											TypeId, 
											Platform, 
											IsBlocked, 
											IsFraud, 
											IsRecieverDespute,
											IsExceeded,
											IsRefunded,
											MachineSecret,
											ToUserId,
											ApprovalId,
											ResultCode,
											PmtId,
											UserSessionId,
											StatusId,
											StatusDesc,
											IsMonitored)
				VALUES (GETDATE(), 
						GETUTCDATE(),
						@UserId,
						@transactionType,
						@Platform,
						0,
						0,
						0,
						0,
						0,
						NULL,
						NULL,
						@ApprovalId,
						@ResultCode,
						NULL,
						NULL,
						@StatusId,
						@StatusDesc,
						@IsMonitored)

				SELECT @IdTransaction = SCOPE_IDENTITY()

				IF(@CategoryCode = '06')
				BEGIN
					SET @TypeBankBook = 'Debit'
					
					UPDATE Transactions SET IsRefunded = 1 WHERE Id = @IdTransaction
					
					INSERT INTO Reverses (TransactionId,
										  UserId,
										  Amount,
										  AcquirerBankId,
										  BranchId,
										  NextDate,
										  NextDateUtc,
										  ClientDate,
										  ClientDateUtc,
										  AtmWithdrawalRequestId,
										  RqUID,
										  OriginalTransactionId,
										  IsRetract)
					VALUES (@IdTransaction,
							@UserId,
							@TotalAmount,
							@AcquirerBankId,
							@BranchId,
							@NextDate,
							DATEADD(HH, -5, @NextDate),
							@ClientDate,
							DATEADD(HH, -5, @ClientDate),
							@AtmWithdrawalRequestId,
							@RqUID,
							@OriginalTransactionId,
							@IsRetract)
				END


				INSERT INTO HandlingFees(TransactionId,
										 AgreementId,
										 Amount,
										 Date,
										 DateUtc)
				VALUES (@IdTransaction,
						@AgreementId,
						@TotalAmount,
						GETDATE(), 
						GETUTCDATE())


				IF(@SuccessfulStatus = @StatusId)
				BEGIN
					
					SELECT @ProductBalanceId = Id FROM ProductBalance WHERE UserId = @UserId

					IF(@ProductBalanceId IS NULL)
					BEGIN
						INSERT INTO ProductBalance (ProductTypeId,
													UserId,
													Balance)
						VALUES (@ProductTypeId,
								@UserId,
								@Balance)
					END
					ELSE
					BEGIN
						UPDATE ProductBalance SET Balance = @Balance WHERE Id = @ProductBalanceId
					END

					INSERT INTO BankBooks ( Date, 
											DateUtc, 
											Type, 
											Amount, 
											Balance, 
											UserId, 
											TransactionId, 
											BankBookId)
					VALUES (GETDATE(), 
							GETUTCDATE(),
							@TypeBankBook,
							@TotalAmount,
							@Balance,
							@UserId,
							@IdTransaction,
							@BankBookId)

					INSERT INTO AdditionalCharges (TransactionId,
												   SenderFee,
												   RecieverFee,
												   SenderTax,
												   SenderGMF,
												   RecieverTax,
												   RecieverGMF)
					VALUES (@IdTransaction,
							@SenderFee,
							@RecieverFee,
							@SenderTax,
							@SenderGMF,
							@RecieverTax,
							@RecieverGMF)

					SELECT  TOP 1 
							@TransactionTypeCodeId = Id,
							@SenderFeeEnable = SenderFeeEnable,
							@RecieverFeeEnable = RecieverFeeEnable,
							@SenderTaxEnable = SenderTaxEnable,
							@SenderGMFEnable = SenderGMFEnable,
							@RecieverTaxEnable = RecieverTaxEnable,
							@RecieverGMFEnable = RecieverGMFEnable
					FROM  TransactionTypeCodes
					WHERE TransactionCode = @TransactionCode


					SELECT  TOP 1 
							@TransactionCodeChild = TransactionCode
					FROM  TransactionTypeCodes 
					WHERE TransactionTypeCodeId = @TransactionTypeCodeId


					INSERT INTO TransactionTags (TransactionCode,
												 Type,
												 TransactionAmount,
												 TransactionId,
												 ClosingDate,
												 ClosingDateUtc)
					VALUES (@TransactionCode,
							@TransactionTagType,
							@Amount,
							@IdTransaction,
							@TransactionTagDate,
							DATEADD(HH, -5, @TransactionTagDate))
		

					IF(@TransactionCodeChild IS NOT NULL)
					BEGIN
						IF(@SenderFeeEnable = 'True')
						BEGIN
							SET @TransactionCodeChild = CASE @CategoryCode WHEN '06' THEN CONCAT (@TransactionCodeChild, 'R') ELSE @TransactionCodeChild END
							INSERT INTO TransactionTags (TransactionCode,
														 Type,
														 TransactionAmount,
														 TransactionId,
														 ClosingDate,
														 ClosingDateUtc)
							VALUES (@TransactionCodeChild,
									@SenderFeeType,
									@FeeAmount,
									@IdTransaction,
									@TransactionTagDate,
									DATEADD(HH, -5, @TransactionTagDate))
						END

						IF(@RecieverFeeEnable = 'True')
						BEGIN
							INSERT INTO TransactionTags (TransactionCode,
														 Type,
														 TransactionAmount,
														 TransactionId,
														 ClosingDate,
														 ClosingDateUtc)
							VALUES (@TransactionCodeChild,
									@RecieverFeeType,
									@FeeAmount,
									@IdTransaction,
									@TransactionTagDate,
									DATEADD(HH, -5, @TransactionTagDate))
						END
					END
		

					IF(@SenderTaxEnable = 'True')
					BEGIN
						INSERT INTO TransactionTags (TransactionCode,
													 Type,
													 TransactionAmount,
													 TransactionId,
													 ClosingDate,
													 ClosingDateUtc)
						VALUES (@TransactionTaxCode,
								@SenderTaxType,
								@IVAAmount,
								@IdTransaction,
								@TransactionTagDate,
								DATEADD(HH, -5, @TransactionTagDate))
					END

					IF(@SenderGMFEnable = 'True')
					BEGIN
						INSERT INTO TransactionTags (TransactionCode,
													 Type,
													 TransactionAmount,
													 TransactionId,
													 ClosingDate,
													 ClosingDateUtc)
						VALUES (@TransactionGMFCode,
								@SenderGMFType,
								@GMFAmount,
								@IdTransaction,
								@TransactionTagDate,
								DATEADD(HH, -5, @TransactionTagDate))
					END

					IF(@RecieverTaxEnable = 'True')
					BEGIN
						INSERT INTO TransactionTags (TransactionCode,
													 Type,
													 TransactionAmount,
													 TransactionId,
													 ClosingDate,
													 ClosingDateUtc)
						VALUES (@TransactionTaxCode,
								@RecieverTaxType,
								@IVAAmount,
								@IdTransaction,
								@TransactionTagDate,
								DATEADD(HH, -5, @TransactionTagDate))
					END

					IF(@RecieverGMFEnable = 'True')
					BEGIN
						INSERT INTO TransactionTags (TransactionCode,
													 Type,
													 TransactionAmount,
													 TransactionId,
													 ClosingDate,
													 ClosingDateUtc)
						VALUES (@TransactionGMFCode,
								@RecieverGMFType,
								@GMFAmount,
								@IdTransaction,
								@TransactionTagDate,
								DATEADD(HH, -5, @TransactionTagDate))
					END
				END

			COMMIT TRANSACTION DALETRANSACTION
		END TRY
		BEGIN CATCH 
		IF (@@TRANCOUNT > 0)
		   BEGIN
			  ROLLBACK TRANSACTION DALETRANSACTION
		   END 
		END CATCH
END

