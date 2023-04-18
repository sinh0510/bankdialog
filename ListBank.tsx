import React, { useEffect, useState } from "react";
import { BankInner, ListBankInner, ListBankItem, StyleError } from "./styled/UserCreateAutoFillRequestForm";
import ErrorBoundary from "../../../utils/ErrorBoundary";
import Bank from "../../../models/Bank";
import { UseFormRegister, useForm, Controller, Control } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ParamsEmptyForm } from "../../../services/WithdrawRequestSevice";
export type PersonalBank = {
	id?: number | undefined | null;
	bankName?: string | undefined | null;
	bankCardId?: string | undefined | null;
	bankOwner?: string | undefined | null;
};
export default function ListBank(props: {
	register: UseFormRegister<ParamsEmptyForm>;
	control: Control<ParamsEmptyForm, any>;
	bankInfo: Bank[];
}) {
	return (
		<>
			<Controller
				control={props.control}
				name="bankId"
				render={({ field: { onChange, value } }) => (
					<>
						{props.bankInfo.map((bank) => {
							return (
								<ErrorBoundary key={bank.id}>
									<ListBankItem
										selected={value === bank.id}
										onClick={() => {
											onChange(bank.id);
										}}>
										{bank.bankName} - {bank.bankCardId} - {bank.bankOwner}
									</ListBankItem>
								</ErrorBoundary>
							);
						})}
					</>
				)}
			/>
		</>
	);
}
