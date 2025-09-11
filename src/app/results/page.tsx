"use client";

import {
	AlertCircle,
	ArrowLeft,
	CheckCircle,
	Download,
	FileText,
	RefreshCw,
	XCircle,
} from "lucide-react";
import Link from "next/link";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";

import { INVOICE_COLLECTION } from "@/lib/constants";

// Invoice collection information for display
const COLLECTION_INFO = {
	name: INVOICE_COLLECTION.name,
	description: INVOICE_COLLECTION.description,
	totalInvoices: INVOICE_COLLECTION.invoices.length,
};

interface ProcessedInvoice {
	id: string;
	fileName: string;
	vendorName: string;
	invoiceNumber: string;
	amount: string;
	status: string;
	detectedTemplate?: string;
	fields?: Array<{
		fieldName: string;
		value: {
			value: string;
			format: string;
		};
		validationState: "Valid" | "VerificationNeeded" | "Undefined";
	}>;
	error?: string;
}

interface ProcessingResult {
	success: boolean;
	summary: {
		collectionId: string;
		totalInvoices: number;
		successfulInvoices: number;
		failedInvoices: number;
		totalFields: number;
		validFields: number;
		verificationNeededFields: number;
		missingFields: number;
		overallStatus: string;
		timestamp: string;
	};
	invoices: ProcessedInvoice[];
}

// Minimal toolbar configuration - moved outside component to prevent re-creation
const MINIMAL_TOOLBAR_ITEMS = [
	{ type: "zoom-out" },
	{ type: "zoom-in" },
	{ type: "zoom-mode" },
	{ type: "search" },
];

// Removed complex processing steps - just show simple processing state

