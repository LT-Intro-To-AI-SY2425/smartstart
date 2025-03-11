import pandas as pd
import sqlite3

df = pd.read_csv('data_sources/commodity_futures.csv', header=0)

df['Date'] = pd.to_datetime(df['Date'])

column_mapping = {
    'NATURAL GAS': 'NATURAL_GAS',
    'WTI CRUDE': 'WTI_CRUDE',
    'BRENT CRUDE': 'BRENT_CRUDE',
    'LOW SULPHUR GAS OIL': 'LOW_SULPHUR_GAS_OIL',
    'LIVE CATTLE': 'LIVE_CATTLE',
    'SOYBEAN OIL': 'SOYBEAN_OIL',
    'SOYBEAN MEAL': 'SOYBEAN_MEAL',
    'ULS DIESEL': 'ULS_DIESEL',
    'LEAN HOGS': 'LEAN_HOGS',
    'HRW WHEAT': 'HRW_WHEAT'
}

df = df.rename(columns=column_mapping)

conn = sqlite3.connect('instance/chat.db')
df.to_sql('commodity_futures', conn, if_exists='replace', index=False)
conn.close()  