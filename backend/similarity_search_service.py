import pandas as pd
from sentence_transformers import SentenceTransformer
import faiss
import os

import warnings
warnings.filterwarnings('ignore', category=UserWarning, module='openpyxl')


# Load the sentence model
model = SentenceTransformer('sentence-transformers/paraphrase-multilingual-mpnet-base-v2')

# Function to read Excel file
def read_excel(file_path):
    return pd.read_excel(file_path, sheet_name=None)

# Function to process terms
def process_terms(term_df):
    term_df = term_df[term_df['deprecated'] == 0]
    alltermcodes = term_df['termCode'].tolist()
    alltermnames = (term_df['termExtendedName'].fillna('') + ' ' + term_df['termShortName'].fillna('') + ' ' + term_df['commonNames'].fillna('') + ' ' + term_df['scientificNames'].fillna('')).tolist()
    alldescriptions = term_df['termScopeNote'].fillna('').tolist()
    return alltermcodes, alltermnames, alldescriptions

# Function to load or create FAISS index
def load_or_create_index(index_file_path, data, model):
    if os.path.exists(index_file_path):
        return faiss.read_index(index_file_path)
    else:
        sentence_embeddings = model.encode(data)
        d = sentence_embeddings.shape[1]
        index = faiss.IndexFlatL2(d)
        index.add(sentence_embeddings)
        faiss.write_index(index, index_file_path)
        return index

# Initialize indexes (you need to adjust the 'folder' variable)
folder = 'source/'
file_path = folder + 'MTX15.xlsx'
dfs = read_excel(file_path)
term_df = dfs['term']
alltermcodes, alltermnames, alldescriptions = process_terms(term_df)

term_index_file_path = folder + '/termindex.idx'
term_index = load_or_create_index(term_index_file_path, alltermnames, model)

desc_index_file_path = folder + '/termdescindex.idx'
desc_index = load_or_create_index(desc_index_file_path, alldescriptions, model)

