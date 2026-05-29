"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
	DollarSign,
	TrendingUp,
	ArrowUpRight,
	ArrowDownRight,
	CheckCircle,
	Clock,
	Eye,
	EyeOff,
} from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { CurrencyIcon } from "@/components/shared/currency-icon";
import { ToastStack } from "@/components/shared/toast-stack";
import {
	mapPayoutToUiTransaction,
	mapWalletToDashboardBalance,
} from "@/lib/backend-mappers";
import { vaxenApi } from "@/lib/vaxen-api";
import {
	formatStatusLabel,
} from "@/lib/formatters";
import { useToastStack } from "@/lib/use-toast-stack";

// Mock data
const fallbackBalances = [
	{
		currency: "USD",
		amount: "300,000.00",
		change: "+2.5%",
		changeType: "positive",
		symbol: "$",
		flag: "🇺🇸",
		name: "US Dollar",
	},
	{
		currency: "EUR",
		amount: "191,250.00",
		change: "-1.2%",
		changeType: "negative",
		symbol: "€",
		flag: "🇪🇺",
		name: "Euro",
	},
	{
		currency: "GBP",
		amount: "118,500.00",
		change: "+0.8%",
		changeType: "positive",
		symbol: "£",
		flag: "🇬🇧",
		name: "British Pound",
	},
	{
		currency: "BRL",
		amount: "375,000.00",
		change: "+1.5%",
		changeType: "positive",
		symbol: "R$",
		flag: "🇧🇷",
		name: "Brazilian Real",
	},
];

const fallbackTransactions = [
	{
		id: "1",
		type: "conversion",
		amount: "5,000.00",
		currency: "USD",
		description: "USD to EUR conversion",
		status: "completed",
		date: "2024-01-15T10:30:00Z",
	},
	{
		id: "2",
		type: "payout",
		amount: "2,500.00",
		currency: "EUR",
		description: "Payment to supplier",
		status: "processing",
		date: "2024-01-15T09:15:00Z",
	},
	{
		id: "3",
		type: "deposit",
		amount: "10,000.00",
		currency: "USD",
		description: "Wire transfer received",
		status: "completed",
		date: "2024-01-14T16:45:00Z",
	},
];

