GO


ALTER PROCEDURE [dbo].[AddTransactionCashBack]
@UserId VARCHAR(50),
@Percentage INT,
@StatusId INT,
@Amount DECIMAL(18,2),
@IVAAmount DECIMAL(18,2),
@GMFAmount DECIMAL(18,2),
@FeeAmount DECIMAL(18,2),
@Apply BIT,
@ClientDate DATETIME,
@ClientMetaDataId INT,
@ApprovalId VARCHAR(10),
@ResultCode VARCHAR(2),
@CategoryCode VARCHAR(4),
@TypeCode VARCHAR(4),
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
@ProductTypeId INT,
@TypeBankBook VARCHAR(6)

AS    
BEGIN

		BEGIN TRY
			BEGIN TRANSACTION DALECASHBACK
				DECLARE 
				@transactionCategory INT,
				@transactionType INT,
				@IsMonitored INT,
				@IdTransaction INT,
				@IdCardCashBackTransaction INT,
				@IdStatusSuccess INT,
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
				@Balance DECIMAL(18,2),
				@ProductBalanceId INT,
				@CodeStatus VARCHAR(3)

				SET @IsMonitored = 1
				SET @SenderFeeType = 21
				SET @RecieverFeeType = 22 
				SET @SenderTaxType = 23
				SET @SenderGMFType = 19
				SET @RecieverTaxType = 24
				SET @RecieverGMFType = 20
				SET @Platform = 'Api'
				SET @TotalAmount = @Amount + @IVAAmount + @GMFAmount + @FeeAmount
				SET @TransactionTaxCode = CASE @CategoryCode WHEN '6' THEN CONCAT (@TransactionTaxCode, 'R') ELSE @TransactionTaxCode END
				SET @TransactionGMFCode = CASE @CategoryCode WHEN '6' THEN CONCAT (@TransactionGMFCode, 'R') ELSE @TransactionGMFCode END
				SELECT @Balance = Balance FROM ProductBalance WHERE UserId = @UserId
				SET @Balance = CASE @TypeBankBook WHEN 'Debit' THEN @Balance - @TotalAmount ELSE @Balance + @TotalAmount END
				

				SELECT @CodeStatus = Code
				FROM Status 
				WHERE Id = @StatusId

				SET @StatusDesc = CASE @CodeStatus 
								  WHEN '1' THEN 'Transaccion fue rechazada.' 
								  WHEN '2' THEN 'Transaccion pendiente.' 
								  WHEN '3' THEN 'Transaccion fue exitosa.' 
								  WHEN '4' THEN 'Transaccion fallida.' 
								  WHEN '5' THEN 'Transaccion cancelada.' 
								  END

				SELECT @transactionCategory = Id 
				FROM TransactionCategories 
				WHERE Code = @CategoryCode

				SELECT @transactionType = Id 
				FROM TransactionTypes 
				WHERE CategoryId = @transactionCategory
				AND Code = @TypeCode

				INSERT INTO [dbo].[CardCashBackTransactions]
					   ([UserId]
					   ,[TotalAmount]
					   ,[TotalDisperse]
					   ,[Percentage]
					   ,[StatusId]
					   ,[Apply]
					   ,[Date]
					   ,[DateUtc]
					   ,[ClientMetaDataId])
				 VALUES
					   (@UserId
					   ,@TotalAmount
					   ,@Amount
					   ,@Percentage
					   ,@StatusId
					   ,@Apply
					   ,@ClientDate
					   ,@ClientDate
					   ,@ClientMetaDataId)

				SELECT @IdCardCashBackTransaction = SCOPE_IDENTITY()

				IF(@CodeStatus = '3' AND @Amount > 0)
				BEGIN
					
					SELECT @IdStatusSuccess = id FROM [Status] WHERE SystemName = 'Success'
					
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
					VALUES (DATEADD(HH, -5, GETUTCDATE()),
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
							@IdStatusSuccess,
							@StatusDesc,
							@IsMonitored)

					SELECT @IdTransaction = SCOPE_IDENTITY()
					
					UPDATE [dbo].[CardCashBackTransactions]
					SET TransactionId = @IdTransaction
					WHERE Id = @IdCardCashBackTransaction

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
						VALUES (DATEADD(HH, -5, GETUTCDATE()), 
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
								DATEADD(HH, 5, @TransactionTagDate))
		

						IF(@TransactionCodeChild IS NOT NULL)
						BEGIN
							IF(@SenderFeeEnable = 'True')
							BEGIN
								SET @TransactionCodeChild = CASE @CategoryCode WHEN '6' THEN CONCAT (@TransactionCodeChild, 'R') ELSE @TransactionCodeChild END
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
										DATEADD(HH, 5, @TransactionTagDate))
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
										DATEADD(HH, 5, @TransactionTagDate))
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
									DATEADD(HH, 5, @TransactionTagDate))
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
									DATEADD(HH, 5, @TransactionTagDate))
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
									DATEADD(HH, 5, @TransactionTagDate))
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
									DATEADD(HH, 5, @TransactionTagDate))
						END

				END

				

			COMMIT TRANSACTION DALECASHBACK
			RETURN 1;
		END TRY
		BEGIN CATCH 
		IF (@@TRANCOUNT > 0)
		   BEGIN
			  ROLLBACK TRANSACTION DALECASHBACK
		   END 
		RETURN 1;
		END CATCH
END
