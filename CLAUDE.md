# NextJS Invoice Management System - Development Steps

## Project Overview
A NextJS application that demonstrates AI-powered document classification and data extraction for invoices using the XtractFlow API.

## Phase 1: Project Setup and Configuration

### Step 1: Initialize NextJS Project
- Create new NextJS project with TypeScript and Tailwind CSS
- Configure project structure with appropriate folders (`components`, `lib`, `types`, `constants`)
- Set up basic layout and routing structure

### Step 2: Environment Configuration
- Create `.env.local` file for API configuration
- Add environment variables for XtractFlow API base URL and authorization token
- Configure Next.js API routes structure

### Step 3: TypeScript Interfaces and Types
- Create type definitions for API request/response formats
- Define interfaces for:
  - Document templates and fields
  - API responses from `/register-component` and `/process`
  - Validation states and field formats
  - Invoice data structures

### Step 4: Constants and Mock Data
- Create constants file with predefined document templates
- Define the collection of 10 placeholder invoice PDFs with metadata
- Set up sample invoice data (vendor names, amounts, dates) for testing
- Create validation field mappings

## Phase 2: Core API Integration

### Step 5: API Utility Functions
- Create API client utility with proper headers and error handling
- Implement `registerComponent` function for template registration
- Implement `processDocument` function for file processing
- Add retry logic and error handling for API calls

### Step 6: Document Template Management
- Create template definitions for invoice types:
  - Standard Invoice (vendor, customer, invoice number, date, total amount, line items)
  - Purchase Order (PO number, vendor, buyer, items, quantities, prices)
  - Receipt (merchant, date, items, tax, total)
  - Utility Bill (service provider, account number, billing period, amount due)
  - Service Invoice (service provider, description, hours, rate, total)
- Implement template selection and registration logic

### Step 7: File Processing Logic
- Create invoice processing workflow for the 10 predefined invoices
- Implement batch processing for all invoices in the collection
- Add progress tracking for individual file processing
- Handle processing results and map to invoice fields

## Phase 3: UI Components Development

### Step 8: Layout and Navigation
- Create main layout component with responsive design
- Implement step indicator/progress bar for multi-step wizard
- Add header with branding and navigation elements
- Style with modern Tailwind design patterns

### Step 9: Welcome/Overview Page (Step 1)
- Create landing page explaining the POC concept
- Add feature highlights and benefits
- Include "Get Started" CTA button
- Implement smooth transitions to next step

### Step 10: Invoice Preview Page (Step 2)
- Create invoice preview interface displaying 10 placeholder invoice PDFs
- Show invoice thumbnails with file names and metadata
- Display invoice list in a clean, organized layout
- Add hover effects and selection indicators
- Add "Process All Invoices" button to start batch processing

### Step 11: Processing and Results Page (Step 3)
- Create processing status indicators with animations
- Implement real-time status updates (sending → processing → complete)
- Design results display with summary and detailed views
- Add expandable sections for validation details
- Create retry functionality for failed documents

### Step 12: Results Components
- Build summary card showing overall processing status
- Create detailed results sections for each invoice:
  - Vendor/Supplier information (name, address, tax ID)
  - Customer/Buyer information (name, address)
  - Invoice details (number, date, due date, total amount)
  - Line items (description, quantity, unit price, subtotal)
  - Tax and payment information
- Implement validation status indicators (valid/invalid/missing)

## Phase 4: Advanced Features and Polish

### Step 13: Validation and Status Logic
- Implement invoice validation logic
- Create rules for determining "valid" vs "invalid" invoices
- Generate missing data reports for incomplete extractions
- Add field-level validation status display

### Step 14: Error Handling and User Feedback
- Create error boundary components
- Implement graceful error handling for API failures
- Add user-friendly error messages
- Create retry mechanisms for failed operations
- Add loading states and skeleton components

### Step 15: Responsive Design and Accessibility
- Ensure mobile responsiveness across all components
- Add proper ARIA labels and keyboard navigation
- Implement focus management for multi-step wizard
- Test and refine responsive breakpoints

### Step 16: Sample Data and Testing
- Create 10 placeholder invoice PDFs with realistic metadata
- Add sample data sets representing various invoice formats and layouts
- Implement dev mode with mock responses for offline testing
- Add console logging for debugging and demonstration

## Phase 5: Deployment and Optimization

### Step 17: Performance Optimization
- Optimize image loading and component rendering
- Implement proper loading states and suspense boundaries
- Add error boundaries and fallback components
- Optimize bundle size and remove unused dependencies

