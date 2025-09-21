import sys
import pdfplumber
import json

pdf_path = sys.argv[1]
output_path = sys.argv[2]

def clean_cell(cell):
    if cell is None:
        return ""
    return cell.strip()

try:
    data = []
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            table = page.extract_table()
            if table:
                headers = [clean_cell(h) for h in table[0]]
                for row in table[1:]:
                    cleaned_row = [clean_cell(cell) for cell in row]
                    # Skip completely empty rows
                    if any(cleaned_row):
                        data.append(dict(zip(headers, cleaned_row)))

    output = {"data": data}

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2)

except Exception as e:
    print(f"Error processing PDF: {e}", file=sys.stderr)
    sys.exit(1)
