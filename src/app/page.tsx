import { ArrowRight, CheckCircle, FileText, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
			<div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
				<div className="text-center">
					<h1 className="text-3xl font-bold text-gray-900 sm:text-5xl md:text-3xl">
						<span className="block">Nutrient AI Document Processing</span>
						Invoice Management System
					</h1>
					<p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
						Experience AI-powered document classification and data extraction
						for invoices. Process your invoice collection and watch as our
						advanced technology automatically extracts and validates key
						information.
					</p>
				</div>

				<div className="mt-16 grid md:grid-cols-3 gap-8">
					<div className="bg-white rounded-lg shadow-md p-6 text-center">
						<FileText className="mx-auto h-12 w-12 text-indigo-600 mb-4" />
						<h3 className="text-lg font-semibold text-gray-900 mb-2">
							Smart Invoice Recognition
						</h3>
						<p className="text-gray-600">
							Automatically identifies and classifies invoices, receipts,
							purchase orders, and utility bills.
						</p>
					</div>

					<div className="bg-white rounded-lg shadow-md p-6 text-center">
						<Zap className="mx-auto h-12 w-12 text-indigo-600 mb-4" />
						<h3 className="text-lg font-semibold text-gray-900 mb-2">
							Instant Data Extraction
						</h3>
						<p className="text-gray-600">
							Extracts key information like vendor details, amounts, dates,
							and line items in seconds.
						</p>
					</div>

					<div className="bg-white rounded-lg shadow-md p-6 text-center">
						<CheckCircle className="mx-auto h-12 w-12 text-indigo-600 mb-4" />
						<h3 className="text-lg font-semibold text-gray-900 mb-2">
							Built-in Validation
						</h3>
						<p className="text-gray-600">
							Validates extracted data for accuracy and completeness, ensuring
							reliable invoice processing.
						</p>
					</div>
				</div>

				<div className="mt-16 text-center">
					<Link
						href="/preview"
						className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
					>
						Preview Invoice Collection
						<ArrowRight className="ml-2 h-5 w-5" />
					</Link>
				</div>

				<div className="mt-12 text-center text-sm text-gray-500">
					<p>
						This is a proof-of-concept demonstration of the Nutrient AI Document
						Processing API capabilities.
					</p>
					<p className="mt-2">
						Nutrient AI Document Processing SDK (formerly known as XtractFlow)
					</p>
				</div>
			</div>
		</div>
	);
}