### Step 18: Vercel Deployment Configuration
- Configure `vercel.json` for optimal deployment settings
- Set up environment variables in Vercel dashboard
- Configure domain and SSL settings
- Test production deployment

### Step 19: Final Testing and Refinement
- Test complete user flow from start to finish
- Verify API integration works correctly in production
- Test error scenarios and edge cases
- Validate responsive design on various devices

### Step 20: Documentation and Demo Preparation
- Create README with setup and usage instructions
- Document API integration and template configuration
- Prepare demo script and talking points
- Add inline code comments for clarity

## API Workflow

The correct sequence for processing documents with the XtractFlow API is:

### 1. Get Predefined Templates
Call `/api/get-predefined-templates` to retrieve available document templates from the system.

### 2. Register Component
Use a template from step 1 to call `/api/register-component`. This creates a processing component and returns a `componentId`.

**Important**: Even when using predefined templates, you must register them to get a valid `componentId`. You cannot use the template's `identifier` directly as a `componentId` for processing.

### 3. Process Documents
Use the `componentId` from step 2 to call `/api/process` with your document files.

### Example Flow
```javascript
// Step 1: Get predefined templates
const templates = await getPredefinedTemplates();

// Step 2: Find and register the desired template
const invoiceTemplate = templates.find(t => t.name.includes('Invoice'));
const registerResponse = await registerComponent([invoiceTemplate]);
const componentId = registerResponse.componentId;

// Step 3: Process invoices
const result = await processDocument(file, componentId);
```

## API Specifications

### Authentication
All API requests require an Authorization header:
```
Authorization: Bearer <your_auth_token>
```

### POST /api/register-component
**Purpose**: Register document templates for classification and extraction