export default function DashboardPage() {
	const router = useRouter();
	const { toasts, addToast, removeToast } = useToastStack();
	const [showBalances, setShowBalances] = useState(true);
	const [balances, setBalances] = useState(fallbackBalances);
	const [transactions, setTransactions] = useState(fallbackTransactions);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadDashboard = async () => {
			try {
				const [walletsResponse, payoutsResponse] = await Promise.all([
					vaxenApi.wallets.list(),
					vaxenApi.payouts.list(),
				]);

				const mappedBalances = walletsResponse.data
					.slice(0, 8)
					.map(mapWalletToDashboardBalance);

				const mappedTransactions = payoutsResponse.data
					.slice(0, 6)
					.map(mapPayoutToUiTransaction);

				if (mappedBalances.length > 0) {
					setBalances(mappedBalances);
				}

				if (mappedTransactions.length > 0) {
					setTransactions(mappedTransactions);
				}
			} catch {
				setBalances(fallbackBalances);
				setTransactions(fallbackTransactions);
				addToast(
					"error",
					"Unable to load dashboard data. Showing fallback values.",
				);
			} finally {
				setLoading(false);
			}
		};

		loadDashboard();
	}, [addToast]);

	const totalBalance = balances.reduce((sum, balance) => {
		const value = Number(balance.amount.replace(/,/g, ""));
		return sum + (Number.isNaN(value) ? 0 : value);
	}, 0);

	return (
		<AppLayout currentPage="Dashboard">
			<div className="space-y-8">
				<div>
					<h1 className="text-2xl font-bold text-white">Dashboard</h1>
					<p className="text-sm text-slate-300 mt-2">
						Welcome back! Here's an overview of your treasury operations.
					</p>
					{loading && (
						<p className="text-xs text-slate-400 mt-2">
							Loading dashboard data...
						</p>
					)}
				</div>

				{/* Total Balance Card */}
				<div className="p-6 gradient-primary text-white rounded-lg shadow-2xl pattern-overlay-blur pattern-bg-5">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3">
							<div>
								<p className="text-sm font-medium opacity-90">TOTAL BALANCE</p>
								<p className="text-3xl font-bold mt-1">
									{showBalances
										? `$${totalBalance.toLocaleString("en-US", {
												minimumFractionDigits: 2,
												maximumFractionDigits: 2,
											})}`
										: "••••••"}
								</p>
							</div>
							<button
								onClick={() => setShowBalances(!showBalances)}
								className="p-2 bg-white/20 text-white rounded-md hover:bg-white/30 transition-colors"
								title={showBalances ? "Hide balances" : "Show balances"}
							>
								{showBalances ? (
									<Eye className="h-4 w-4" />
								) : (
									<EyeOff className="h-4 w-4" />
								)}
							</button>
						</div>
						<div className="flex items-center space-x-2">
							<button
								onClick={() => router.push("/en/wallets")}
								className="px-4 py-2 bg-white/20 text-white text-sm rounded-md hover:bg-white/30 transition-colors"
							>
								VIEW WALLET
							</button>
							<button className="p-2 bg-white/20 text-white rounded-md hover:bg-white/30 transition-colors">
								<TrendingUp className="h-4 w-4" />
							</button>
						</div>
					</div>
				</div>

				{/* Balance Cards */}
				<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
					{balances.map(balance => (
						<div
							key={balance.currency}
							className="p-3 gradient-card border border-slate-600 rounded-lg"
						>
							<div className="flex items-center justify-between mb-2">
								<CurrencyIcon currency={balance.currency} className="w-6 h-6" />
							</div>

							<div className="mb-2">
								<p className="text-sm font-bold text-white">
									{showBalances
										? `${balance.symbol}${balance.amount}`
										: "••••••"}
								</p>
								<p className="text-xs text-slate-300">{balance.currency}</p>
							</div>

							<div className="flex items-center justify-between">
								{showBalances && (
									<div className="flex items-center text-xs">
										{balance.changeType === "positive" ? (
											<ArrowUpRight className="h-3 w-3 text-green-400 mr-1" />
										) : (
											<ArrowDownRight className="h-3 w-3 text-red-400 mr-1" />
										)}
										<span
											className={
												balance.changeType === "positive"
													? "text-green-400"
													: "text-red-400"
											}
										>
											{balance.change}
										</span>
									</div>
								)}
							</div>
						</div>
					))}
				</div>

				{/* Quick Actions */}
				<div className="p-6 gradient-card border border-slate-600 rounded-lg pattern-overlay pattern-bg-6">
					<h3 className="text-lg font-semibold text-white mb-6">
						Quick Actions
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<button className="h-20 flex flex-col items-center justify-center space-y-2 gradient-primary text-white rounded-lg hover:opacity-90 transition-all shadow-lg">
							<TrendingUp className="h-6 w-6" />
							<span className="text-sm">Convert Currency</span>
						</button>
						<button className="h-20 flex flex-col items-center justify-center space-y-2 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors text-white">
							<ArrowUpRight className="h-6 w-6" />
							<span className="text-sm">Send Money</span>
						</button>
						<button className="h-20 flex flex-col items-center justify-center space-y-2 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors text-white">
							<DollarSign className="h-6 w-6" />
							<span className="text-sm">View Reports</span>
						</button>
					</div>
				</div>

				{/* Recent Transactions */}
				<div className="p-6 gradient-card border border-slate-600 rounded-lg pattern-overlay pattern-bg-7">
					<h3 className="text-lg font-semibold text-white mb-6">
						Recent Transactions
					</h3>
					<div className="space-y-4">
						{transactions.map(transaction => (
							<div
								key={transaction.id}
								className="flex items-center justify-between p-4 border border-slate-600 rounded-lg bg-slate-800/50"
							>
								<div className="flex items-center space-x-4">
									<div className="flex-shrink-0">
										{transaction.type === "conversion" && (
											<TrendingUp className="h-5 w-5 text-blue-400" />
										)}
										{transaction.type === "payout" && (
											<ArrowUpRight className="h-5 w-5 text-orange-400" />
										)}
										{transaction.type === "deposit" && (
											<ArrowDownRight className="h-5 w-5 text-green-400" />
										)}
									</div>
									<div>
										<p className="text-sm font-medium text-white">
											{transaction.description}
										</p>
										<p className="text-sm text-slate-300">
											{new Date(transaction.date).toLocaleDateString("en-US", {
												year: "numeric",
												month: "short",
												day: "numeric",
											})}
										</p>
									</div>
								</div>
								<div className="text-right">
									<p className="text-sm font-medium text-white">
										{showBalances
											? `${transaction.amount} ${transaction.currency}`
											: "••••••"}
									</p>
									<div className="flex items-center space-x-1 mt-1">
										{transaction.status === "completed" ? (
											<CheckCircle className="h-4 w-4 text-green-400" />
										) : (
											<Clock className="h-4 w-4 text-orange-400" />
										)}
										<span className="text-sm text-slate-300">
											{formatStatusLabel(transaction.status)}
										</span>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
			<ToastStack toasts={toasts} onDismiss={removeToast} />
		</AppLayout>
	);
}
