// Field format types
export type FieldFormat = "Text" | "Number" | "Date" | "Currency";

// Validation method types
export type ValidationMethod =
	| "PostalAddressIntegrity"
	| "IBANIntegrity"
	| "CreditCardNumberIntegrity"
	| "VehicleIdentificationNumberIntegrity"
	| "EmailIntegrity"
	| "URIIntegrity"
	| "VATIdIntegrity"
	| "PhoneNumberIntegrity"
	| "CurrencyIntegrity"
	| "DateIntegrity"
	| "NumberIntegrity"
	| null;

// Validation state types
export type ValidationState = "Undefined" | "VerificationNeeded" | "Valid";

// Document template field definition
export interface TemplateField {
	name: string;
	semanticDescription: string;
	format: FieldFormat;
	validationMethod: ValidationMethod;
}

// Document template definition
export interface DocumentTemplate {
	name: string;
	fields: TemplateField[];
	identifier: string;
	semanticDescription: string;
}

// Register component request
export interface RegisterComponentRequest {
	enableClassifier: boolean;
	enableExtraction: boolean;
	templates: DocumentTemplate[];
}

// Register component response
export interface RegisterComponentResponse {
	componentId: string;
}

// Field value from processing response
export interface FieldValue {
	value: string;
	format: FieldFormat;
}

// Processed field from API response
export interface ProcessedField {
	fieldName: string;
	value: FieldValue;
	validationState: ValidationState;
}

// Process document response
export interface ProcessDocumentResponse {
	detectedTemplate: string | null;
	fields: ProcessedField[] | null;
}

// Invoice collection definition
export interface InvoiceCollection {
	id: string;
	name: string;
	description: string;
	invoices: InvoiceMetadata[];
}

// Invoice metadata for preview
export interface InvoiceMetadata {
	id: string;
	filename: string;
	vendorName?: string;
	invoiceNumber?: string;
	date?: string;
	amount?: string;
	status: string;
	size?: number;
	lastModified?: string;
}

// Invoice processing summary for results
export interface InvoiceProcessingSummary {
	totalInvoices: number;
	processedInvoices: number;
	validFields: number;
	invalidFields: number;
	missingFields: number;
	overallStatus: "valid" | "needs_review" | "invalid";
}

// Invoice processing result
export interface InvoiceResult {
	id: string;
	filename: string;
	status: "processing" | "completed" | "failed";
	detectedTemplate: string | null;
	fields: {
		name: string;
		value: string;
		status: "valid" | "verification_needed" | "missing" | "invalid";
	}[];
}

// Complete invoice processing results
export interface InvoiceProcessingResults {
	summary: InvoiceProcessingSummary;
	invoices: InvoiceResult[];
}

// Processing step for UI
export interface ProcessingStep {
	id: number;
	name: string;
	status: "pending" | "processing" | "completed" | "failed";
}