**Request Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "enableClassifier": true,
  "enableExtraction": true,
  "templates": [
    {
      "name": "Standard Invoice",
      "fields": [
        {
          "name": "vendorName",
          "semanticDescription": "Name of the vendor or supplier",
          "format": "Text",
          "validationMethod": null
        },
        {
          "name": "invoiceNumber",
          "semanticDescription": "Unique invoice number",
          "format": "Text",
          "validationMethod": null
        },
        {
          "name": "invoiceDate",
          "semanticDescription": "Date the invoice was issued",
          "format": "Date",
          "validationMethod": "DateIntegrity"
        },
        {
          "name": "totalAmount",
          "semanticDescription": "Total amount due on the invoice",
          "format": "Currency",
          "validationMethod": "CurrencyIntegrity"
        },
        {
          "name": "customerName",
          "semanticDescription": "Name of the customer or buyer",
          "format": "Text",
          "validationMethod": null
        }
      ],
      "identifier": "standard_invoice",
      "semanticDescription": "Standard business invoice for goods or services"
    }
  ]
}
```

**Available Field Formats**:
- `Text`
- `Number` 
- `Date`
- `Currency`

**Available Validation Methods**:
- `PostalAddressIntegrity`
- `IBANIntegrity`
- `CreditCardNumberIntegrity`
- `VehicleIdentificationNumberIntegrity`
- `EmailIntegrity`
- `URIIntegrity`
- `VATIdIntegrity`
- `PhoneNumberIntegrity`
- `CurrencyIntegrity`
- `DateIntegrity`
- `NumberIntegrity`

**Response**:
```json
{
  "componentId": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Response Schema**:
```json
{
  "type": "object",
  "properties": {
    "componentId": {
      "type": "string",
      "format": "uuid"
    }
  }
}
```

### POST /api/process
**Purpose**: Process uploaded documents using registered templates

**Request Headers**:
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body** (FormData):
```json
{
  "inputFile": "<file_binary_data>",
  "componentId": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Supported File Formats**:
- PDF
- PNG
- JPG/JPEG
- DOCX
- TIFF

**Response**:
```json
{
  "detectedTemplate": "standard_invoice",
  "fields": [
    {
      "fieldName": "vendorName",
      "value": {
        "value": "ABC Company Ltd.",
        "format": "Text"
      },
      "validationState": "Valid"
    },
    {
      "fieldName": "invoiceNumber",
      "value": {
        "value": "INV-2024-001",
        "format": "Text"
      },
      "validationState": "Valid"
    },
    {
      "fieldName": "invoiceDate",
      "value": {
        "value": "2024-01-15",
        "format": "Date"
      },
      "validationState": "Valid"
    },
    {
      "fieldName": "totalAmount",
      "value": {
        "value": "$1,250.00",
        "format": "Currency"
      },
      "validationState": "Valid"
    },
    {
      "fieldName": "customerName",
      "value": {
        "value": "XYZ Corporation",
        "format": "Text"
      },
      "validationState": "VerificationNeeded"
    }
  ]
}
```

**Response Schema**:
```json
{
  "type": "object",
  "properties": {
    "detectedTemplate": {
      "type": ["string", "null"]
    },
    "fields": {
      "type": ["array", "null"],
      "items": {
        "type": "object",
        "properties": {
          "fieldName": {
            "type": "string"
          },
          "value": {
            "type": "object",
            "properties": {
              "value": {
                "type": "string"
              },
              "format": {
                "enum": ["Text", "Number", "Date", "Currency"]
              }
            }
          },
          "validationState": {
            "enum": ["Undefined", "VerificationNeeded", "Valid"]
          }
        }
      }
    }
  }
}
```

**Validation States**:
- `Valid`: Field passed validation
- `VerificationNeeded`: Field extracted but requires manual verification
- `Undefined`: Field could not be validated or extracted

### GET /api/get-predefined-templates
**Purpose**: Retrieve predefined document templates available in the system

**Request Headers**:
```
Authorization: D5866799-4283-45DF-9E3A-263D4EDE07A3
```

**Example Usage**:
```javascript
fetch('https://api.xtractflow.com/api/get-predefined-templates', {
  headers: {
    Authorization: 'D5866799-4283-45DF-9E3A-263D4EDE07A3'
  }
})
```

**Response**:
```json
[
  {
    "name": "…",
    "fields": [
      {
        "name": "…",
        "semanticDescription": "…",
        "format": "Text",
        "validationMethod": "PostalAddressIntegrity"
      }
    ],
    "identifier": "…",
    "semanticDescription": "…"
  }
]
```

**Response Schema**:
```json
{
  "schema": {
    "type": "array",
    "items": {
      "required": [
        "fields"
      ],
      "type": "object",
      "properties": {
        "name": {
          "type": "string"
        },
        "fields": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "name": {
                "type": "string"
              },
              "semanticDescription": {
                "type": "string"
              },
              "format": {
                "enum": [
                  "Text",
                  "Number",
                  "Date",
                  "Currency"
                ]
              },
              "validationMethod": {
                "enum": [
                  "PostalAddressIntegrity",
                  "IBANIntegrity",
                  "CreditCardNumberIntegrity",
                  "VehicleIdentificationNumberIntegrity",
                  "EmailIntegrity",
                  "URIIntegrity",
                  "VATIdIntegrity",
                  "PhoneNumberIntegrity",
                  "CurrencyIntegrity",
                  "DateIntegrity",
                  "NumberIntegrity",
                  null
                ],
                "type": [
                  null,
                  "null"
                ]
              }
            }
          }
        },
        "identifier": {
          "type": "string"
        },
        "semanticDescription": {
          "type": "string"
        }
      }
    }
  }
}
```

Returns an array of predefined document templates, each containing the same structure as templates used in the `/api/register-component` endpoint.

## Technical Specifications

### Required Dependencies
- Next.js 14+ with App Router
- TypeScript
- Tailwind CSS
- Lucide React (for icons)
- React Hook Form (if needed for complex forms)

### API Base URL
- `https://api.xtractflow.com`

### File Structure
```
src/
├── app/
│   ├── page.tsx (Welcome)
│   ├── preview/page.tsx
│   ├── results/page.tsx
│   └── layout.tsx
├── components/
│   ├── ui/ (reusable components)
│   ├── InvoicePreview.tsx
│   ├── ProcessingStatus.tsx
│   ├── ResultsSummary.tsx
│   └── ResultsDetail.tsx
├── lib/
│   ├── api.ts
│   ├── types.ts
│   └── constants.ts
└── types/
    └── index.ts
```

### Environment Variables
```
NEXT_PUBLIC_XTRACTFLOW_API_URL=https://api.xtractflow.com
XTRACTFLOW_AUTH_TOKEN=your_auth_token_here
```

## Success Criteria
- Functional 3-step wizard interface for invoice processing
- Preview page displaying 10 placeholder invoices with metadata
- Successful API integration with XtractFlow for invoice classification and extraction
- Batch processing of all invoices with progress tracking
- Responsive design that works on mobile and desktop
- Clear demonstration of invoice data extraction and validation
- Professional, modern UI that showcases invoice processing capabilities
- Deployed and accessible via Vercel URL