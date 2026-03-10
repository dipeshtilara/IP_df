import PyPDF2
pdf = PyPDF2.PdfReader(open(r'c:\Users\Ittea\.gemini\antigravity\scratch\Pandas_DF\Information Pratice.pdf', 'rb'))
text = '\n'.join([p.extract_text() for p in pdf.pages])
with open(r'c:\Users\Ittea\.gemini\antigravity\scratch\Pandas_DF\extracted_text.txt', 'w', encoding='utf-8') as f:
    f.write(text)
print("Extracted text to extracted_text.txt")
