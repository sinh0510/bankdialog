import React, { useEffect, useState } from "react";
import { BankInner, ListBankInner, ListBankItem, StyleError } from "./styled/UserCreateAutoFillRequestForm";
import ErrorBoundary from "../../../utils/ErrorBoundary";
import Bank from "../../../models/Bank";
import { UseFormRegister, useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ParamsEmptyForm } from "../../../services/BankService";
export type PersonalBank = {
	id?: number | undefined | null;
	bankName?: string | undefined | null;
	bankCardId?: string | undefined | null;
	bankOwner?: string | undefined | null;
};
export default function ListBank(props: {
	register: UseFormRegister<{
		currencyId: number;
		amount: number;
		bankInfo: string;
		description: string;
	}>;
	bankReturnValue: string;
	setBankReturnValue: (value: string) => void;
	bankInfo: Bank[];
}) {
	const [inputBank, setInputBank] = useState<PersonalBank>({});
	const [selectedBank, setSelectedBank] = useState<Bank>();
	const schema = yup.object().shape({
		id: yup.number().positive("Vui lòng chọn ngân hàng").required("Vui lòng chọn ngân hàng"),
	  });
	const {
		
		handleSubmit,
		formState: { errors },
		control,
	} = useForm<{
		id: number;
		bankName: string;
		bankCardId: string;
		bankOwner: string;
	}>({
		defaultValues: {
			id: inputBank.id || 0,
			bankName: inputBank.bankName || "",
			bankCardId: inputBank.bankCardId || "",
			bankOwner: inputBank.bankOwner || "",
		  },
		resolver: yupResolver(schema),
	});
	const onConfirm = async (data: ParamsEmptyForm) => {
		const selectedBank = props.bankInfo.find((bank) => bank.id === data.id);
		setSelectedBank(selectedBank);
	  
		if (selectedBank) {
		  const bankInfo = {
			id: selectedBank.id || 0,
			bankName: selectedBank.bankName || '',
			bankCardId: selectedBank.bankCardId || '',
			bankOwner: selectedBank.bankOwner || '',
		  };
		  
		  setInputBank(bankInfo);
		
		  const bankReturn= (`${bankInfo.bankName} - ${bankInfo.bankCardId} - ${bankInfo.bankOwner}`);
		  props.setBankReturnValue(bankReturn)
		}
	  };
//
	return (
		<>
		<Controller
			control={control}
			name="id"
			render={({ field: { onChange, value } }) => (
				<>
					{props.bankInfo.map((bank) => {
						return (
							<ErrorBoundary key={bank.id}>
								<ListBankItem
									selected={value === bank.id}
									onClick={() => {
										onChange(bank.id);
										handleSubmit(onConfirm)();
									  }}>
									{bank.bankName} - {bank.bankCardId} - {bank.bankOwner}
								</ListBankItem>
							</ErrorBoundary>
						);
					})}
					<StyleError>{errors.id?.message}</StyleError>
				</>
			)}
		/>
		</>
	);
}
