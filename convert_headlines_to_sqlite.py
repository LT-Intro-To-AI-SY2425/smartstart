import pandas as pd
import sqlite3
from datetime import datetime
from tqdm import tqdm
import re

CHUNK_SIZE = 50000

def is_valid_headline(headline):
    """
    returns True if a headline contains at least 3 meaningful words
    (excluding numbers, symbols, and certain unwanted characters)
    """
    # remove symbols like bullets, dashes, and other unwanted characters at the start
    headline = headline.lstrip('•-:,.')
    
    words = re.findall(r'\b[A-Za-z]+\b', headline)
    
    return len(words) >= 3

print("starting headlines import...")

conn = sqlite3.connect('instance/chat.db')

# enable performance optimizations
conn.execute('PRAGMA journal_mode=WAL')
conn.execute('PRAGMA synchronous=OFF')
conn.execute('PRAGMA page_size=4096')
conn.execute('PRAGMA cache_size=-1000000')

cursor = conn.cursor()
cursor.execute("SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name='headlines'")
table_exists = cursor.fetchone()[0] > 0

if table_exists:
    cursor.execute("SELECT COUNT(*) FROM headlines")
    existing_count = cursor.fetchone()[0]
    
    if existing_count > 0:
        confirm = input(f"\nThe database already contains {existing_count:,} headlines. Do you want to delete them and reimport? (yes/no): ").strip().lower()
        if confirm != "yes":
            print("import canceled")
            conn.close()
            exit()

        print("\ndeleting existing headlines...")
        conn.execute("DELETE FROM headlines")
        conn.commit()

print("\nstarting data import...")

conn.execute('BEGIN TRANSACTION')

try:
    # count total rows first for progress bar
    # some rows may be removed down the line but this is just a guess
    total_rows = sum(1 for _ in open('data_sources/massive_headlines.csv', 'r', encoding='utf-8')) - 1  # subtract header
    print(f"total rows to process: {total_rows:,}")

    # process in chunks with a progress bar
    with tqdm(total=total_rows, desc="importing headlines") as pbar:
        for chunk_number, chunk in enumerate(pd.read_csv(
            'data_sources/massive_headlines.csv',
            header=0,
            chunksize=CHUNK_SIZE,
            dtype={'Date': str, 'Publication': str, 'Headline': str, 'URL': str}
        )):
            # crop rows where Date, Headline, or URL are missing
            chunk = chunk.dropna(subset=['Date', 'Headline', 'URL'])

            # filter out rows where Headline or URL are shorter than 4 characters
            chunk = chunk[(chunk['Headline'].str.len() >= 4) & (chunk['URL'].str.len() >= 4)]

            # filter out invalid URLs (must start with http:// or https://)
            chunk = chunk[chunk['URL'].str.startswith(("http://", "https://"))]

            chunk = chunk[chunk['Headline'].apply(is_valid_headline)]
            
            # convert Date column to datetime, ensuring invalid dates become NaT
            chunk['Date'] = pd.to_datetime(chunk['Date'], format='%Y%m%d', errors='coerce')

            # drop rows with invalid dates
            chunk = chunk.dropna(subset=['Date'])

            if chunk.empty:
                continue  # skip if no valid rows left

            chunk.to_sql('headlines', conn, if_exists='append', index=False)

            pbar.update(len(chunk))

    print("\ncreating indexes...")
    conn.execute('CREATE INDEX IF NOT EXISTS idx_headlines_date ON headlines(Date)')
    conn.execute('CREATE INDEX IF NOT EXISTS idx_headlines_publication ON headlines(Publication)')
    
    conn.commit()
    
    print("optimizing database...")
    conn.execute('VACUUM')
    
    print("da import completeda successfullda")

except Exception as e:
    print(f"error during import: {str(e)}")
    conn.rollback()
    raise

finally:
    # reset pragmas to default values
    conn.execute('PRAGMA journal_mode=DELETE')
    conn.execute('PRAGMA synchronous=FULL')
    conn.close()
