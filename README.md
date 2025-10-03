# Plan Beta Invoice Generator

A professional React-based invoice generator for Plan Beta School of German. Generate beautiful, branded PDF invoices with automatic calculations, multi-currency support, and complete student information tracking.

## Features

- 🎯 **Auto-generated Invoice Numbers** - Format: INV-YYYYMMDD-HHMM
- 💱 **Multi-Currency Support** - EUR (€) and INR (₹)
- 📚 **German Course Levels** - A1, A2, B1, B2 with preset pricing
- 🔄 **Automatic Calculations** - Smart remaining amount calculation
- 📅 **Batch & Schedule Management** - Morning/Evening batches, monthly scheduling
- 📄 **Professional PDF Generation** - Using jsPDF library
- 🎨 **Branded Design** - Red & white color theme
- 📋 **Complete Student Information** - Name, address, email, phone
- 💼 **Business Details Included** - GST, bank details, refund policy

## Tech Stack

- **React 18** - Modern UI library
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **jsPDF** - PDF generation
- **Lucide React** - Beautiful icons

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd invoice gen
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Deployment to Vercel

### Method 1: Deploy via GitHub (Recommended)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Plan Beta Invoice Generator"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository
   - Vercel will auto-detect Vite settings
   - Click "Deploy"

3. **Automatic Deployments:**
   - Every push to `main` branch will trigger automatic deployment
   - Pull requests get preview deployments

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Production deployment:**
   ```bash
   vercel --prod
   ```

## Configuration

The application comes pre-configured with:

- **School Name:** Plan Beta School of German
- **Business Address:** KRA A-23, Chattamby Swamy Nagar, Kannammoola, Thiruvananthapuram, Kerala 695011, India
- **GST Number:** 32AJVPS3359N1ZB
- **Bank Details:**
  - Account Name: PLAN BETA
  - A/C: 50200087416170
  - IFSC: HDFC0009459
- **Email:** info@planbeta.in

### Course Pricing

| Level | Description | INR | EUR |
|-------|-------------|-----|-----|
| A1 | Beginner | ₹14,000 | €134 |
| A2 | Elementary | ₹16,000 | €156 |
| B1 | Intermediate | ₹18,000 | €172 |
| B2 | Upper Intermediate | ₹22,000 | €220 |

## Usage

1. **Invoice Details:** Enter invoice number (or auto-generate), date, and currency
2. **Student Information:** Fill in student name, address, email, and phone
3. **Course Selection:** Choose German level, month, and batch
4. **Payment:** Enter amount payable now (remaining calculates automatically)
5. **Generate PDF:** Click the button to download a professional PDF invoice

## Project Structure

```
invoice gen/
├── src/
│   ├── components/
│   │   └── InvoiceGenerator.jsx    # Main invoice component
│   ├── App.jsx                      # Root component
│   ├── main.jsx                     # Entry point
│   └── index.css                    # Global styles
├── index.html                       # HTML template
├── package.json                     # Dependencies
├── vite.config.js                  # Vite configuration
├── tailwind.config.js              # Tailwind configuration
└── README.md                        # Documentation
```

## License

Private - Plan Beta School of German

## Support

For issues or questions, contact: info@planbeta.in
