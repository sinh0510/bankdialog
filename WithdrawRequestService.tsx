import axios from "axios";
import { DefaultModel } from "../models/IModel";
import WithdrawRequest, { WithdrawRequestCount } from "../models/WithdrawRequest";
import http from "./http";
import { CurrencyIds } from "../models/Transaction";

export interface ParamsEmptyForm {
	bankId: number;
	currencyId: number;
	amount: number;
	description: string;
	bankInfo: string;
}

const getWithdrawRequest = async (params: { limit: number; skip: number; appSecret: number }) => {
	let query: any = {
		limit: params.limit,
		skip: params.skip,
		where: JSON.stringify({ currencyId: CurrencyIds.CNY }),
	};

	const { data } = await http.get(`/withdraw-request?${new URLSearchParams(query).toString()}`);

	return DefaultModel.parseList<WithdrawRequest>(data, () => new WithdrawRequest());
};

const getcountWithdrawRequest = async () => {
	let where = {
		where: JSON.stringify({ currencyId: CurrencyIds.CNY }),
	};

	const { data } = await http.get(`/withdraw-request-count?${new URLSearchParams(where).toString()}`);
	return { count: data?.count } as WithdrawRequestCount;
};

const getOpenWithdrawRequest = async (id: number) => {
	const { data } = await http.get<WithdrawRequest>(`/withdraw-request/${id}`);
	return new WithdrawRequest().parse(data);
};

const postOpenWithdrawRequest = async (params: ParamsEmptyForm, id: number) => {
	const { data } = await http.post(`/withdraw-request`, params);
	return data;
};

const withdrawRequestCancel = async (id: number) => {
	const { data } = await http.patch(`/withdraw-request/${id}/cancel`);
	return data;
};

const WithdrawRequestService = {
	getWithdrawRequest,
	getcountWithdrawRequest,
	getOpenWithdrawRequest,
	withdrawRequestCancel,
	postOpenWithdrawRequest,
};

export default WithdrawRequestService;
