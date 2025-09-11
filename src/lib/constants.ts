import type { DocumentTemplate, InvoiceCollection } from "@/types";

// Document template definitions for invoices
export const DOCUMENT_TEMPLATES: DocumentTemplate[] = [
	{
		name: "Standard Invoice",
		identifier: "standard_invoice",
		semanticDescription: "Standard business invoice for goods or services",
		fields: [
			{
				name: "vendorName",
				semanticDescription: "Name of the vendor or supplier company",
				format: "Text",
				validationMethod: null,
			},
			{
				name: "vendorAddress",
				semanticDescription: "Address of the vendor or supplier",
				format: "Text",
				validationMethod: "PostalAddressIntegrity",
			},
			{
				name: "vendorTaxId",
				semanticDescription: "Vendor tax ID or business registration number",
				format: "Text",
				validationMethod: null,
			},
			{
				name: "customerName",
				semanticDescription: "Name of the customer or buyer",
				format: "Text",
				validationMethod: null,
			},
			{
				name: "customerAddress",
				semanticDescription: "Customer billing or shipping address",
				format: "Text",
				validationMethod: "PostalAddressIntegrity",
			},
			{
				name: "invoiceNumber",
				semanticDescription: "Unique invoice number or identifier",
				format: "Text",
				validationMethod: null,
			},
			{
				name: "invoiceDate",
				semanticDescription: "Date the invoice was issued",
				format: "Date",
				validationMethod: "DateIntegrity",
			},
			{
				name: "dueDate",
				semanticDescription: "Payment due date",
				format: "Date",
				validationMethod: "DateIntegrity",
			},
			{
				name: "subtotal",
				semanticDescription: "Subtotal amount before taxes",
				format: "Currency",
				validationMethod: "CurrencyIntegrity",
			},
			{
				name: "taxAmount",
				semanticDescription: "Total tax amount",
				format: "Currency",
				validationMethod: "CurrencyIntegrity",
			},
			{
				name: "totalAmount",
				semanticDescription: "Total amount due including taxes",
				format: "Currency",
				validationMethod: "CurrencyIntegrity",
			},
			{
				name: "paymentTerms",
				semanticDescription: "Payment terms and conditions",
				format: "Text",
				validationMethod: null,
			},
		],
	},
	{
		name: "Purchase Order",
		identifier: "purchase_order",
		semanticDescription: "Purchase order document for procurement",
		fields: [
			{
				name: "poNumber",
				semanticDescription: "Purchase order number",
				format: "Text",
				validationMethod: null,
			},
			{
				name: "vendorName",
				semanticDescription: "Name of the vendor or supplier",
				format: "Text",
				validationMethod: null,
			},
			{
				name: "buyerName",
				semanticDescription: "Name of the purchasing company",
				format: "Text",
				validationMethod: null,
			},
			{
				name: "orderDate",
				semanticDescription: "Date the purchase order was created",
				format: "Date",
				validationMethod: "DateIntegrity",
			},
			{
				name: "totalAmount",
				semanticDescription: "Total order amount",
				format: "Currency",
				validationMethod: "CurrencyIntegrity",
			},
		],
	},
	{
		name: "Receipt",
		identifier: "receipt",
		semanticDescription: "Receipt for goods or services purchased",
		fields: [
			{
				name: "merchantName",
				semanticDescription: "Name of the merchant or business",
				format: "Text",
				validationMethod: null,
			},
			{
				name: "merchantAddress",
				semanticDescription: "Address of the merchant",
				format: "Text",
				validationMethod: "PostalAddressIntegrity",
			},
			{
				name: "receiptNumber",
				semanticDescription: "Receipt or transaction number",
				format: "Text",
				validationMethod: null,
			},
			{
				name: "transactionDate",
				semanticDescription: "Date of the transaction",
				format: "Date",
				validationMethod: "DateIntegrity",
			},
			{
				name: "totalAmount",
				semanticDescription: "Total amount paid",
				format: "Currency",
				validationMethod: "CurrencyIntegrity",
			},
			{
				name: "taxAmount",
				semanticDescription: "Tax amount charged",
				format: "Currency",
				validationMethod: "CurrencyIntegrity",
			},
			{
				name: "paymentMethod",
				semanticDescription: "Method of payment (cash, card, etc.)",
				format: "Text",
				validationMethod: null,
			},
		],
	},
	{
		name: "Utility Bill",
		identifier: "utility_bill",
		semanticDescription: "Utility bill for services like electricity, gas, water",
		fields: [
			{
				name: "serviceProvider",
				semanticDescription: "Name of the utility company",
				format: "Text",
				validationMethod: null,
			},
			{
				name: "accountNumber",
				semanticDescription: "Customer account number",
				format: "Text",
				validationMethod: null,
			},
			{
				name: "customerName",
				semanticDescription: "Name of the customer",
				format: "Text",
				validationMethod: null,
			},
			{
				name: "serviceAddress",
				semanticDescription: "Service address",
				format: "Text",
				validationMethod: "PostalAddressIntegrity",
			},
			{
				name: "billingPeriodStart",
				semanticDescription: "Start date of billing period",
				format: "Date",
				validationMethod: "DateIntegrity",
			},
			{
				name: "billingPeriodEnd",
				semanticDescription: "End date of billing period",
				format: "Date",
				validationMethod: "DateIntegrity",
			},
			{
				name: "dueDate",
				semanticDescription: "Payment due date",
				format: "Date",
				validationMethod: "DateIntegrity",
			},
			{
				name: "amountDue",
				semanticDescription: "Total amount due",
				format: "Currency",
				validationMethod: "CurrencyIntegrity",
			},
		],
	},
	{
		name: "Service Invoice",
		identifier: "service_invoice",
		semanticDescription: "Invoice for professional services rendered",
		fields: [
			{
				name: "serviceProvider",
				semanticDescription: "Name of the service provider or consultant",
				format: "Text",
				validationMethod: null,
			},
			{
				name: "clientName",
				semanticDescription: "Name of the client receiving services",
				format: "Text",
				validationMethod: null,
			},
			{
				name: "invoiceNumber",
				semanticDescription: "Service invoice number",
				format: "Text",
				validationMethod: null,
			},
			{
				name: "serviceDate",
				semanticDescription: "Date services were provided",
				format: "Date",
				validationMethod: "DateIntegrity",
			},
			{
				name: "serviceDescription",
				semanticDescription: "Description of services provided",
				format: "Text",
				validationMethod: null,
			},
			{
				name: "hoursWorked",
				semanticDescription: "Number of hours worked",
				format: "Number",
				validationMethod: "NumberIntegrity",
			},
			{
				name: "hourlyRate",
				semanticDescription: "Hourly rate for services",
				format: "Currency",
				validationMethod: "CurrencyIntegrity",
			},
			{
				name: "totalAmount",
				semanticDescription: "Total amount for services",
				format: "Currency",
				validationMethod: "CurrencyIntegrity",
			},
		],
	},
];

