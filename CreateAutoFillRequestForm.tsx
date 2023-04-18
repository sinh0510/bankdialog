import React, { useEffect, useState } from "react";
import WithdrawRequest, { FormType } from "../../../models/WithdrawRequest";
import { SmSelectBox } from "../../controls/components/selectBox/SelectBox";
import { useForm, Controller } from "react-hook-form";
import useGetBalance from "../../hooks/useGetBalance";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
	StyleError,
	UserAutoFillFormBankWrap,
	UserAutoFillFormInput,
	UserAutoFillFormInputWrap,
	UserAutoFillFormLabelSurplus,
	UserAutoFillFormSelect,
	UserAutoFillFormSurplusPrice,
	UserAutoFillFormSurplusPriceWrap,
	UserAutoFillFormTextArea,
	UserAutoFillFormWrapper,
} from "./styled/UserCreateAutoFillRequestForm";

import { ParamsEmptyForm } from "../../../services/WithdrawRequestSevice";
import useSubmitForm from "./hook/useSubmitForm";
import ListBank from "./ListBank";
import useGetBank from "../personal/hooks/useBank/useGetBank";

interface Iprops {
	withdrawRequest: WithdrawRequest[];
	withdrawRequestId: number;
	submitRef: any;
	reload: () => void;
	onClose: () => void;
	onchangeDisabled: (value: boolean) => void;
	nameForm: number;
}

export const TypeMoneys = [
	{ value: 1, label: "CNY" },
	{ value: 2, label: "JPY" },
	{ value: 3, label: "VND" },
];

export default function CreateAutoFillRequestForm({
	submitRef,
	reload,
	withdrawRequestId,
	withdrawRequest,
	onClose,
	nameForm,
	onchangeDisabled,
}: Iprops) {
	const yupObj = {
		amount: yup.number().typeError("Vui lòng nhập số tiền").min(0, "Số tiền nhỏ nhất là 0"),
		bankInfo: yup.string().required("Vui lòng chọn ngân hàng"),
		description: yup.string().required("Vui lòng nhập nội dung"),
	};

	const schema = yup.object(yupObj).required();

	const valueWithdrawRequestById = withdrawRequest.filter((val) => val.id === withdrawRequestId);
	const { bankInfo } = useGetBank();

	const {
		register,
		handleSubmit,
		control,
		watch,
		formState: { errors },
	} = useForm<ParamsEmptyForm>({
		defaultValues: {
			currencyId: 1,
		},
		resolver: yupResolver(schema),
	});

	const { totalBalance, pendingBalance } = useGetBalance();

	const { handleSubmitDate, disabled } = useSubmitForm({ onClose, reload, withdrawRequestId });

	useEffect(() => {
		onchangeDisabled(disabled);
	}, [disabled]);

	const onSubmit = (data: ParamsEmptyForm) => {
		handleSubmitDate(data);
	};

	return (
		<UserAutoFillFormWrapper>
			<form onSubmit={handleSubmit(onSubmit)}>
				<UserAutoFillFormSurplusPriceWrap>
					<UserAutoFillFormLabelSurplus>Số dư:</UserAutoFillFormLabelSurplus>
					<UserAutoFillFormSurplusPrice>{totalBalance.toLocaleString("en")} Tệ</UserAutoFillFormSurplusPrice>
					<UserAutoFillFormLabelSurplus>Số dư:</UserAutoFillFormLabelSurplus>
					<UserAutoFillFormSurplusPrice>
						{pendingBalance.toLocaleString("en")} Tệ
					</UserAutoFillFormSurplusPrice>
				</UserAutoFillFormSurplusPriceWrap>

				{/* <UserAutoFillFormLabelSurplus>Loại tiền tệ</UserAutoFillFormLabelSurplus> */}
				{/* <UserAutoFillFormSelect>
					<Controller
						control={control}
						name="currencyId"
						render={({ field: { onChange, value } }) => (
							<SmSelectBox
								options={TypeMoneys}
								value={value}
								onChange={onChange}
							/>
						)}
					/>
				</UserAutoFillFormSelect> */}

				<UserAutoFillFormLabelSurplus>Giá trị cần rút</UserAutoFillFormLabelSurplus>
				<UserAutoFillFormInputWrap>
					<UserAutoFillFormInput
						type="number"
						{...register("amount")}
					/>
					<StyleError>{errors.amount?.message}</StyleError>
				</UserAutoFillFormInputWrap>

				<UserAutoFillFormLabelSurplus>Số tiền quy đổi qua VND</UserAutoFillFormLabelSurplus>
				<UserAutoFillFormInputWrap>
					<UserAutoFillFormInput
						disabled={true}
						type="number"
						value={watch("amount") * 3500}
					/>
				</UserAutoFillFormInputWrap>

				<UserAutoFillFormLabelSurplus>Thông tin ngân hàng</UserAutoFillFormLabelSurplus>
				<UserAutoFillFormInputWrap>
					<UserAutoFillFormBankWrap>
						<ListBank
							register={register}
							bankInfo={bankInfo}
						/>
					</UserAutoFillFormBankWrap>

					{/* <UserAutoFillFormInput {...register("bankInfo")} /> */}
					<StyleError>{errors.bankInfo?.message}</StyleError>
				</UserAutoFillFormInputWrap>
				<button
					ref={submitRef}
					type="submit"
					style={{ display: "none" }}
				/>
			</form>
		</UserAutoFillFormWrapper>
	);
}
