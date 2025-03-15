import sqlite3

def get_count(cursor, table_name):
    cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
    return cursor.fetchone()[0]

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
            print(f"error accessing {table}!!!! {e}")
    
    conn.close()

if __name__ == "__main__":
    main()
