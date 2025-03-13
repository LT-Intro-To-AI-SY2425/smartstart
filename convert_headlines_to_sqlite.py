import pandas as pd
import sqlite3
from datetime import datetime
from tqdm import tqdm

CHUNK_SIZE = 50000

print("starting headlines import...")

conn = sqlite3.connect('instance/chat.db')
# enable WAL mode for better write performance
conn.execute('PRAGMA journal_mode=WAL')
# disable synchronous writes for speed
conn.execute('PRAGMA synchronous=OFF')
# increase page size for large datasets
conn.execute('PRAGMA page_size=4096')
# increase cache size to 1GB
conn.execute('PRAGMA cache_size=-1000000')

conn.execute('BEGIN TRANSACTION')

try:
    # count total rows first for progress bar
    total_rows = sum(1 for _ in open('data_sources/massive_headlines.csv', 'r', encoding='utf-8')) - 1  # subtract header
    print(f"total rows to process: {total_rows:,}")

    # process in chunks with progress bar
    with tqdm(total=total_rows, desc="importing headlines") as pbar:
        for chunk_number, chunk in enumerate(pd.read_csv(
            'data_sources/massive_headlines.csv',
            header=0,
            chunksize=CHUNK_SIZE,
            dtype={
                'Date': str,
                'Publication': str,
                'Headline': str,
                'URL': str
            }
        )):
            # convert Date column to datetime
            chunk['Date'] = pd.to_datetime(chunk['Date'], format='%Y%m%d')
            
            # write chunk to sqlite
            if chunk_number == 0:
                # first chunk: create table
                chunk.to_sql('headlines', conn, if_exists='replace', index=False)
            else:
                # subsequent chunks: append
                chunk.to_sql('headlines', conn, if_exists='append', index=False)
            
            pbar.update(len(chunk))

    # create indexes after data is loaded
    print("\ncreating indexes...")
    conn.execute('CREATE INDEX IF NOT EXISTS idx_headlines_date ON headlines(Date)')
    conn.execute('CREATE INDEX IF NOT EXISTS idx_headlines_publication ON headlines(Publication)')
    
    # commit transaction
    conn.commit()
    
    print("optimizing database...")
    conn.execute('VACUUM')
    
    print("import completed successfully!")

except Exception as e:
    print(f"error during import: {str(e)}")
    conn.rollback()
    raise

finally:
    # reset pragmas to default values
    conn.execute('PRAGMA journal_mode=DELETE')
    conn.execute('PRAGMA synchronous=FULL')
    conn.close() 