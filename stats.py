import sqlite3
from urllib.parse import urlparse

def get_count(cursor, table_name):
    cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
    return cursor.fetchone()[0]

def extract_domain(url):
    parsed_url = urlparse(url)
    domain = parsed_url.netloc
    domain = domain.replace('www.', '').rstrip('/')
    return domain

def main():
    conn = sqlite3.connect('instance/chat.db')
    cursor = conn.cursor()
    
    tables = [
        'conversation',
        'message',
        'commodity_futures',
        'function_call',
        'headlines'
    ]
    
    print("DAtabase record counts:")
    for table in tables:
        try:
            count = get_count(cursor, table)
            print(f"{table}: {count} records")
        except sqlite3.Error as e:
            print(f"Error accessing {table}!!!! {e}")
    
    try:
        cursor.execute("SELECT URL FROM headlines")
        links = cursor.fetchall()
        domains = set()
        
        for link in links:
            if link[0]:
                domain = extract_domain(link[0])
                domains.add(domain)
        
        print("\nunique domains from headlines:")
        for domain in domains:
            print(domain)
    
    except sqlite3.Error as e:
        print(f"error accessing headlines table: {e}")
    
    conn.close()

if __name__ == "__main__":
    main()
