
import sys
import tabula
import pandas as pd
import json

# Get the file paths from the command-line arguments
pdf_path = sys.argv[1]
output_path = sys.argv[2]

try:
    # Use tabula to read all tables from the PDF.
    # The 'pages="all"' argument tells it to search every page.
    tables = tabula.read_pdf(pdf_path, pages="all", multiple_tables=True)

    # Check if any tables were found
    if tables:
        # We'll use the first table found for this example.
        # Tabula returns a list of pandas DataFrames.
        first_table_df = tables[0]
        
        # Convert the DataFrame to a JSON string with an 'orient' of 'records'.
        # This format is perfect for data grids: [{"col1": "val1"}, {"col2": "val2"}]
        first_table_df.to_json(output_path, orient="records")
    else:
        # If no tables are found, create an empty JSON file
        with open(output_path, 'w') as f:
            json.dump([], f)

except Exception as e:
    # If there's an error, print it so Node.js can see it
    print(f"Error processing PDF: {e}", file=sys.stderr)
    sys.exit(1)