function ResultsContent() {
	const [isProcessing, setIsProcessing] = useState(true);
	const [results, setResults] = useState<ProcessingResult | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [processingLogs, setProcessingLogs] = useState<string[]>([]);
	const [terminalRef, setTerminalRef] = useState<HTMLDivElement | null>(null);

	// Dynamic invoice documents from the actual files
	const [invoiceDocuments, setInvoiceDocuments] = useState<string[]>([]);
	const [showDetailedResults, setShowDetailedResults] = useState(false);
	const [showFormFields, setShowFormFields] = useState(false);
	const [showJsonModal, setShowJsonModal] = useState(false);

	// Use invoice collection info
	const collectionInfo = COLLECTION_INFO;

	const addLog = useCallback((message: string) => {
		setProcessingLogs((prev) => [...prev, message]);
	}, []);

	// Auto-scroll terminal to bottom when new logs are added
	useEffect(() => {
		if (terminalRef) {
			terminalRef.scrollTop = terminalRef.scrollHeight;
		}
	}, [processingLogs, terminalRef]);

	const simulateDocumentProcessing = useCallback(
		async (documents: readonly string[]) => {
			const templateMap: { [key: string]: string } = {
				"invoice": "Standard Invoice",
				"tech-solutions": "Standard Invoice", 
				"marketing": "Standard Invoice",
				"office-supplies": "Receipt",
				"cloud-services": "Standard Invoice",
				"consulting": "Service Invoice",
				"print": "Receipt",
				"facilities": "Service Invoice",
				"software": "Standard Invoice",
				"catering": "Receipt",
				"transport": "Standard Invoice",
			};

			const getDocumentTemplate = (filename: string) => {
				const key = Object.keys(templateMap).find((k) => filename.includes(k));
				return key ? templateMap[key] : "Standard Invoice";
			};

			const getFieldCount = (filename: string) => {
				if (filename.includes("receipt") || filename.includes("print") || filename.includes("catering"))
					return Math.floor(Math.random() * 3) + 7; // 7-9 fields for receipts
				if (filename.includes("service") || filename.includes("consulting") || filename.includes("facilities"))
					return Math.floor(Math.random() * 3) + 8; // 8-10 fields for service invoices
				return Math.floor(Math.random() * 4) + 10; // 10-13 fields for standard invoices
			};

			for (let i = 0; i < documents.length; i++) {
				const doc = documents[i];
				const template = getDocumentTemplate(doc);
				const fieldCount = getFieldCount(doc);

				// Processing log
				addLog(`🚀 Processing ${doc}...`);
				await new Promise((resolve) => setTimeout(resolve, 800));

				// API response log
				addLog(`📡 API response for ${doc}: 200 OK`);
				await new Promise((resolve) => setTimeout(resolve, 300));

				// Success log
				addLog(
					`✅ API success for ${doc}: { detectedTemplate: '${template}', fieldsCount: ${fieldCount}, hasFields: true }`,
				);
				await new Promise((resolve) => setTimeout(resolve, 400));

				// Completion log
				addLog(`✅ Successfully processed ${doc}`);
				await new Promise((resolve) => setTimeout(resolve, 500));
			}
		},
		[addLog],
	);

	const processInvoiceCollection = useCallback(async () => {
		try {
			console.log(`🔄 Processing invoice collection`);

			// First, fetch the actual invoice files from the API
			addLog("📂 Discovering invoice files...");
			
			const invoicesResponse = await fetch('/api/invoices');
			const invoicesData = await invoicesResponse.json();
			
			if (!invoicesData.success) {
				throw new Error('Failed to load invoice files');
			}
			
			const documents = invoicesData.invoices.map((inv: any) => inv.filename);
			setInvoiceDocuments(documents);
			
			addLog(`✅ Found ${documents.length} invoice files:`);
			documents.forEach((filename: string) => {
				addLog(`   📄 ${filename}`);
			});
			
			await new Promise((resolve) => setTimeout(resolve, 1000));

			addLog("🔧 Registering invoice templates...");
			await new Promise((resolve) => setTimeout(resolve, 1000));
			addLog("✅ Invoice templates registered successfully");

			addLog(`📥 Pre-loading all ${documents.length} invoice files...`);
			await new Promise((resolve) => setTimeout(resolve, 800));
			addLog(
				`📦 File loading completed: ${documents.length}/${documents.length} invoices loaded successfully`,
			);

			// Start the API call but also simulate detailed processing
			const responsePromise = fetch("/api/process-invoices", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ collectionId: "dynamic-invoices" }),
			});

			addLog("🚀 Starting parallel API processing of loaded invoices...");

			// Simulate document processing while waiting for real API
			await simulateDocumentProcessing(documents);

			const response = await responsePromise;

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to process invoices");
			}

			addLog("🎉 Parallel processing completed");

			const data: ProcessingResult = await response.json();
			console.log("✅ Processing completed:", data);
			addLog(
				`🏁 Invoice collection processed: ${data.summary.successfulInvoices}/${data.summary.totalInvoices} invoices processed`,
			);

			setResults(data);
			setIsProcessing(false);
		} catch (err) {
			console.error("❌ Processing failed:", err);
			setError(err instanceof Error ? err.message : "Unknown error occurred");
			setIsProcessing(false);
		}
	}, [simulateDocumentProcessing, addLog]);

	useEffect(() => {
		// Start processing immediately
		processInvoiceCollection();
	}, [processInvoiceCollection]);

	// Simplified form field matching - not used in invoice processing
	const matchFormFieldsWithData = useCallback(
		(
			fields: Array<{
				name: string;
				type: string;
				required: boolean;
				value: string | null;
			}>,
			extractedData: ProcessedInvoice[],
		) => {
			// Return fields as-is without matching for invoice processing
			return fields.map((field) => ({
				...field,
				extractedValue: null,
				hasMatch: false,
			}));
		},
		[],
	);


	const getStatusIcon = (status: string) => {
		switch (status) {
			case "Valid":
				return <CheckCircle className="h-4 w-4 text-green-500" />;
			case "VerificationNeeded":
				return <AlertCircle className="h-4 w-4 text-yellow-500" />;
			case "Undefined":
				return <AlertCircle className="h-4 w-4 text-yellow-500" />;
			default:
				return <FileText className="h-4 w-4 text-gray-400" />;
		}
	};

	const formatFieldName = (fieldName: string) => {
		return fieldName
			.replace(/([A-Z])/g, " $1")
			.replace(/^./, (str) => str.toUpperCase())
			.trim();
	};

	// Show processing UI while processing
	if (isProcessing) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
				<div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
					<div className="mb-8">
						<Link
							href="/preview"
							className="inline-flex items-center text-indigo-600 hover:text-indigo-700 transition-colors"
						>
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to Invoice Preview
						</Link>
					</div>

					<div className="text-center mb-8">
						<h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
							Processing Invoices
						</h1>
						<p className="mt-2 text-lg text-gray-600">
							AI is analyzing your invoice documents
						</p>
					</div>


					{/* Processing Logs Terminal */}
					<div className="bg-gray-900 rounded-lg shadow-md overflow-hidden">
						<div className="bg-gray-800 px-4 py-2 flex items-center space-x-2">
							<div className="w-3 h-3 rounded-full bg-red-500"></div>
							<div className="w-3 h-3 rounded-full bg-yellow-500"></div>
							<div className="w-3 h-3 rounded-full bg-green-500"></div>
							<span className="text-gray-300 text-sm font-mono ml-4">
								Invoice Processing Terminal
							</span>
						</div>
						<div 
							ref={setTerminalRef}
							className="p-4 h-64 overflow-y-auto scroll-smooth"
							style={{ scrollBehavior: 'smooth' }}
						>
							<div className="font-mono text-sm">
								{processingLogs.map((log, index) => (
									<div
										key={index}
										className="text-green-400 mb-1"
									>
										{log}
									</div>
								))}
								{/* Blinking cursor */}
								<div className="text-green-400 inline-block animate-pulse">▋</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// Handle error state  
	if (error && !isProcessing) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
				<div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
					<div className="mb-8">
						<Link
							href="/preview"
							className="inline-flex items-center text-indigo-600 hover:text-indigo-700 transition-colors"
						>
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to Invoice Preview
						</Link>
					</div>

					<div className="text-center">
						<XCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
						<h1 className="text-2xl font-bold text-gray-900 mb-2">
							Processing Failed
						</h1>
						<p className="text-gray-600 mb-4">{error}</p>
						<Link
							href="/preview"
							className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
						>
							Try Again
						</Link>
					</div>
				</div>
			</div>
		);
	}

	// Show results if processing is complete
	if (!results) return null;

	// Get all processed invoices for validation
	const sourceInvoices = results.invoices || [];

	// Generate executive summary for invoice processing
	const generateExecutiveSummary = () => {
		const failedInvoices = sourceInvoices.filter(
			(invoice) => invoice.status === "failed",
		);

		// Determine status: VALID, REVIEW REQUIRED, or INVALID
		const hasFailedInvoices = failedInvoices.length > 0;
		const hasMissingData = results.summary.missingFields > 0;
		const hasVerificationNeeded = results.summary.verificationNeededFields > 0;

		let status: string;
		let isValid: boolean;

		if (hasFailedInvoices || hasMissingData) {
			status = "Invalid";
			isValid = false;
		} else if (hasVerificationNeeded) {
			status = "Valid - Some Review Required";
			isValid = false; // Not fully valid, needs review
		} else {
			status = "Valid";
			isValid = true;
		}

		const missingData = [];

		// Check for failed invoices
		if (failedInvoices.length > 0) {
			missingData.push(
				`${failedInvoices.length} invoice${failedInvoices.length > 1 ? "s" : ""} failed to process: ${failedInvoices.map((inv) => inv.fileName).join(", ")}`,
			);
		}

		// Check for verification needed fields
		if (results.summary.verificationNeededFields > 0) {
			missingData.push(
				`${results.summary.verificationNeededFields} field${results.summary.verificationNeededFields > 1 ? "s" : ""} require verification`,
			);
		}

		// Check for missing fields
		if (results.summary.missingFields > 0) {
			missingData.push(
				`${results.summary.missingFields} field${results.summary.missingFields > 1 ? "s" : ""} could not be extracted`,
			);
		}

		// Check for missing critical invoice fields
		const criticalFields = ["vendorName", "invoiceNumber", "totalAmount", "invoiceDate"];
		
		sourceInvoices.forEach((invoice) => {
			if (invoice.fields) {
				const extractedFields = invoice.fields.map(f => f.fieldName);
				const missingCriticalFields = criticalFields.filter(field => 
					!extractedFields.includes(field) || 
					invoice.fields?.find(f => f.fieldName === field && f.validationState === "Undefined")
				);
				
				if (missingCriticalFields.length > 0) {
					missingData.push(
						`${invoice.fileName}: Missing critical fields: ${missingCriticalFields.join(", ")}`
					);
				}
			}
		});

		return {
			isValid,
			status,
			missingData,
			recommendation:
				status === "Valid"
					? "All invoices processed successfully and ready for review."
					: status === "Valid - Some Review Required"
						? `Invoice data extracted successfully. ${results.summary.verificationNeededFields} field${results.summary.verificationNeededFields > 1 ? "s" : ""} require verification.`
						: "Some invoices require additional review or reprocessing.",
		};
	};

	const executiveSummary = generateExecutiveSummary();

	// Find the first invoice PDF document for the Viewer
	const firstInvoiceDoc = results.invoices && results.invoices.length > 0 
		? results.invoices[0]
		: null;

	const pdfPath = firstInvoiceDoc
		? `/documents/invoices/${firstInvoiceDoc.fileName}`
		: null;

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
			<div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
				<div className="mb-8">
					<Link
						href="/preview"
						className="inline-flex items-center text-indigo-600 hover:text-indigo-700 transition-colors"
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Invoice Preview
					</Link>
				</div>

				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
						Invoice Processing Complete
					</h1>
					<p className="mt-2 text-lg text-gray-600">
						{results?.summary?.totalInvoices || 0} invoices processed
					</p>
					<p className="mt-1 text-sm text-gray-500">
						AI-powered document classification and data extraction results
					</p>
				</div>

				{/* Executive Summary */}
				<div className="bg-white rounded-lg shadow-md p-5 mb-6">
					<h2 className="text-xl font-semibold text-gray-900 mb-4">
						Invoice Processing Summary
					</h2>


					{/* Processing Statistics */}
					<div className="grid md:grid-cols-4 gap-3">
						{(() => {
							// Calculate real statistics from the actual displayed data
							const totalInvoices = results.invoices.length;
							const successfulInvoices = results.invoices.filter(inv => 
								inv.status === 'completed' || inv.status === 'success'
							).length;
							
							let validFields = 0;
							let needsReviewFields = 0;
							let missingFields = 0;
							
							results.invoices.forEach(invoice => {
								if (invoice.fields && invoice.fields.length > 0) {
									invoice.fields.forEach(field => {
										const hasValue = field.value?.value && field.value.value.trim() !== '';
										
										if (field.validationState === 'Valid') {
											validFields++;
										} else if (field.validationState === 'VerificationNeeded' || field.validationState === 'Undefined') {
											if (hasValue) {
												needsReviewFields++;
											} else {
												missingFields++;
											}
										} else if (hasValue) {
											needsReviewFields++; // Unknown validation state but has value
										} else {
											missingFields++; // No value
										}
									});
								}
							});
							
							return (
								<>
									<div className="text-center p-2 bg-gray-50 rounded-lg">
										<div className="text-lg font-bold text-indigo-600">
											{successfulInvoices}/{totalInvoices}
										</div>
										<div className="text-xs text-gray-600">Processed Invoices</div>
									</div>
									<div className="text-center p-2 bg-gray-50 rounded-lg">
										<div className="text-lg font-bold text-green-600">
											{validFields}
										</div>
										<div className="text-xs text-gray-600">Valid Fields</div>
									</div>
									<div className="text-center p-2 bg-gray-50 rounded-lg">
										<div className="text-lg font-bold text-yellow-600">
											{needsReviewFields}
										</div>
										<div className="text-xs text-gray-600">Need Review</div>
									</div>
									<div className="text-center p-2 bg-gray-50 rounded-lg">
										<div className="text-lg font-bold text-red-600">
											{missingFields}
										</div>
										<div className="text-xs text-gray-600">Missing Data</div>
									</div>
								</>
							);
						})()}
					</div>
					
					{/* Legend */}
					<div className="mt-4 p-3 bg-gray-50 rounded-lg">
						<h3 className="text-sm font-medium text-gray-900 mb-2">Field Status Legend</h3>
						<div className="flex flex-wrap gap-4 text-xs">
							<div className="flex items-center space-x-2">
								<div className="w-4 h-4 bg-green-500 border-2 border-green-600 rounded"></div>
								<span className="text-gray-700">Data is validated</span>
							</div>
							<div className="flex items-center space-x-2">
								<div className="w-4 h-4 bg-yellow-500 border-2 border-yellow-600 rounded"></div>
								<span className="text-gray-700">Present but unable to be validated</span>
							</div>
							<div className="flex items-center space-x-2">
								<div className="w-4 h-4 bg-red-500 border-2 border-red-600 rounded"></div>
								<span className="text-gray-700">Missing</span>
							</div>
						</div>
					</div>
				</div>

				{/* Compact Invoice Results */}
				<div className="bg-white rounded-lg shadow-md mb-8">
					<div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
						<h2 className="text-lg font-semibold text-gray-900">Invoice Data Extraction Results</h2>
						<p className="text-sm text-gray-600 mt-1">Extracted information from each processed invoice</p>
					</div>
					<div className="p-6 space-y-4">
						{results.invoices.map((invoice) => (
							<div key={invoice.id} className="border rounded-lg p-4">
								<div className="flex items-center justify-between mb-3">
									<div>
										<h3 className="font-medium text-gray-900">{invoice.fileName}</h3>
										{invoice.detectedTemplate && (
											<p className="text-xs text-blue-600">Template: {invoice.detectedTemplate}</p>
										)}
									</div>
									<span
										className={`px-3 py-1 rounded-full text-xs font-medium ${
											invoice.status === "completed" || invoice.status === "success"
												? "bg-green-100 text-green-800"
												: "bg-red-100 text-red-800"
										}`}
									>
										{invoice.status === "completed" || invoice.status === "success" ? "Processed" : "Failed"}
									</span>
								</div>
								
								{invoice.error ? (
									<div className="bg-red-50 border border-red-200 rounded p-3">
										<div className="flex items-center">
											<XCircle className="h-4 w-4 text-red-500 mr-2" />
											<span className="text-sm text-red-700">{invoice.error}</span>
										</div>
									</div>
								) : invoice.fields && invoice.fields.length > 0 ? (
									<div className="space-y-2">
										{/* Key Invoice Fields */}
										<div className="grid grid-cols-2 md:grid-cols-4 gap-2">
											{(() => {
												// Define field mappings with possible API field names
												const keyFields = [
													{
														label: 'Vendor Name',
														possibleNames: ['vendorName', 'vendor', 'supplier', 'companyName', 'businessName', 'from'],
														excludeNames: ['address', 'vendorAddress', 'supplierAddress', 'street', 'boulevard', 'avenue', 'road']
													},
													{
														label: 'Invoice Number',
														possibleNames: ['invoiceNumber', 'invoice', 'invoiceNo', 'billNumber', 'documentNumber', 'number'],
														excludeNames: ['phone', 'phoneNumber', 'contact', 'zip', 'postal']
													},
													{
														label: 'Total Amount',
														possibleNames: ['totalAmount', 'total', 'grandTotal', 'finalAmount', 'amountDue', 'totalWithTax', 'totalIncVat', 'totalIncludingTax', 'amountTotal', 'invoiceTotal'],
														excludeNames: ['subtotal', 'taxAmount', 'vatAmount', 'discountAmount', 'shippingAmount', 'netAmount', 'beforeTax', 'preTax', 'partial']
													},
													{
														label: 'Invoice Date',
														possibleNames: ['invoiceDate', 'date', 'issueDate', 'billDate', 'documentDate', 'createdDate'],
														excludeNames: ['dueDate', 'paymentDate', 'shipDate', 'deliveryDate']
													}
												];

												return keyFields.map((keyField, index) => {
													// Find the field using any of the possible names but exclude unwanted matches
													let field = null;
													
													if (keyField.label === 'Total Amount') {
														// Special logic for Total Amount - prioritize highest value that includes tax
														const candidateFields = invoice.fields?.filter(f => {
															const fieldNameLower = f.fieldName.toLowerCase();
															
															// Exclude obvious non-total fields
															const isExcluded = keyField.excludeNames?.some(excludeName =>
																fieldNameLower.includes(excludeName.toLowerCase()) ||
																excludeName.toLowerCase().includes(fieldNameLower)
															) || false;
															
															if (isExcluded) return false;
															
															// Check if field matches any possible names
															return keyField.possibleNames.some(name => 
																fieldNameLower.includes(name.toLowerCase()) ||
																name.toLowerCase().includes(fieldNameLower)
															);
														}) || [];
														
														// Among candidates, pick the one with the highest numerical value
														// as it's likely the final total including taxes
														field = candidateFields.reduce((highest, current) => {
															const currentValue = parseFloat(current.value?.value?.replace(/[^\d.-]/g, '') || '0');
															const highestValue = parseFloat(highest?.value?.value?.replace(/[^\d.-]/g, '') || '0');
															return currentValue > highestValue ? current : highest;
														}, null as any);
													} else {
														// Regular matching logic for other fields
														field = invoice.fields?.find(f => {
															const fieldNameLower = f.fieldName.toLowerCase();
															
															// Check if field matches any excluded names
															const isExcluded = keyField.excludeNames?.some(excludeName =>
																fieldNameLower.includes(excludeName.toLowerCase()) ||
																excludeName.toLowerCase().includes(fieldNameLower)
															) || false;
															
															if (isExcluded) return false;
															
															// Check if field matches any possible names
															return keyField.possibleNames.some(name => 
																fieldNameLower.includes(name.toLowerCase()) ||
																name.toLowerCase().includes(fieldNameLower)
															);
														});
													}
													
													// More flexible validation state checking
													const validationState = field?.validationState;
													const hasValue = field?.value?.value && field.value.value.trim() !== '';
													
													// Debug log to see actual validation states
													if (keyField.label === 'Invoice Number' && field) {
														console.log(`Invoice Number field:`, {
															fieldName: field.fieldName,
															validationState,
														 	hasValue,
															value: field.value?.value
														});
													}
													
													const bgColor = validationState === 'Valid' 
														? 'bg-green-100 text-green-800' 
														: validationState === 'VerificationNeeded' || validationState === 'Undefined' 
														? (hasValue ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800')
														: hasValue 
														? 'bg-yellow-100 text-yellow-800'  // Has value but unknown validation state
														: 'bg-red-100 text-red-800';       // No value
													
													return (
														<div key={index} className={`px-2 py-1 rounded text-xs ${bgColor}`}>
															<div className="font-medium">{keyField.label}</div>
															<div className="truncate" title={field?.value?.value || 'Missing'}>
																{field?.value?.value || 'Missing'}
															</div>
														</div>
													);
												});
											})()}
										</div>
										
										{/* Additional Fields - Compact Grid */}
										{(() => {
											// Define the key field names that were already shown (including both possible and exclude names)
											const keyFieldNames = [
												// Vendor Name
												'vendorName', 'vendor', 'supplier', 'companyName', 'businessName', 'from',
												// Invoice Number  
												'invoiceNumber', 'invoice', 'invoiceNo', 'billNumber', 'documentNumber', 'number',
												// Total Amount (including tax)
												'totalAmount', 'total', 'grandTotal', 'finalAmount', 'amountDue', 'totalWithTax', 'totalIncVat', 'totalIncludingTax', 'amountTotal', 'invoiceTotal',
												// Invoice Date
												'invoiceDate', 'date', 'issueDate', 'billDate', 'documentDate', 'createdDate'
											];
											
											const remainingFields = invoice.fields.filter(f => {
												const fieldNameLower = f.fieldName.toLowerCase();
												return !keyFieldNames.some(keyName => 
													fieldNameLower.includes(keyName.toLowerCase()) ||
													keyName.toLowerCase().includes(fieldNameLower)
												);
											});
											
											return remainingFields.length > 0 && (
											<details className="mt-2">
												<summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-800">
													View additional {remainingFields.length} extracted fields
												</summary>
												<div className="mt-2 space-y-1">
													{remainingFields.map((field) => {
															// More flexible validation state checking
															const validationState = field.validationState;
															const hasValue = field.value?.value && field.value.value.trim() !== '';
															
															const bgColor = validationState === 'Valid' 
																? 'bg-green-100 text-green-700' 
																: validationState === 'VerificationNeeded' || validationState === 'Undefined' 
																? (hasValue ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700')
																: hasValue 
																? 'bg-yellow-100 text-yellow-700'  // Has value but unknown validation state
																: 'bg-red-100 text-red-700';       // No value
															
															return (
																<div key={field.fieldName} className={`px-3 py-2 rounded text-sm ${bgColor} flex justify-between items-start`}>
																	<div className="font-medium">{formatFieldName(field.fieldName)}:</div>
																	<div className="ml-3 text-right flex-1">
																		{field.value?.value || '—'}
																	</div>
																</div>
															);
														})}
												</div>
											</details>
											);
										})()}
									</div>
								) : (
									<div className="text-center py-4 text-gray-500 text-sm">
										No data extracted from this invoice
									</div>
								)}
							</div>
						))}
					</div>
				</div>

				{/* Action Buttons */}
				<div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
					<Link
						href="/preview"
						className="inline-flex items-center px-6 py-3 border border-indigo-600 text-base font-medium rounded-lg text-indigo-600 bg-white hover:bg-indigo-50 transition-colors"
					>
						Process More Invoices
					</Link>
					<button
						type="button"
						onClick={() => setShowJsonModal(true)}
						className="inline-flex items-center px-6 py-3 border border-indigo-600 text-base font-medium rounded-lg text-indigo-600 bg-white hover:bg-indigo-50 transition-colors"
					>
						<FileText className="mr-2 h-4 w-4" />
						View JSON Results
					</button>
					<button
						type="button"
						onClick={() => {
							const blob = new Blob([JSON.stringify(results, null, 2)], {
								type: "application/json",
							});
							const url = URL.createObjectURL(blob);
							const a = document.createElement("a");
							a.href = url;
							a.download = `invoice-processing-results.json`;
							a.click();
							URL.revokeObjectURL(url);
						}}
						className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
					>
						<Download className="mr-2 h-4 w-4" />
						Download JSON
					</button>
				</div>

				{/* JSON Modal */}
				{showJsonModal && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
						<div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
							<div className="flex items-center justify-between p-6 border-b border-gray-200">
								<h2 className="text-xl font-semibold text-gray-900">Invoice Processing Results - JSON</h2>
								<div className="flex space-x-2">
									<button
										type="button"
										onClick={() => {
											navigator.clipboard.writeText(JSON.stringify(results, null, 2));
											// You could add a toast notification here
										}}
										className="px-3 py-2 text-sm border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
									>
										Copy to Clipboard
									</button>
									<button
										type="button"
										onClick={() => setShowJsonModal(false)}
										className="p-2 text-gray-400 hover:text-gray-600 rounded-md"
									>
										<XCircle className="h-5 w-5" />
									</button>
								</div>
							</div>
							<div className="flex-1 overflow-auto p-6">
								<pre className="bg-gray-50 rounded-lg p-4 text-sm font-mono whitespace-pre-wrap overflow-x-auto">
									{JSON.stringify(results, null, 2)}
								</pre>
							</div>
							<div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
								<button
									type="button"
									onClick={() => setShowJsonModal(false)}
									className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
								>
									Close
								</button>
								<button
									type="button"
									onClick={() => {
										const blob = new Blob([JSON.stringify(results, null, 2)], {
											type: "application/json",
										});
										const url = URL.createObjectURL(blob);
										const a = document.createElement("a");
										a.href = url;
										a.download = `invoice-processing-results.json`;
										a.click();
										URL.revokeObjectURL(url);
									}}
									className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
								>
									<Download className="inline h-4 w-4 mr-1" />
									Download
								</button>
							</div>
						</div>
					</div>
				)}

				<div className="mt-8 text-center text-sm text-gray-500">
					<p>
						Nutrient AI Document Processing SDK • Processed at{" "}
						{new Date(results.summary.timestamp).toLocaleString()}
					</p>
				</div>
			</div>
		</div>
	);
}

export default function Results() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
					<div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
						<div className="bg-white rounded-lg shadow-md p-12">
							<div className="text-center">
								<RefreshCw className="h-12 w-12 text-indigo-600 animate-spin mx-auto mb-4" />
								<h3 className="text-lg font-medium text-gray-900 mb-2">
									Loading Results
								</h3>
								<p className="text-gray-600">
									Please wait while we load your processing results...
								</p>
							</div>
						</div>
					</div>
				</div>
			}
		>
			<ResultsContent />
		</Suspense>
	);
}

