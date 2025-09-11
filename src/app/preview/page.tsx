"use client";

import { ArrowLeft, ArrowRight, Calendar, FileText, Receipt, Eye, File, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import type { InvoiceMetadata } from "@/types";
import Viewer from "@/components/Viewer";

export default function PreviewInvoices() {
	const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
	const [invoices, setInvoices] = useState<InvoiceMetadata[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchInvoices = async () => {
			try {
				setLoading(true);
				const response = await fetch('/api/invoices');
				const data = await response.json();
				
				if (data.success) {
					setInvoices(data.invoices);
				} else {
					setError(data.error || 'Failed to load invoices');
				}
			} catch (err) {
				setError('Failed to fetch invoices');
				console.error('Error fetching invoices:', err);
			} finally {
				setLoading(false);
			}
		};

		fetchInvoices();
	}, []);
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
			<div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
				<div className="mb-8">
					<Link
						href="/"
						className="inline-flex items-center text-indigo-600 hover:text-indigo-700 transition-colors"
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Home
					</Link>
				</div>

				<div className="text-center mb-12">
					<h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
						Invoice Collection Preview
					</h1>
					<p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
						{loading ? 'Loading invoices...' : error ? 'Error loading invoices' : `${invoices.length} invoice${invoices.length !== 1 ? 's' : ''} ready for AI processing`}
					</p>
				</div>

				{/* Summary Stats */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
					<div className="bg-white rounded-lg shadow-md p-6 text-center">
						<FileText className="mx-auto h-8 w-8 text-indigo-600 mb-2" />
						<div className="text-2xl font-bold text-gray-900">
							{loading ? '...' : invoices.length}
						</div>
						<div className="text-sm text-gray-600">Total Invoices</div>
					</div>
					<div className="bg-white rounded-lg shadow-md p-6 text-center">
						<File className="mx-auto h-8 w-8 text-red-600 mb-2" />
						<div className="text-2xl font-bold text-gray-900">
							{loading ? '...' : 'PDF'}
						</div>
						<div className="text-sm text-gray-600">File Format</div>
					</div>
					<div className="bg-white rounded-lg shadow-md p-6 text-center">
						<Receipt className="mx-auto h-8 w-8 text-blue-600 mb-2" />
						<div className="text-2xl font-bold text-gray-900">
							{loading ? '...' : invoices.length > 0 ? Math.round(invoices.reduce((sum, inv) => sum + (inv.size || 0), 0) / 1024 / 1024 * 10) / 10 : 0}MB
						</div>
						<div className="text-sm text-gray-600">Total Size</div>
					</div>
					<div className="bg-white rounded-lg shadow-md p-6 text-center">
						<Calendar className="mx-auto h-8 w-8 text-green-600 mb-2" />
						<div className="text-2xl font-bold text-gray-900">
							{loading ? '...' : 'Ready'}
						</div>
						<div className="text-sm text-gray-600">Status</div>
					</div>
				</div>

				{/* Invoice Grid */}
				<div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
					<div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
						<h2 className="text-lg font-semibold text-gray-900">Invoice Documents</h2>
					</div>
					<div className="divide-y divide-gray-200">
						{loading ? (
							<div className="px-6 py-12 text-center">
								<RefreshCw className="h-8 w-8 text-gray-400 animate-spin mx-auto mb-4" />
								<p className="text-gray-500">Loading invoices...</p>
							</div>
						) : error ? (
							<div className="px-6 py-12 text-center">
								<p className="text-red-600 mb-2">Error: {error}</p>
								<p className="text-gray-500">Please check that PDF files are present in /public/documents/invoices/</p>
							</div>
						) : invoices.length === 0 ? (
							<div className="px-6 py-12 text-center">
								<File className="h-12 w-12 text-gray-400 mx-auto mb-4" />
								<p className="text-gray-500">No invoice files found</p>
								<p className="text-sm text-gray-400 mt-1">Add PDF files to /public/documents/invoices/ folder</p>
							</div>
						) : (
							invoices.map((invoice) => (
								<button
									key={invoice.id}
									onClick={() => setSelectedInvoice(invoice.filename)}
									className={`w-full px-6 py-4 hover:bg-gray-50 transition-colors text-left ${
										selectedInvoice === invoice.filename ? 'bg-indigo-50 border-l-4 border-indigo-500' : ''
									}`}
								>
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-4">
											<div className="flex-shrink-0">
												<div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
													selectedInvoice === invoice.filename ? 'bg-red-200' : 'bg-red-100'
												}`}>
													<File className="h-6 w-6 text-red-600" />
												</div>
											</div>
											<div className="flex-1 min-w-0">
												<p className="text-sm font-medium text-gray-900 truncate">
													{invoice.filename}
												</p>
												<p className="text-xs text-gray-500 mt-1">
													{invoice.size ? `${Math.round(invoice.size / 1024 / 1024 * 100) / 100} MB` : 'Unknown size'}
												</p>
											</div>
										</div>
										<div className="flex-shrink-0">
											<Eye className={`h-5 w-5 ${selectedInvoice === invoice.filename ? 'text-indigo-600' : 'text-gray-400'}`} />
										</div>
									</div>
								</button>
							))
						)}
					</div>
				</div>

				{/* Document Preview Section */}
				{selectedInvoice && (
					<div className="bg-white rounded-lg shadow-md mb-8 overflow-hidden">
						<div className="bg-gray-50 px-6 py-4 border-b">
							<h2 className="text-lg font-semibold text-gray-900">
								Document Preview: {selectedInvoice}
							</h2>
							<p className="text-sm text-gray-600 mt-1">
								Click and interact with the invoice to examine its contents before processing
							</p>
						</div>
						<Viewer
							document={`/documents/invoices/${selectedInvoice}`}
							toolbarItems={[
								{ type: "zoom-out" },
								{ type: "zoom-in" },
								{ type: "zoom-mode" },
								{ type: "search" },
							]}
						/>
					</div>
				)}

				{/* Action Button */}
				{!loading && !error && invoices.length > 0 && (
					<div className="text-center">
						<Link
							href="/results"
							className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
						>
							Process All Invoices ({invoices.length})
							<ArrowRight className="ml-2 h-5 w-5" />
						</Link>
					</div>
				)}

				<div className="mt-16 text-center text-sm text-gray-500">
					<p>Nutrient AI Document Processing SDK (formerly XtractFlow)</p>
				</div>
			</div>
		</div>
	);
}