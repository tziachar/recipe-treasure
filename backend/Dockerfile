# Επιλέγουμε το image της Python
FROM python:3.12-slim

# Ορίζουμε τον working directory στο container
WORKDIR /app

# Αντιγράφουμε το αρχείο requirements.txt από το root του project
COPY ./requirements.txt .

# Εγκαθιστούμε τις εξαρτήσεις του backend
RUN pip install --no-cache-dir -r requirements.txt

# Αντιγράφουμε όλο το περιεχόμενο του φακέλου "source" στο container
COPY . /app


# Εκθέτουμε το port 8000
EXPOSE 8000

# Εκτέλεση της εφαρμογής με uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
