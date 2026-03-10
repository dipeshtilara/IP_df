import sys

try:
    import pypdf
    import docx
except ImportError:
    print("Dependencies not found.")
    sys.exit(1)

def extract_pdf(path):
    text = ""
    try:
        reader = pypdf.PdfReader(path)
        for page in reader.pages:
            text += page.extract_text() + "\n"
    except Exception as e:
        text = str(e)
    return text

def extract_docx(path):
    text = ""
    try:
        doc = docx.Document(path)
        for para in doc.paragraphs:
            text += para.text + "\n"
    except Exception as e:
        text = str(e)
    return text

pdfs = ["DataFrame based Practice questions.pdf", "droping column_row based on condition.pdf"]
for p in pdfs:
    print(f"Extracting {p}...")
    with open(p + ".txt", "w", encoding="utf-8", errors="replace") as f:
        f.write(extract_pdf(p))

print("Extracting rename Vs reindex.docx...")
with open("rename Vs reindex.docx.txt", "w", encoding="utf-8", errors="replace") as f:
    f.write(extract_docx("rename Vs reindex.docx"))

print("Extraction complete")