// Invoice collection for preview and processing
export const INVOICE_COLLECTION: InvoiceCollection = {
	id: "sample-invoices",
	name: "Sample Invoice Collection",
	description: "Collection of 3 sample invoice templates for demonstration",
	invoices: [
		{
			id: "inv-001",
			filename: "Corporate Green Invoice Template.pdf",
			vendorName: "Corporate Design Solutions",
			invoiceNumber: "CDS-2024-001",
			date: "2024-01-15",
			amount: "$2,450.00",
			status: "pending"
		},
		{
			id: "inv-002", 
			filename: "Minimalist Purple Invoice Template.pdf",
			vendorName: "Creative Studio Purple",
			invoiceNumber: "CSP-2024-002",
			date: "2024-01-22",
			amount: "$1,875.50",
			status: "pending"
		},
		{
			id: "inv-003",
			filename: "Modern Blue Invoice Template.pdf", 
			vendorName: "Modern Design Co",
			invoiceNumber: "MDC-2024-003",
			date: "2024-01-28",
			amount: "$3,200.00",
			status: "pending"
		}
	]
};

// API configuration
export const API_CONFIG = {
	baseUrl:
		process.env.NEXT_PUBLIC_NUTRIENT_API_URL || "https://api.xtractflow.com",
	authToken: process.env.NUTRIENT_AUTH_TOKEN || "",
};

// Processing steps for UI
export const PROCESSING_STEPS = [
	{ id: 1, name: "Loading invoice collection", status: "pending" as const },
	{ id: 2, name: "Classifying invoice types", status: "pending" as const },
	{ id: 3, name: "Extracting invoice data", status: "pending" as const },
	{ id: 4, name: "Validating extracted information", status: "pending" as const },
	{ id: 5, name: "Generating processing results", status: "pending" as const },
];
